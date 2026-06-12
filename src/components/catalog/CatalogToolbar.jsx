import { ArrowUpDown, SlidersHorizontal, RefreshCcw } from 'lucide-react';

const CatalogToolbar = ({
  sortField,
  sortDir,
  size,
  onSortChange,
  onSizeChange,
  onRefresh
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Sorting Selector */}
      <div className="flex items-center space-x-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300">
        <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
        <select
          onChange={onSortChange}
          value={`${sortField},${sortDir}`}
          className="bg-transparent focus:outline-none cursor-pointer font-medium"
        >
          <option value="name,asc" className="bg-zinc-950 text-zinc-300">Name (A - Z)</option>
          <option value="name,desc" className="bg-zinc-950 text-zinc-300">Name (Z - A)</option>
          <option value="price,asc" className="bg-zinc-950 text-zinc-300">Price (Low - High)</option>
          <option value="price,desc" className="bg-zinc-950 text-zinc-300">Price (High - Low)</option>
        </select>
      </div>

      {/* Size Selector */}
      <div className="flex items-center space-x-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300">
        <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
        <select
          value={size}
          onChange={onSizeChange}
          className="bg-transparent focus:outline-none cursor-pointer font-medium"
        >
          <option value="8" className="bg-zinc-950 text-zinc-300">Show 8</option>
          <option value="12" className="bg-zinc-950 text-zinc-300">Show 12</option>
          <option value="24" className="bg-zinc-950 text-zinc-300">Show 24</option>
        </select>
      </div>

      {/* Manual Refresh */}
      <button
        onClick={onRefresh}
        className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-100 rounded-lg transition-all text-zinc-400 cursor-pointer active:scale-95"
        title="Reload Catalog"
      >
        <RefreshCcw className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default CatalogToolbar;
