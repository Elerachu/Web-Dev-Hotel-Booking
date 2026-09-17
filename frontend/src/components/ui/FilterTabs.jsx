// Row of pill buttons: All / Available / Occupied / Maintenance ...
export default function FilterTabs({ tabs, value, onChange, label }) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-2.5">
      {tabs.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={`rounded-full px-4 py-2 text-[15px] transition-colors outline-none focus-visible:ring-4 focus-visible:ring-lagoon-200 ${
              selected
                ? 'bg-ink font-medium text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
