// src/components/NavTabs.jsx
export default function NavTabs() {
  const tabs = ["Tuần thai", "Thực đơn", "Lưu ý", "Hoạt động"];

  return (
    <div className="flex justify-center  ">
      {tabs.map((tab) => (
        <button key={tab} className="hover:text-pink-800 transition-colors">
          {tab}
        </button>
      ))}
    </div>
  );
}
