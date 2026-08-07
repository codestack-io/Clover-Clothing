"use client";

import {
  LayoutGrid,
  Grid2x2,
  Rows3,
  List,
} from "lucide-react";

const options = [
  {
    value: "2",
    icon: <Grid2x2 size={18} />,
    label: "2 Columns",
  },
  {
    value: "3",
    icon: <LayoutGrid size={18} />,
    label: "3 Columns",
  },
  {
    value: "4",
    icon: <Rows3 size={18} />,
    label: "4 Columns",
  },
  {
    value: "list",
    icon: <List size={18} />,
    label: "List View",
  },
];

export default function LayoutSwitcher({ layout, setLayout }) {
  return (
    <div className="flex items-center gap-3">
  <span className="text-sm font-medium text-neutral-700">
    View
  </span>

  <div className="inline-flex rounded-full bg-neutral-100 p-1">
    {options.map((option) => (
      <button
        key={option.value}
        onClick={() => setLayout(option.value)}
        title={option.label}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200
        ${
          layout === option.value
            ? "bg-white shadow-md text-black"
            : "text-neutral-500 hover:text-black"
        }`}
      >
        {option.icon}
      </button>
    ))}
  </div>
</div>
  );
}