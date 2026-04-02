import { PackageOpen } from "lucide-react";

export default function EmptyState({ title, desc }) {
  return (
    <div className="og-empty-state">
      <div className="og-empty-state__icon-wrap">
        <PackageOpen size={42} strokeWidth={1.5} />
      </div>
      <h3 className="og-empty-state__title">{title}</h3>
      <p className="og-empty-state__desc">{desc}</p>
    </div>
  );
}
