import React, { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const FormField = forwardRef(
  (
    {
      name,
      label,
      type = 'text',
      placeholder,
      icon: Icon,
      description,
      options = [],
      mask,
      autoFocus = false,
    },
    ref
  ) => {
    const {
      register,
      formState: { errors },
      watch,
    } = useFormContext();

    const error = errors[name];
    const value = watch(name);
    const isFilled = value && value.length > 0;

    return (
      <div className="space-y-2 w-full group">
        {label && (
          <label
            htmlFor={name}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8993A4] ml-1 transition-colors group-focus-within:text-[#0065FF]"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <div
            className={cn(
              'relative flex items-center transition-all duration-200 rounded-2xl overflow-hidden bg-[#F4F5F7] border-2',
              error
                ? 'border-rose-500 bg-white'
                : 'border-transparent focus-within:bg-white focus-within:border-[#0065FF] focus-within:shadow-[0_0_0_4px_rgba(0,101,255,0.1)]',
              isFilled && !error && 'bg-white border-[#DFE1E6]'
            )}
          >
            {Icon && (
              <div className="pl-5 text-[#8993A4] transition-colors group-focus-within:text-[#0065FF]">
                <Icon size={18} />
              </div>
            )}

            {type === 'select' ? (
              <select
                id={name}
                {...register(name)}
                className="w-full py-4 px-4 bg-transparent outline-none text-sm font-bold text-[#172B4D] appearance-none cursor-pointer"
              >
                <option value="">Select option</option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={name}
                type={type}
                placeholder={placeholder}
                autoFocus={autoFocus}
                {...register(name)}
                className="w-full py-4 px-4 bg-transparent outline-none text-sm font-bold text-[#172B4D] placeholder:text-[#A5ADBA]"
              />
            )}

            <div className="pr-5 flex items-center gap-2">
              {error && <AlertCircle className="text-rose-500" size={18} />}
              {isFilled && !error && (
                <CheckCircle2
                  className="text-[#36B37E] animate-in zoom-in duration-300"
                  size={18}
                />
              )}
            </div>
          </div>
        </div>

        {description && !error && (
          <p className="text-[10px] font-bold text-[#8993A4] ml-1 uppercase tracking-widest">
            {description}
          </p>
        )}

        {error && (
          <p
            role="alert"
            aria-live="polite"
            className="text-xs font-bold text-rose-500 ml-1 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200"
          >
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
