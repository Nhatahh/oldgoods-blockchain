import { ExternalLink } from "lucide-react";

const EXPLORER_TX_URL = import.meta.env.VITE_EXPLORER_TX_URL || "";

export default function ExplorerLink({ txHash, label = "Explorer" }) {
  if (!txHash || !EXPLORER_TX_URL) return null;

  const href = `${EXPLORER_TX_URL}${txHash}`;

  return (
    <a
      className="explorer-link"
      href={href}
      target="_blank"
      rel="noreferrer"
      title="Mở trên explorer"
    >
      <ExternalLink size={14} />
      {label}
    </a>
  );
}
