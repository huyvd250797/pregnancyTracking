import React from "react";

export default function WeekInfo({ week }) {
  return (
    <div className="text-gray-700 text-sm leading-relaxed">
      <p>
        Đây là thông tin cho <b>tuần thứ {week}</b> của thai kỳ. (Bạn có thể cập
        nhật sau bằng dữ liệu thực tế, ví dụ: sự phát triển của thai nhi, thay
        đổi cơ thể mẹ, lưu ý sức khỏe, v.v.)
      </p>
    </div>
  );
}
