
import React, { useRef, useState, useEffect } from 'react';

interface CameraScannerProps {
  onCapture: (base64: string, mimeType: string) => void;
  onClose: () => void;
  title: string;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, onClose, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' },
          audio: false 
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Camera access denied. Please check permissions.");
        onClose();
      }
    }
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
    }
  };

  const confirm = () => {
    if (capturedImage) {
      const base64 = capturedImage.split(',')[1];
      onCapture(base64, 'image/jpeg');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-[2rem] overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 heading-font">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="relative aspect-video bg-slate-900 overflow-hidden">
          {!capturedImage ? (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
          )}
          
          <div className="absolute inset-0 border-[30px] border-black/20 pointer-events-none">
             <div className="w-full h-full border-2 border-dashed border-white/50 rounded-xl"></div>
          </div>
        </div>

        <div className="p-8 flex justify-center space-x-4 bg-slate-50">
          {!capturedImage ? (
            <button 
              onClick={capture}
              className="w-16 h-16 bg-[#1B4332] rounded-full flex items-center justify-center text-white shadow-xl shadow-green-900/40 hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-12 h-12 border-4 border-white rounded-full"></div>
            </button>
          ) : (
            <>
              <button 
                onClick={() => setCapturedImage(null)}
                className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all"
              >
                Retake
              </button>
              <button 
                onClick={confirm}
                className="px-8 py-3 bg-[#1B4332] text-white font-bold rounded-2xl shadow-lg shadow-green-900/20 hover:bg-green-900 transition-all"
              >
                Analyze Drishti
              </button>
            </>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScanner;
