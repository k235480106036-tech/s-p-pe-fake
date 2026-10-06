import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, Zap, ZapOff, SwitchCamera, X } from 'lucide-react';

export default function BuyerQRVerificationModal({ isOpen, onClose }) {
  // Yêu cầu 3: Quản lý trạng thái xác nhận Popup cảnh báo COD trước khi quét
  const [hasConfirmedWarning, setHasConfirmedWarning] = useState(false);
  
  // Yêu cầu 2: Quản lý Camera (trước/sau) và Đèn Flash
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (Sau) hoặc 'user' (Trước)
  const [isFlashOn, setIsFlashOn] = useState(false);
  
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Khởi chạy Stream từ Camera thiết bị
  const startCamera = async () => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, advanced: [{ torch: isFlashOn }] },
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Không thể truy cập Camera:', err);
    }
  };

  useEffect(() => {
    if (isOpen && hasConfirmedWarning) {
      startCamera();
    }
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, hasConfirmedWarning, facingMode]);

  // Bật / Tắt đèn Flash
  const toggleFlash = async () => {
    if (!mediaStreamRef.current) return;
    const track = mediaStreamRef.current.getVideoTracks()[0];
    const capabilities = track.getCapabilities?.() || {};

    if (capabilities.torch) {
      const nextFlashState = !isFlashOn;
      await track.applyConstraints({ advanced: [{ torch: nextFlashState }] });
      setIsFlashOn(nextFlashState);
    } else {
      alert('Thiết bị hoặc camera hiện tại không hỗ trợ đèn Flash!');
    }
  };

  // Đổi Camera Trước / Sau
  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    setIsFlashOn(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* =========================================================
          YÊU CẦU 3: POPUP CẢNH BÁO TIỀN COD (Hiện trước khi quét)
         ========================================================= */}
      {!hasConfirmedWarning ? (
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={36} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">CẢNH BÁO MUA HÀNG</h3>
          <p className="text-sm font-semibold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 mb-6">
            Vui lòng quét tem trước khi đưa tiền COD!
          </p>
          <button
            onClick={() => setHasConfirmedWarning(true)}
            className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition"
          >
            Đã hiểu, Tiến hành quét tem
          </button>
        </div>
      ) : (
        /* =========================================================
            YÊU CẦU 2: CAMERA QUÉT TEM QR (Tích hợp Flash & Đổi Cam)
           ========================================================= */
        <div className="relative w-full max-w-md bg-black rounded-3xl overflow-hidden shadow-2xl">
          {/* Nút Bật/Tắt Flash, Đổi Camera & Đóng */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
            <button
              onClick={toggleFlash}
              className="p-3 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-black/60"
              title="Bật/Tắt Flash"
            >
              {isFlashOn ? <Zap className="text-yellow-400" size={20} /> : <ZapOff size={20} />}
            </button>
            <button
              onClick={toggleCamera}
              className="p-3 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-black/60"
              title="Đổi Camera"
            >
              <SwitchCamera size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-3 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-black/60"
              title="Đóng Modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Màn hình hiển thị Camera */}
          <div className="relative w-full h-[400px] flex items-center justify-center bg-gray-950">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute w-56 h-56 border-2 border-green-500 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]">
              <div className="w-full h-0.5 bg-green-400 animate-pulse mt-28"></div>
            </div>
          </div>

          <div className="p-4 bg-gray-900 text-center">
            <p className="text-xs text-gray-400">Đưa camera vào vùng chứa tem QR trên kiện hàng để quét</p>
          </div>
        </div>
      )}
    </div>
  );
}