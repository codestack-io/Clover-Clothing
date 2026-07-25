import { BarChart3 } from "lucide-react";

export default function ChartPlaceholder({ label = "Chart" }) {
  return (
    <div className="flex h-56 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 text-center">
      <BarChart3 className="h-6 w-6 text-slate-300" />
      <p className="mt-2 text-sm font-medium text-slate-400">{label} coming soon</p>
      <p className="text-xs text-slate-300">This will render live data once analytics is wired up.</p>
    </div>
  );
}