import { useEffect, useState } from "react";
import { foodMenu, fruitGuide, vegetableGuide } from "../src/utils/foodData";

export default function FoodGuide() {
  // -----------------------------
  // 🧠 Tuần thai hiện tại (đọc từ localStorage)
  // -----------------------------
  const [currentWeek, setCurrentWeek] = useState(1);
  const [menuIndex, setMenuIndex] = useState(0);

  // Khi component load, đọc tuần thai đã lưu
  useEffect(() => {
    const savedWeek = localStorage.getItem("pregnancyWeek");
    if (savedWeek) setCurrentWeek(parseInt(savedWeek));

    // Random thực đơn tương ứng mỗi lần vào app
    const randomIndex = Math.floor(Math.random() * foodMenu.length);
    setMenuIndex(randomIndex);
  }, []);

  // -----------------------------
  // 🔍 Lấy dữ liệu thực đơn tương ứng
  // Nếu Boss có nhiều tuần, có thể tạo foodMenuWeek[week]
  // -----------------------------
  const dayData = foodMenu[menuIndex];

  // 1. State vẫn cần thiết để lưu trữ trạng thái toggle
  const [isActive, setIsActive] = useState(false);

  // -----------------------------
  // 🎨 Giao diện
  // -----------------------------
  return (
    <div className="p-4 nutrition-container max-w-3xl mx-auto p-6">
      <div className="p-4 nutrition__menu">
        <h1 className="text-3xl font-bold text-pink-500 mb-4 text-center">
          🍱 Thực đơn dinh dưỡng
          {/* – Tuần {currentWeek} */}
        </h1>

        {/* --- Phần thực đơn --- */}
        <div className="bg-base-200 p-6 rounded-2xl shadow-md mb-8">
          {/* <h2 className="text-xl font-semibold mb-2 text-pink-400">
          {dayData.day}
        </h2> */}
          <ul className="text-left leading-relaxed">
            <li>
              <strong>Sáng:</strong> {dayData.breakfast}
            </li>
            <li>
              <strong>Trưa:</strong> {dayData.lunch}
            </li>
            <li>
              <strong>Tối:</strong> {dayData.dinner}
            </li>
          </ul>
        </div>

        <div className="flex justify-center mt-4">
          <button
            className=" nutrition__menu-btnRand"
            onClick={() => {
              const randomIndex = Math.floor(Math.random() * foodMenu.length);
              setMenuIndex(randomIndex);
            }}
          >
            🔄 Gợi ý thực đơn khác
          </button>
        </div>
      </div>

      {/* --- Trái cây nên / không nên --- */}
      <div className="collapse collapse-arrow border-female">
        <input type="checkbox" className="peer" />
        <div className="collapse-title ">🍊 Trái cây</div>
        <div className="collapse-content peer-checked">
          <div className="flex justify-around mt-6 grid md:grid-cols-2 gap-6">
            <div className="bg-green-100 p-5 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-green-600 mb-2">
                ✅ Trái cây nên ăn
              </h3>
              <ul className="list-disc pl-6 text-left">
                {fruitGuide.shouldEat.map((fruit, index) => (
                  <li className="mt-2" key={index}>
                    {fruit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-100 p-5 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-red-600 mb-2">
                🚫 Trái cây cần tránh
              </h3>
              <ul className="list-disc pl-6 text-left">
                {fruitGuide.avoid.map((fruit, index) => (
                  <li className="mt-2" key={index}>
                    {fruit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* --- Rau củ nên / không nên --- */}
      <div className="collapse collapse-arrow border-female">
        <input type="checkbox" className="peer" />
        <div className="collapse-title peer-checked:">🥬 Rau củ</div>
        <div className="collapse-content peer-checked">
          <div className="flex justify-around mt-6 grid md:grid-cols-2 gap-6">
            <div className="bg-green-100 p-5 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-green-600 mb-2">
                ✅ Rau củ nên ăn
              </h3>
              <ul className="list-disc pl-6 text-left">
                {vegetableGuide.shouldEat.map((fruit, index) => (
                  <li className="mt-2" key={index}>
                    {fruit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-100 p-5 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-red-600 mb-2">
                🚫 Rau củ cần tránh
              </h3>
              <ul className="list-disc pl-6 text-left">
                {vegetableGuide.avoid.map((fruit, index) => (
                  <li className="mt-2" key={index}>
                    {fruit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
