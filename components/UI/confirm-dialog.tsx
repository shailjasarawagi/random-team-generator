"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const confirmButtonClass =
    confirmVariant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-500 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`px-4 py-2 ${confirmButtonClass} text-white rounded transition`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
