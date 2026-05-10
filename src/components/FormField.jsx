import React, { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const FormField = React.forwardRef(({ 
  name, 
  label, 
  type = 'text', 
  placeholder, 
  description, 
  icon: Icon, 
  options, 
  mask,
  className,
  ...props 
}, ref) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];
  const fieldId = useId();
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  // Standard input logic with mask support (simplified for demo)
  const handleChange = (e) => {
    if (mask === 'pan') {
      e.target.value = e.target.value.toUpperCase().slice(0, 10);
    }
    // Mask logic can be expanded here
  };

  return (
    <div className={cn("space-y-2 w-full group", className)}>
      <div className="flex justify-between items-center">
        {label && (
          <label 
            htmlFor={fieldId} 
            className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-primary-600"
          >
            {label}
          </label>
        )}
        <AnimatePresence>
          {error && (
            <motion.span
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] font-black uppercase text-rose-500 tracking-wider"
            >
              Required
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-all duration-300 pointer-events-none">
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
        
        {type === 'select' ? (
          <select
            id={fieldId}
            {...register(name)}
            aria-describedby={error ? errorId : description ? descriptionId : undefined}
            aria-invalid={!!error}
            className={cn(
              "input-field appearance-none pr-10",
              Icon && "pl-12",
              error ? "border-rose-500 ring-rose-500/10" : "border-slate-200 dark:border-slate-800",
              "focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus-visible:outline-none"
            )}
            {...props}
          >
            <option value="">Select {label}</option>
            {options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input
            id={fieldId}
            type={type}
            placeholder={placeholder}
            {...register(name)}
            onChange={(e) => {
              register(name).onChange(e);
              handleChange(e);
            }}
            aria-describedby={error ? errorId : description ? descriptionId : undefined}
            aria-invalid={!!error}
            className={cn(
              "input-field h-12",
              Icon && "pl-12",
              error ? "border-rose-500 ring-rose-500/10" : "border-slate-200 dark:border-slate-800",
              "focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus-visible:outline-none"
            )}
            {...props}
          />
        )}
      </div>

      <div className="min-h-[20px]">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              id={errorId}
              role="alert"
              aria-live="polite"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs font-medium text-rose-500 flex items-center gap-1.5"
            >
              <span className="w-1 h-1 bg-rose-500 rounded-full" />
              {error.message}
            </motion.p>
          ) : description ? (
            <motion.p
              key="description"
              id={descriptionId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] text-slate-500 leading-relaxed"
            >
              {description}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;
