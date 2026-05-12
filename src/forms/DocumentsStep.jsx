import React from 'react';
import { useWizard } from '@/context/WizardContext';
import FileUploader from '@/components/FileUploader';
import { motion } from 'framer-motion';

const DocumentsStep = () => {
  const { updateStepData } = useWizard();
  const stepId = 'documents';

  const handleUpload = (file) => {
    // In a real app, this would send to an S3 bucket or similar
    // For now, we simulate by updating the store with file metadata
    updateStepData(stepId, {
      uploadedAt: new Date().toISOString(),
      fileName: file.name,
      fileSize: file.size,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display">Document Verification</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          To comply with financial regulations, we need to verify your identity and income. Please
          upload the following documents.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <FileUploader label="Identity Proof (Passport/Aadhaar/PAN)" onUpload={handleUpload} />

        <FileUploader
          label="Income Proof (Salary Slips/Tax Returns)"
          onUpload={handleUpload}
          maxSize={10}
        />
      </div>

      <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
        <p className="text-xs text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
          💡 **Tip:** Ensure the documents are clear, un-cropped, and all text is legible. PDF
          format is preferred for multi-page documents.
        </p>
      </div>
    </motion.div>
  );
};

export default DocumentsStep;
