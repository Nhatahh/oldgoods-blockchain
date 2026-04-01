import { PackageOpen } from "lucide-react";

export default function EmptyState({ title, desc }) {
  return (
    <div className="empty-state">
      <PackageOpen size={46} />
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}
