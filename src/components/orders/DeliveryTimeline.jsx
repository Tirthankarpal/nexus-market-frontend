const DELIVERY_STEPS = [
  { key: 'placed',     label: 'Order Placed' },
  { key: 'confirmed',  label: 'Payment Confirmed' },
  { key: 'processing', label: 'Being Processed' },
  { key: 'shipped',    label: 'Shipped' },
  { key: 'delivered',  label: 'Delivered' },
];

const DeliveryTimeline = () => (
  <div className="mt-4 pt-4 border-t border-zinc-800/60">
    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-3">
      Delivery Progress
    </p>
    <div className="flex items-center gap-0">
      {DELIVERY_STEPS.map((step, idx) => {
        const isDone   = idx < 2;
        const isActive = idx === 2;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`h-2 w-2 rounded-full transition-all ${
                  isDone   ? 'bg-emerald-400' :
                  isActive ? 'bg-amber-400 animate-pulse' :
                             'bg-zinc-700'
                }`}
              />
              <span
                className={`text-[9px] mt-1 text-center leading-tight max-w-[52px] ${
                  isDone   ? 'text-emerald-500' :
                  isActive ? 'text-amber-400 font-semibold' :
                             'text-zinc-600'
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < DELIVERY_STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 mb-3 ${isDone ? 'bg-emerald-500/40' : 'bg-zinc-800'}`} />
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default DeliveryTimeline;
