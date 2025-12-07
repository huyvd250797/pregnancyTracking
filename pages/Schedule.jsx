import { useState, useEffect } from "react";
import { pregnancySchedule } from "../src/utils/pregnancySchedule";

export default function CheckupSchedule() {
  const [currentWeek, setCurrentWeek] = useState(null);
  const [hasLmp, setHasLmp] = useState(false);

  // 🩷 Hàm đọc dữ liệu từ localStorage (tái sử dụng)
  const loadPregnancyData = () => {
    const lmp = localStorage.getItem("lmpDate");
    const week = localStorage.getItem("currentWeek");

    console.log("🔍 Load from localStorage:", { lmp, week });

    if (lmp && week) {
      setHasLmp(true);
      setCurrentWeek(Number(week));
    } else {
      setHasLmp(false);
      setCurrentWeek(null);
    }
  };

  // 🚀 Khi component mount hoặc tab thay đổi
  useEffect(() => {
    loadPregnancyData();

    // 👂 Lắng nghe khi PregnancyWeek bắn sự kiện cập nhật
    const handlePregnancyUpdate = (e) => {
      console.log("🔄 Cập nhật từ event:", e.detail);

      const { lmpDate, week } = e.detail;
      setHasLmp(!!lmpDate);
      setCurrentWeek(Number(week));
    };

    window.addEventListener("pregnancyUpdate", handlePregnancyUpdate);

    // ✅ Cleanup khi unmount
    return () => {
      window.removeEventListener("pregnancyUpdate", handlePregnancyUpdate);
    };
  }, []);

  const isCurrentRange = (range) => {
    if (!currentWeek) return false;
    const [start, end] = range.split("-").map(Number);
    return currentWeek >= start && currentWeek <= end;
  };

  // 🩷 Nếu chưa có dữ liệu, hiển thị đang tải
  if (hasLmp && currentWeek === null) {
    return (
      <div className="text-center p-6 text-gray-500 italic">
        Đang xác định tuần thai...
      </div>
    );
  }

  return (
    <div className="schedule-container p-4 max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      {console.log(currentWeek)}

      <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">
        <b> 📅 Lịch Khám Thai</b>
      </h2>

      {!hasLmp ? (
        <div className="text-center text-gray-600 italic p-4 bg-pink-50 rounded-xl border border-pink-200">
          ⚠️ Chưa xác định được, vui lòng nhập ngày LMP ở mục <b>“Tuần thai”</b>
          .
        </div>
      ) : (
        <>
          <div className="text-center mb-6 text-gray-700">
            Tuần thai hiện tại:{" "}
            <span className="font-semibold text-pink-600">
              {currentWeek ?? "Đang tải..."}
            </span>{" "}
          </div>

          {pregnancySchedule.map((item, index) => {
            const active = isCurrentRange(item.weekRange);
            return (
              <div
                key={index}
                className={`schedule-item mb-6 border-l-4 p-4 rounded-xl transition-all duration-300 ${
                  active
                    ? "border-pink-500 bg-pink-50 shadow-md"
                    : "border-gray-300 bg-white"
                }`}
              >
                <h3 className="schedule-title mt-4 text-lg font-semibold text-gray-800">
                  📌 <b>{item.title} </b>
                  <span className="text-sm text-gray-500">
                    (Tuần {item.weekRange})
                  </span>
                </h3>

                <ul className="list-disc pl-5 mt-2 text-gray-700 space-y-1">
                  {item.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>

                <p className="mt-2 text-sm text-gray-600 italic">
                  💡 {item.note}
                </p>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
