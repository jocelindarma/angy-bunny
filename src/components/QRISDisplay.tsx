import React from "react";

interface QRISDisplayProps {
  qrString: string;
  qrUrl: string;
}

export const QRISDisplay: React.FC<QRISDisplayProps> = ({ qrString, qrUrl }) => {
  return (
    <div className="flex flex-col items-center my-6">
      <img src={qrUrl} alt="QRIS QR Code" className="w-56 h-56 border-2 border-rose-300 rounded-lg" />
      <div className="mt-2 text-xs text-gray-500 break-all">{qrString}</div>
      <div className="mt-2 text-rose-700 font-semibold">Scan QRIS to Pay</div>
    </div>
  );
};
