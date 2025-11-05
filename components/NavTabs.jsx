// // src/components/NavTabs.jsx
// export default function NavTabs() {
//   const tabs = ["Tuần thai", "Thực đơn", "Lưu ý", "Hoạt động"];

//   return (

//     <div role="tablist" className="tabs tabs-lift flex navMenu">
//       {tabs.map((tab) => (
//         <a
//           href="#"
//           key={tab}
//           className="navMenu-item tab tab-active"
//           role="tab"
//         >
//           {tab}
//         </a>
//       ))}
//     </div>
//   );
// }

import React, { useState } from "react";
import PregnancyWeek from "../pages/PregnancyWeek";
import Nutrition from "../pages/Nutrition";

// --- 1. Dữ liệu các Tab ---
const tabData = [
  {
    id: "tab1",
    title: "Tuần thai",
    content: <PregnancyWeek />,
  },
  {
    id: "tab2",
    title: "Thực đơn",
    content: <Nutrition />,
  },
  {
    id: "tab3",
    title: "Lịch trình",
    content: "Vui lòng liên hệ qua email support@example.com để được hỗ trợ.",
  },
  {
    id: "tab4",
    title: "Hoạt động",
    content: "Các hoạt động tốt cho thai kỳ",
  },
];

const Tabs = () => {
  // Khởi tạo trạng thái, mặc định là ID của tab đầu tiên ('tab1')
  const [activeTab, setActiveTab] = useState(tabData[0].id);

  // --- 2. Hàm xử lý khi click vào nút tab ---
  const handleTabClick = (tabId) => {
    // Cập nhật trạng thái tab đang hoạt động
    setActiveTab(tabId);
  };

  return (
    <div className="tabs-container">
      {/* Thanh chứa các nút Tab */}
      <div className="flex justify-center tab-links">
        {tabData.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button  ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Khối chứa Nội dung Tab */}
      <div className="tab-content-container">
        {tabData.map((tab) => (
          <div
            key={tab.id}
            id={tab.id}
            className={`tab-content ${activeTab === tab.id ? "active" : ""}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
