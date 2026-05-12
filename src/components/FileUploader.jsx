import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const FileUploader = ({
  maxSize = 5, // MB
  accept = { 'application/pdf': ['.pdf'], 'image/*': ['.jpeg', '.jpg', '.png'] },
  onUpload,
  label = 'Upload Document',
}) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        status: 'uploading',
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      }));

      setFiles((prev) => [...prev, ...newFiles]);
      setErrors(
        fileRejections.map((rej) => ({
          name: rej.file.name,
          message: rej.errors[0].message,
        }))
      );

      // Simulate upload progress
      newFiles.forEach((fileObj) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileObj.id ? { ...f, progress: 100, status: 'complete' } : f
              )
            );
            if (onUpload) onUpload(fileObj.file);
          } else {
            setFiles((prev) => prev.map((f) => (f.id === fileObj.id ? { ...f, progress } : f)));
          }
        }, 500);
      });
    },
    [onUpload]
  );

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: maxSize * 1024 * 1024,
    accept,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 cursor-pointer text-center',
          isDragActive
            ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 scale-[0.99]'
            : 'border-slate-200 dark:border-slate-800 hover:border-primary-400',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/10'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors">
            <Upload size={32} />
          </div>
          <div>
            <p className="text-sm font-bold dark:text-white">{label}</p>
            <p className="text-xs text-slate-500 mt-1">PDF, JPG or PNG (Max {maxSize}MB)</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl space-y-2 border border-rose-100 dark:border-rose-900/20"
          >
            {errors.map((err, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-medium"
              >
                <AlertCircle size={14} />
                <span>
                  {err.name}: {err.message}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-3">
        {files.map((fileObj) => (
          <motion.div
            key={fileObj.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
              {fileObj.preview ? (
                <img src={fileObj.preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <FileText className="text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate dark:text-white">{fileObj.file.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${fileObj.progress}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-500">
                  {Math.round(fileObj.progress)}%
                </span>
              </div>
            </div>
            <div className="shrink-0">
              {fileObj.status === 'complete' ? (
                <CheckCircle2 size={18} className="text-emerald-500" />
              ) : (
                <Loader2 size={18} className="text-primary-500 animate-spin" />
              )}
            </div>
            <button
              onClick={() => removeFile(fileObj.id)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
