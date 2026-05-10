import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/utils/cn';

const FormField = ({
  name,
  label,
  type = 'text',
  placeholder,
  description,
  icon: Icon,
  options,
  ...props
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={name} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
            <Icon size={18} />
          </div>
        )}

        {type === 'select' ? (
          <select
            id={name}
            {...register(name)}
            className={cn(
              'input-field',
              Icon && 'pl-10',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
              props.className
            )}
            {...props}
          >
            <option value="">Select {label}</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={name}
            placeholder={placeholder}
            {...register(name)}
            className={cn(
              'input-field min-h-[100px] py-3',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
              props.className
            )}
            {...props}
          />
        ) : (
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            {...register(name)}
            className={cn(
              'input-field',
              Icon && 'pl-10',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
              props.className
            )}
            {...props}
          />
        )}
      </div>

      {description && !error && <p className="text-xs text-slate-500">{description}</p>}

      {error && (
        <p className="text-xs font-medium text-rose-500 animate-slide-up">{error.message}</p>
      )}
    </div>
  );
};

export default FormField;
