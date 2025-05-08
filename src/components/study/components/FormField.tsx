import { useThemeStore } from "../../../store/themeStore"

interface FormFieldProps {
  label: string
  name: string
  value: any
  onChange: (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => void
  error?: string
  type?: string
  options?: { id: number, name: string }[] | string[]
  [key: string]: any
}

export function FormField({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  type = "text",
  options,
  ...props 
}: FormFieldProps) {
  const isDark = useThemeStore((state: { isDark: boolean }) => state.isDark)
  const baseClasses = "mt-1 w-full px-3 py-2 rounded-xl border bg-zinc-50 dark:bg-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-black dark:focus:ring-white transition"
  const errorClasses = error ? "border-red-400 dark:border-red-500" : ""

  const renderInput = () => {
    if (type === "select" && options) {
      return (
        <select 
          name={name} 
          className={`${baseClasses} ${errorClasses}`} 
          value={value} 
          onChange={onChange}
        >
          <option value="">{label} 선택</option>
          {options.map(opt => 
            typeof opt === 'string' ? 
              <option key={opt} value={opt}>{opt}</option> :
              <option key={opt.id} value={opt.id}>{opt.name}</option>
          )}
        </select>
      )
    }
    
    if (type === "textarea") {
      return (
        <textarea 
          rows={3} 
          name={name} 
          className={`${baseClasses} ${errorClasses}`} 
          value={value} 
          onChange={onChange}
          {...props}
        />
      )
    }

    return (
      <input 
        type={type} 
        name={name} 
        className={`${baseClasses} ${errorClasses}`} 
        value={value} 
        onChange={onChange}
        {...props}
      />
    )
  }

  return (
    <label>
      {label}
      {renderInput()}
      {error && <span className="text-red-500 text-xs block mt-1">{error}</span>}
    </label>
  )
} 