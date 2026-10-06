import React, { useState } from 'react';
import OrderTimeline from './components/BuyerVerification/OrderTimeline';
import BuyerQRVerificationModal from './components/BuyerVerification/BuyerQRVerificationModal';

function App() {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Xác thực người mua - Module 4</h1>
      
      {/* Hiển thị Tiến trình đơn hàng */}
      <OrderTimeline currentStatus="SHIPPING" />

      {/* Nút bật Popup Quét QR */}
      <div className="text-center mt-6">
        <button
          onClick={() => setIsQRModalOpen(true)}
          className="bg-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-green-700 transition"
        >
          Mở Quét Tem QR / Xác Thực Đơn Hàng
        </button>
      </div>

      {/* Popup Quét QR & Cảnh báo COD */}
      <BuyerQRVerificationModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
    </div>
  );
}

export default App;