import { useState, useEffect } from "react";

import { createPortal } from "react-dom";

export default function ImageModal({ src, alt = "Ảnh xem trước" }) {
  const [open, setOpen] = useState(false);

  // ESC để đóng

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setOpen(false);

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Khóa cuộn trang

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const modalContent = (
    <>
      {/* Backdrop */}

      <div className="modal-backdrop fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998] opacity-0 "></div>

      {/* Modal */}

      <div
        className="modal-content fixed inset-0 z-[9999] flex items-center justify-center animate-zoomIn"
        onClick={() => setOpen(false)}
      >
        {/* Nút đóng */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Ngăn sự kiện click nút đóng lan truyền lên cha
            setOpen(false);
          }}
          className="modal-closeBtn absolute top-6 right-8 text-white text-5xl font-bold hover:text-pink-400 transition"
        >
          ×
        </button>

        {/* Ảnh lớn */}

        <img
          src={src}
          alt={alt}
          onClick={(e) => e.stopPropagation()} // <<< THÊM SỰ KIỆN NÀY ĐỂ GIỮ MODAL MỞ KHI CLICK VÀO ẢNH
          className="modal-content--img  max-w-[90vw] max-h-[85vh] rounded-lg shadow-2xl object-contain "
        />
      </div>
    </>
  );

  return (
    <>
      {/* Ảnh thumbnail */}

      <img
        src={src}
        alt={alt}
        onClick={() => setOpen(true)}
        className="w-48 h-48 object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md"
      />

      {/* Render modal ra ngoài body */}

      {open && createPortal(modalContent, document.body)}
    </>
  );
}
