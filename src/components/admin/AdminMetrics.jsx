import { Package, DollarSign, Layers } from 'lucide-react';

const AdminMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Metric 1 */}
      <div className="glass-panel rounded-xl p-5 flex items-center space-x-4 bg-zinc-900 border border-zinc-800">
        <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 shrink-0">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block">Total Catalog Items</span>
          <span className="font-display font-semibold text-xl text-zinc-100">{metrics.totalProducts}</span>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="glass-panel rounded-xl p-5 flex items-center space-x-4 bg-zinc-900 border border-zinc-800">
        <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 shrink-0">
          <DollarSign className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block">Asset Valuation</span>
          <span className="font-display font-semibold text-xl text-zinc-150">
            ${metrics.catalogValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="glass-panel rounded-xl p-5 flex items-center space-x-4 bg-zinc-900 border border-zinc-800">
        <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 shrink-0">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block">Out of Stock Items</span>
          <span className="font-display font-semibold text-xl text-zinc-100">{metrics.outOfStockCount}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminMetrics;
