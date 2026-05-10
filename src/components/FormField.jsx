import React, { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const FormField = forwardRef(({ 
  name, 
  label, 
  type = 'text', 
  placeholder, 
  icon: Icon,
  description,
  options = [],
  mask,
  autoFocus = false,
}, ref) => {
  const { 
    register, 
    formState: { errors }, 
    watch 
  } = useFormContext();

  const error = errors[name];
  const value = watch(name);
  const isFilled = value && value.length > 0;

  return (
    <div className="space-y-2.5 w-full group">
      {label && (
        <label 
          htmlFor={name}
          className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 ml-1 transition-colors group-focus-within:text-indigo-600"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <div className={cn(
          "relative flex items-center transition-all duration-300 rounded-2xl overflow-hidden bg-white dark:bg-[#0D0D15] border-2 shadow-sm",
          error ? "border-rose-500 shadow-rose-100" : 
          "border-slate-100 dark:border-white/5 focus-within:border-indigo-600 focus-within:shadow-indigo-100 dark:focus-within:shadow-none focus-within:scale-[1.01]",
          isFilled && !error && "border-slate-200 dark:border-white/10"
        )}>
          {Icon && (
            <div className="pl-5 text-slate-400 transition-colors group-focus-within:text-indigo-600">
              <Icon size={20} />
            </div>
          )}

          {type === 'select' ? (
            <select
              id={name}
              {...register(name)}
              className="w-full py-4 px-4 bg-transparent outline-none text-sm font-bold dark:text-white appearance-none cursor-pointer"
            >
              <option value="">Select option</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              id={name}
              type={type}
              placeholder={placeholder}
              autoFocus={autoFocus}
              {...register(name)}
              className="w-full py-4 px-4 bg-transparent outline-none text-sm font-bold dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700"
            />
          )}

          <div className="pr-5 flex items-center gap-2">
            {error && <AlertCircle className="text-rose-500" size={18} />}
            {isFilled && !error && <CheckCircle2 className="text-emerald-500 animate-in fade-in zoom-in duration-300" size={18} />}
          </div>
        </div>
      </div>

      {description && !error && (
        <p className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">{description}</p>
      )}

      {error && (
        <p 
          role="alert" 
          aria-live="polite"
          className="text-xs font-black text-rose-500 ml-1 flex items-center gap-1.5 animate-in slide-in-from-top-2 duration-300"
        >
          <AlertCircle size={12} />
          {error.message}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;
