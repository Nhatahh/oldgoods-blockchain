import { Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function CopyButton({ text, label = "Đã copy" }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
    } catch {
      toast.error("Copy thất bại");
    }
  };

  return (
    <button
      className="icon-btn"
      onClick={handleCopy}
      type="button"
      title="Copy"
    >
      <Copy size={16} />
    </button>
  );
}
