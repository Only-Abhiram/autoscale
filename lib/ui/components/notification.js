"use client";

export default function Notification({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white px-4 py-2 rounded-lg shadow">
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
