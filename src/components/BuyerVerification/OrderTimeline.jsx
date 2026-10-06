import React from 'react';
import { Package, Truck, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { key: 'PENDING', title: 'Chờ lấy', desc: 'Đơn hàng đang chờ đơn vị vận chuyển lấy hàng' },
  { key: 'SHIPPING', title: 'Đang giao', desc: 'Đơn hàng đang trên đường giao đến bạn' },
  { key: 'RECEIVED', title: 'Đã nhận', desc: 'Đã nhận hàng và xác thực thành công' },
];

export default function OrderTimeline({ currentStatus = 'SHIPPING' }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto my-4">
      <h3 className="font-bold text-lg text-gray-800 mb-6">Tiến trình đơn hàng</h3>
      <div className="relative pl-6 border-l-2 border-gray-200 space-y-8">
        {STEPS.map((step, idx) => {
          const isPassed = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="relative">
              <div
                className={`absolute -left-[33px] top-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isPassed ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {idx === 0 && <Package size={16} />}
                {idx === 1 && <Truck size={16} />}
                {idx === 2 && <CheckCircle2 size={16} />}
              </div>

              <div className="ml-2">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${isCurrent ? 'text-green-600' : 'text-gray-800'}`}>
                    {step.title}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                      Hiện tại
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}