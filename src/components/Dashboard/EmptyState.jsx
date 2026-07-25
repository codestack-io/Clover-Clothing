export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-20 text-center shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-slate-800">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-400">{description}</p>
    </div>
  );
}