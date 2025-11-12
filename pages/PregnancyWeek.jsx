import React, { useState, useEffect, useCallback, useMemo } from "react";

// siêu âm theo tuần
import sieuamImgW6 from "../src/assets/img/sieuam-img-W6.jpg";
import sieuamImgW7 from "../src/assets/img/sieuam-img-W7.jpg";
// import sieuamVideoW7 from "../src/assets/video/sieuam-video-W7.mp4";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

// Sửa lỗi: Thay thế import NPM bằng import CDN URL
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
// Cập nhật: Thêm setLogLevel từ firestore để hỗ trợ gỡ lỗi
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  setLogLevel,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import ImageModal from "../components/ImageModal";
// Lưu ý: __app_id, __firebase_config, và __initial_auth_token là các biến toàn cục được cung cấp bởi môi trường Canvas.

// -----------------------------
// 📋 Dữ liệu mô tả mỗi tuần (mẫu)
// -----------------------------
const weekData = {
  1: {
    title: "Tuần 1 – Khởi đầu hành trình 💖",
    desc: "Cơ thể mẹ bắt đầu chuẩn bị cho việc thụ thai. Hãy bổ sung axit folic và giữ tâm lý thoải mái.",
    todo1: "",
    todo2: "",
    todo3: "",
    image: "https://placehold.co/120x120/f9a8d4/ffffff?text=W1",
    video: "",
  },
  2: {
    title: "Tuần 2 – Giai đoạn trứng rụng 🌸",
    desc: "Đây là lúc cơ thể sẵn sàng cho sự thụ tinh. Giữ chế độ ăn lành mạnh và ngủ đủ giấc.",
    todo1: "",
    todo2: "",
    todo3: "",
    image: "https://placehold.co/120x120/f472b6/ffffff?text=W2",
    video: "",
  },
  3: {
    title: "Tuần 3 – Sự sống bắt đầu 🍼",
    desc: "Phôi thai hình thành và bắt đầu di chuyển vào tử cung để làm tổ. Cần tránh các chất kích thích.",
    todo1: "",
    todo2: "",
    todo3: "",
    image: "https://placehold.co/120x120/ec4899/ffffff?text=W3",
    video: "",
  },
  4: {
    title: "Tuần 4 – Thử thai! 🎉",
    desc: "Đây là lúc bạn có thể thử thai. Phôi thai đang phát triển nhanh chóng.",
    todo1: "",
    todo2: "",
    todo3: "",
    image: "https://placehold.co/120x120/db2777/ffffff?text=W4",
    video: "",
  },
  6: {
    title: "Tuần 6 – Đã có túi thai! 🎉",
    desc: "Đây là lúc thai đã vào tử cung và làm tổ.",
    todo1: "✔️ Chế độ ăn uống giàu chất xơ, ngăn ngừa táo bón",
    todo2: "✔️ Bổ sung Axit folic",
    todo3: "",
    image: sieuamImgW6,
    video: "",
  },
  7: {
    title: "Tuần 7 – Đã phôi và tim thai ! 💓",
    desc: "Đây là lúc những nhịp đập đầu tiên của bé.",
    todo2: "✔️ Bổ sung Axit folic",
    todo1: "❌ Tránh thực phẩm chứa caffein",
    todo3: "",
    image: sieuamImgW7,
    video: "",
  },
  8: {
    title: "Tuần 8 – Bé đang phát triển rất tốt",
    desc: "Đây là lúc những nhịp đập đầu tiên của bé.",
    todo2: "✔️ Chế độ ăn uống giàu Canxi",
    todo1: "❌ Tránh thực phẩm chứa caffein",
    todo3: "",
    image: "",
    video: "",
  },
  12: {
    title: "Tuần 12 – Mốc siêu âm quan trọng 🩺",
    desc: "Bạn đã vượt qua quý 1! Em bé đã có hình hài rõ ràng và cần thực hiện xét nghiệm sàng lọc.",
    todo1: "",
    todo2: "",
    todo3: "",
    image: "https://placehold.co/120x120/be185d/ffffff?text=W12",
    video: "",
  },
  20: {
    title: "Tuần 20 – Cảm nhận chuyển động 🥰",
    desc: "Thai nhi đã được nửa chặng đường. Mẹ có thể cảm nhận những cú đạp đầu tiên.",
    todo1: "",
    todo2: "",
    todo3: "",
    image: "https://placehold.co/120x120/9d174d/ffffff?text=W20",
    video: "",
  },
  40: {
    title: "Tuần 40 – Chào đón bé yêu! 👶",
    desc: "Em bé đã sẵn sàng chào đời bất cứ lúc nào. Giữ bình tĩnh và chuẩn bị nhập viện.",
    todo1: "",
    todo2: "",
    todo3: "",
    image: "https://placehold.co/120x120/831843/ffffff?text=W40",
    video: "",
  },
};

// -----------------------------
// 📋 Biến khai báo LMP (Tương lai sẽ nhập từ chỗ khác)
// -----------------------------
const declaredLMPConstant = "2025-09-25"; // Ngày LMP mặc định/khai báo (YYYY-MM-DD)

// -----------------------------
// 📏 Công thức tính tuổi thai (Tuần tuổi)
// -----------------------------
const calculateCurrentWeek = (lmpDateStr) => {
  if (!lmpDateStr) return 1;

  const lmpDate = new Date(lmpDateStr);
  const currentDate = new Date();

  // Tính độ lệch múi giờ để đảm bảo tính toán ngày chính xác
  const utcLmp = Date.UTC(
    lmpDate.getFullYear(),
    lmpDate.getMonth(),
    lmpDate.getDate()
  );
  const utcCurrent = Date.UTC(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  // Khoảng thời gian tính bằng milliseconds
  const diffTime = utcCurrent - utcLmp;

  // Khoảng thời gian tính bằng ngày
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Tuần thai được tính từ tuần 1 (ngày 0-6 là tuần 1)
  let currentWeek = Math.floor(diffDays / 7) + 1;

  // Giới hạn trong khoảng 1 đến 40 tuần
  if (currentWeek < 1) currentWeek = 1;
  if (currentWeek > 40) currentWeek = 40;

  return currentWeek;
};

// -----------------------------
// 📅 Tính toán khoảng ngày cho tuần thai
// -----------------------------
const calculateWeekDateRange = (lmpDateStr, targetWeek) => {
  if (!lmpDateStr || targetWeek < 1 || targetWeek > 40) {
    return { startDate: null, endDate: null };
  }

  const lmpDate = new Date(lmpDateStr);

  // Tuần N bắt đầu từ ngày (N-1) * 7 tính từ LMP (ngày 0)
  const startDayOffset = (targetWeek - 1) * 7;

  // Tuần N kết thúc vào ngày (N * 7) - 1 tính từ LMP
  const endDayOffset = targetWeek * 7 - 1;

  const startDate = new Date(lmpDate);
  startDate.setDate(startDate.getDate() + startDayOffset);

  const endDate = new Date(lmpDate);
  endDate.setDate(endDate.getDate() + endDayOffset);

  // Định dạng ngày thành 'DD/MM/YYYY'
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

// -----------------------------
// 🍼 Component chính theo dõi tuần thai
// -----------------------------
export default function App() {
  // -----------------------------
  // 🧠 State quản lý dữ liệu ứng dụng
  // -----------------------------
  const [week, setWeek] = useState(0);
  const [lmpDate, setLmpDate] = useState(""); // Lưu trữ ngày LMP dưới dạng 'YYYY-MM-DD'

  // NEW: State cho tính năng khai báo LMP
  const [isDeclaredLMPUsed, setIsDeclaredLMPUsed] = useState(false); // Mặc định UNCHECKED/FALSE
  const [isLoading, setIsLoading] = useState(true);

  // -----------------------------
  // 🔑 State Firebase & Auth
  // -----------------------------
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

  // Định nghĩa đường dẫn Firestore
  const dataPath = useMemo(() => {
    if (!userId) return null;
    return `artifacts/${appId}/users/${userId}/pregnancy-tracker/status`;
  }, [userId, appId]);

  // -----------------------------
  // ⚙️ Khởi tạo Firebase và Xác thực
  // -----------------------------
  useEffect(() => {
    // try {
    //   const firebaseConfig = JSON.parse(
    //     typeof __firebase_config !== "undefined" ? __firebase_config : "{}"
    //   );
    //   const app = initializeApp(firebaseConfig);
    //   const firestore = getFirestore(app);
    //   const authInstance = getAuth(app);

    //   setDb(firestore);
    //   setAuth(authInstance);

    //   // Thêm setLogLevel('debug') để hỗ trợ gỡ lỗi theo hướng dẫn
    //   setLogLevel("debug");

    //   const authenticate = async () => {
    //     const initialAuthToken =
    //       typeof __initial_auth_token !== "undefined"
    //         ? __initial_auth_token
    //         : null;
    //     if (initialAuthToken) {
    //       await signInWithCustomToken(authInstance, initialAuthToken);
    //     } else {
    //       await signInAnonymously(authInstance);
    //     }
    //     setUserId(authInstance.currentUser?.uid || crypto.randomUUID());
    //     setIsAuthReady(true);
    //   };

    //   authenticate();
    // } catch (error) {
    //   console.error("Firebase Initialization Error:", error);
    //   setIsAuthReady(true);
    //   // FIX: Đảm bảo isLoading được đặt thành false để ứng dụng không bị kẹt ở màn hình tải
    // }
    setIsLoading(false);

    // Nếu có ngày LMP lưu lại
    if (lmpDate) {
      localStorage.setItem("lmpDate", lmpDate);
    }
    // Nếu có ngày LMP lưu tuần thai
    if (week) {
      localStorage.setItem("currentWeek", week.toString());
    }
  }, [lmpDate, week]);

  // -----------------------------
  // 💾 Hàm lưu dữ liệu lên Firestore
  // -----------------------------
  const saveData = useCallback(
    async (currentWeek, currentLmpDate, declaredUsed) => {
      if (!db || !userId || !isAuthReady || !dataPath) return;

      const docRef = doc(db, dataPath);
      try {
        await setDoc(
          docRef,
          {
            lastViewedWeek: currentWeek,
            lmpDate: currentLmpDate,
            isDeclaredLMPUsed: declaredUsed, // NEW: Lưu trạng thái sử dụng ngày khai báo
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error saving data to Firestore:", error);
      }
    },
    [db, userId, isAuthReady, dataPath]
  );

  // -----------------------------
  // 🔄 Lắng nghe và tải dữ liệu từ Firestore
  // -----------------------------
  useEffect(() => {
    if (!db || !isAuthReady || !dataPath) return;

    setIsLoading(true);

    const docRef = doc(db, dataPath);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const storedLmpDate = data.lmpDate || "";

          // NEW: Lấy trạng thái checkbox đã lưu hoặc mặc định là false
          const declaredUsed = data.isDeclaredLMPUsed ?? false;
          setIsDeclaredLMPUsed(declaredUsed);

          let initialLmpDate = storedLmpDate;

          // NEW: Nếu trạng thái là đang sử dụng ngày khai báo, hãy cập nhật lmpDate
          if (declaredUsed) {
            initialLmpDate = declaredLMPConstant;
          } else if (!storedLmpDate) {
            // Nếu không dùng ngày khai báo và không có ngày nào lưu, dùng ngày khai báo làm giá trị ban đầu.
            initialLmpDate = declaredLMPConstant;
          }

          const initialWeek = initialLmpDate
            ? calculateCurrentWeek(initialLmpDate)
            : data.lastViewedWeek || 1;

          setWeek(initialWeek);
          setLmpDate(initialLmpDate);

          // Nếu đây là lần tải đầu tiên và chưa có ngày LMP, hãy lưu ngày mặc định.
          if (!storedLmpDate) {
            saveData(initialWeek, initialLmpDate, declaredUsed);
          }
        } else {
          // NEW: Nếu chưa có dữ liệu, mặc định dùng ngày khai báo
          setLmpDate(declaredLMPConstant);
          setIsDeclaredLMPUsed(false); // Mặc định theo yêu cầu: checkbox = false
          saveData(
            calculateCurrentWeek(declaredLMPConstant),
            declaredLMPConstant,
            false
          );
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching data from Firestore:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, isAuthReady, dataPath, saveData]);

  // -----------------------------
  // NEW: 📢 Chuyển đổi nguồn LMP (Checkbox)
  // -----------------------------
  const handleLmpSourceToggle = (e) => {
    const isChecked = e.target.checked;
    setIsDeclaredLMPUsed(isChecked);

    let newLmpDate;
    if (isChecked) {
      // Nếu CHECKED: Sử dụng ngày khai báo cố định
      newLmpDate = declaredLMPConstant;
    } else {
      // Nếu UNCHECKED: Giữ nguyên ngày hiện tại (hoặc ngày khai báo nếu chưa chỉnh sửa)
      // để người dùng có thể chỉnh sửa thủ công ngay sau đó.
      newLmpDate = lmpDate;
      if (!newLmpDate) {
        newLmpDate = declaredLMPConstant;
      }
    }

    setLmpDate(newLmpDate);
    const calculatedWeek = calculateCurrentWeek(newLmpDate);
    setWeek(calculatedWeek);
    saveData(calculatedWeek, newLmpDate, isChecked);
  };

  // -----------------------------
  // ⏪ Chuyển tuần thai về trước
  // -----------------------------
  const handlePrev = () => {
    setWeek((prevWeek) => {
      const newWeek = Math.max(1, prevWeek - 1);
      saveData(newWeek, lmpDate, isDeclaredLMPUsed);
      // ✅ cập nhật localStorage khi đổi tuần
      localStorage.setItem("currentWeek", newWeek.toString());
      window.dispatchEvent(
        new CustomEvent("pregnancyUpdate", {
          detail: { lmpDate, week: newWeek },
        })
      );
      return newWeek;
    });
  };

  // -----------------------------
  // ⏩ Chuyển sang tuần kế tiếp
  // -----------------------------
  const handleNext = () => {
    setWeek((prevWeek) => {
      const newWeek = Math.min(40, prevWeek + 1); // Giới hạn 40 tuần
      saveData(newWeek, lmpDate, isDeclaredLMPUsed);
      // ✅ cập nhật localStorage khi đổi tuần
      localStorage.setItem("currentWeek", newWeek.toString());
      window.dispatchEvent(
        new CustomEvent("pregnancyUpdate", {
          detail: { lmpDate, week: newWeek },
        })
      );
      return newWeek;
    });
  };

  // -----------------------------
  // 🎯 Chuyển đến Tuần Hiện Tại (Dựa trên LMP)
  // -----------------------------
  const handleGoToCurrentWeek = () => {
    if (!lmpDate) {
      // Thay thế alert() bằng thông báo UI
      console.log("Vui lòng nhập Kỳ Kinh Cuối (LMP) để tính Tuần Hiện Tại.");
      return;
    }

    const calculatedWeek = actualCurrentWeek; // Sử dụng giá trị đã tính toán sẵn
    setWeek(calculatedWeek);
    // Lưu tuần thai hiện tại mới
    saveData(calculatedWeek, lmpDate, isDeclaredLMPUsed);
    // ✅ lưu luôn vào localStorage
    localStorage.setItem("currentWeek", calculatedWeek.toString());
    window.dispatchEvent(
      new CustomEvent("pregnancyUpdate", {
        detail: { lmpDate, week: calculatedWeek },
      })
    );
  };

  // -----------------------------
  // 📅 Cập nhật Kỳ Kinh Cuối (LMP) Thủ Công
  // -----------------------------
  const handleLmpChange = (e) => {
    if (isDeclaredLMPUsed) return;

    const newLmpDate = e.target.value;
    setLmpDate(newLmpDate);
    const calculatedWeek = calculateCurrentWeek(newLmpDate);
    setWeek(calculatedWeek);
    saveData(calculatedWeek, newLmpDate, isDeclaredLMPUsed);

    // ✅ lưu luôn vào localStorage
    localStorage.setItem("lmpDate", newLmpDate);
    localStorage.setItem("currentWeek", calculatedWeek.toString());
  };

  // -----------------------------
  // ✨ Tính toán Tuần Thai Thực Tế (Dựa trên LMP)
  // -----------------------------
  const actualCurrentWeek = useMemo(() => {
    return calculateCurrentWeek(lmpDate);
  }, [lmpDate]);

  // -----------------------------
  // 📅 Tính toán Khoảng Ngày cho Tuần Đang Xem
  // -----------------------------
  const weekDateRange = useMemo(() => {
    return calculateWeekDateRange(lmpDate, week);
  }, [lmpDate, week]);

  // -----------------------------
  // 🌈 Dữ liệu hiển thị theo tuần
  // -----------------------------
  const current = weekData[week] || {
    title: `Tuần ${week} – Đang cập nhật dữ liệu...`,
    desc: "Chưa có thông tin chi tiết cho tuần này. Hãy tham khảo thêm tại các nguồn thông tin y tế.",
    image: `https://placehold.co/120x120/e2e8f0/64748b?text=W${week}`,
  };

  // -----------------------------
  // 🎨 Giao diện
  // -----------------------------
  // if (isLoading || !isAuthReady) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
  //       {/* Placeholder cho loading indicator */}
  //       <p className="text-gray-500 text-lg animate-pulse">
  //         Đang tải dữ liệu thai kỳ...
  //       </p>
  //     </div>
  //   );
  // }

  // Chuyển đổi định dạng ngày cho hiển thị
  const formatDeclaredLMP = (dateStr) => {
    if (!dateStr) return "Chưa có";
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN");
    } catch (e) {
      return "Ngày không hợp lệ";
    }
  };

  return (
    <div className="bgPreWeek max-w-xl mx-auto p-4 md:p-6 bg-white shadow-xl rounded-xl min-h-screen border-t-4 border-pink-500">
      <div className="text-center">
        {/* <p className="text-xs text-gray-500 mb-6">Mã người dùng: {userId}</p> */}
      </div>

      {/* Phần nhập LMP Thủ Công */}
      <div className="p-4  border border-pink-200 bg-pink-50 rounded-lg shadow-inner mb-6">
        <p className="mb-4">
          Kỳ Kinh Cuối (LMP) - <i>Ngày có kinh đầu tiên của kỳ gần nhất</i>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <input
            id="lmp-date"
            type="date"
            value={lmpDate}
            onChange={handleLmpChange}
            // Vô hiệu hóa input nếu đang sử dụng ngày khai báo
            disabled={isDeclaredLMPUsed}
            className={`flex-grow p-2 mb-4 border-radius ${
              isDeclaredLMPUsed
                ? "bg-gray-100 cursor-not-allowed inputLMP"
                : "bg-white border-pink-400 inputLMP"
            }`}
          />

          {/* Phần quản lý nguồn LMP */}
          <div className="yourLMP  bg-indigo-50 rounded-lg shadow-inner mb-6">
            {/* Checkbox Chuyển đổi nguồn */}
            <div className="flex items-center space-x-3 p-2 bg-white rounded-md">
              <input
                id=" use-declared-lmp"
                type="checkbox"
                checked={isDeclaredLMPUsed}
                onChange={handleLmpSourceToggle}
                className="yourLMPcheckbox  h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label
                htmlFor="use-declared-lmp"
                className="text-sm mb-4 ml-4 font-medium text-gray-700 cursor-pointer"
              >
                Ngày LMP của bạn
              </label>
            </div>
            {/* <p
          className={`text-xs mt-2 italic ${
            isDeclaredLMPUsed
              ? "text-indigo-600"
              : "text-pink-600 font-semibold"
          }`}
        >
          {isDeclaredLMPUsed
            ? "▶️ Ngày LMP hiện tại đang lấy từ nguồn Khai Báo."
            : "▶️ Ngày LMP hiện tại đang lấy từ ô nhập liệu Thủ Công."}
        </p> */}
          </div>
        </div>
        {!lmpDate && (
          <p className="text-xs text-red-500 mt-2">
            Vui lòng nhập ngày LMP để tính toán.
          </p>
        )}
      </div>

      {/* Hiển thị Tuần Đang Xem và Tuần Thực Tế */}
      <div className="flex align-center flex-col text-center mb-6 p-4 border-b-2 border-pink-500">
        <div className="flex justify-center items-baseline gap-2">
          <span className="text-6xl font-extrabold text-pink-600">
            {`Bạn đang xem tuần: ` + week + `/`}
          </span>
          <span className="text-2xl text-gray-400">40</span>
        </div>
        {lmpDate && (
          <>
            <p className="mt-4 text-sm text-gray-700 mt-1">
              (Tuần thai của bạn:{" "}
              <span className="font-bold text-pink-800">
                <b style={{ color: "red" }}>{actualCurrentWeek}</b>
              </span>
              )
            </p>
            {/* Bổ sung hiển thị khoảng ngày */}
            {weekDateRange.startDate && (
              <p
                style={{ fontWeight: "bold" }}
                className="mt-6 text-sm text-pink-500 font-bold mt-2 bg-pink-100 p-1 rounded-md inline-block shadow-inner"
              >
                📅 {weekDateRange.startDate} - {weekDateRange.endDate}
              </p>
            )}
          </>
        )}
      </div>

      {/* Nút điều hướng tuần */}
      <div className=" flex justify-center gap-4 mb-6 mt-6">
        <div className="btn-Week " onClick={handlePrev} disabled={week === 1}>
          <a className="btn-Week__link btn-Week__linkPrev">
            <span className="btn-Week__icon">
              <FontAwesomeIcon icon={faChevronLeft} />
            </span>
            Tuần trước
          </a>
        </div>

        <div
          className="btn-Week "
          onClick={handleGoToCurrentWeek}
          disabled={!lmpDate || week === actualCurrentWeek}
        >
          <a className="btn-Week__link btn-Week__linkNow">Tuần Hiện Tại</a>
        </div>

        <div className="btn-Week " onClick={handleNext} disabled={week === 40}>
          <a className="btn-Week__link btn-Week__linkNext">
            Tuần kế
            <span className="btn-Week__icon">
              <FontAwesomeIcon icon={faChevronRight} />
            </span>
          </a>
        </div>
      </div>

      {/* Hiển thị nội dung tuần */}
      <div className="p-4 bg-white  rounded-xl shadow-md">
        <div className="flex justify-center flex-col items-center gap-4 mb-4 border-b pb-4">
          <h3 className="text-xl font-semibold text-gray-800 leading-snug">
            <span>
              <FontAwesomeIcon icon={faVideo} />
            </span>
            {` - ` + current.title}
          </h3>
          <p className="text-gray-700 leading-relaxed text-base">
            {current.desc}
          </p>
          <p className="text-gray-700 leading-relaxed text-base">
            {current.todo1}
          </p>
          <p className="text-gray-700 leading-relaxed text-base">
            {current.todo2}
          </p>
          <p className="text-gray-700 leading-relaxed text-base">
            {current.todo3}
          </p>

          {/* Áp dụng open modal */}
          <ImageModal
            src={current.image}
            alt={`Thai tuần ${week}`}
            className="rounded-full object-cover shadow-lg border-2 border-pink-300 flex-shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "W" + week;
            }}
          />
        </div>
      </div>

      {/* Thông tin LMP đã nhập và Tuần Hiện Tại thực tế (phần này đơn giản hóa) */}
      <div className="mt-6 p-3 text-center bg-gray-50 text-sm text-gray-600 rounded-lg ">
        <p>
          <span className="font-semibold text-gray-800">
            Kỳ Kinh Cuối (LMP):{" "}
          </span>
          {lmpDate
            ? new Date(lmpDate).toLocaleDateString("vi-VN")
            : "Chưa nhập"}
        </p>
      </div>
    </div>
  );
}
