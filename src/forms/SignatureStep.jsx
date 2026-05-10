import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { PenTool, Trash2, CheckCircle2, Download } from 'lucide-react';
import { cn } from '@/utils/cn';

const SignatureStep = ({ onSave }) => {
  const sigCanvas = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [preview, setPreview] = useState(null);

  const clear = () => {
    sigCanvas.current.clear();
    setIsEmpty(true);
    setPreview(null);
  };

  const save = () => {
    if (sigCanvas.current.isEmpty()) {
      setIsEmpty(true);
      return;
    }
    const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    setPreview(dataUrl);
    if (onSave) onSave(dataUrl);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display">Digital Signature</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Please provide your signature below. By signing, you agree that the information provided is accurate and you consent to a credit check.
        </p>
      </div>

      <div className="card overflow-hidden border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-within:border-primary-500 transition-colors">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <PenTool size={14} />
            Sign Here
          </div>
          <button 
            onClick={clear}
            className="text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>
        <div className="h-64 cursor-crosshair relative">
          <SignatureCanvas
            ref={sigCanvas}
            penColor="#0ea5e9"
            canvasProps={{
              className: 'w-full h-full'
            }}
            onBegin={() => setIsEmpty(false)}
            onEnd={save}
          />
          {isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 select-none">
              <span className="text-2xl font-display italic text-slate-400">Your Signature</span>
            </div>
          )}
        </div>
      </div>

      {preview && (
        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 flex flex-col items-center gap-4 animate-slide-up">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 size={18} />
            Signature Captured
          </div>
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <img src={preview} alt="Signature Preview" className="max-h-24 object-contain" />
          </div>
          <button 
            className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
            onClick={() => {
              const link = document.createElement('a');
              link.download = 'signature.png';
              link.href = preview;
              link.click();
            }}
          >
            <Download size={14} />
            Download Copy
          </button>
        </div>
      )}
    </div>
  );
};

export default SignatureStep;
