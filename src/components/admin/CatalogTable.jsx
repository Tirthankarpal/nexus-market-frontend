import { RefreshCw, AlertCircle } from 'lucide-react';
import CatalogTableRow from './CatalogTableRow';

const CatalogTable = ({ products, loading, onUpdateProduct, onDeleteProduct, setError }) => {
  return (
    <div className="lg:col-span-2 glass-panel rounded-xl p-6 space-y-4 overflow-hidden bg-zinc-900 border border-zinc-800">
      <div>
        <h3 className="font-display font-semibold text-base text-zinc-150">Catalog Inventory</h3>
        <p className="text-[11px] text-zinc-400 mt-1">Manage pricing details, override stock reserves, or delete legacy products</p>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 uppercase font-semibold text-[10px] tracking-wider">
              <th className="py-3 px-2 text-center w-12">ID</th>
              <th className="py-3 px-3">Product details</th>
              <th className="py-3 px-3 w-32">Price</th>
              <th className="py-3 px-3 w-28">Stock Level</th>
              <th className="py-3 px-2 text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-16">
                  <RefreshCw className="h-6 w-6 text-zinc-450 animate-spin mx-auto" />
                  <span className="text-zinc-550 text-xs mt-2 block">Loading live database records...</span>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-16 text-zinc-500">
                  <AlertCircle className="h-6 w-6 text-zinc-700 mx-auto mb-2" />
                  <span>No items registered in active database.</span>
                </td>
              </tr>
            ) : (
              products.map((prod) => (
                <CatalogTableRow 
                  key={prod.id} 
                  product={prod} 
                  onUpdateProduct={onUpdateProduct} 
                  onDeleteProduct={onDeleteProduct}
                  setError={setError}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CatalogTable;
