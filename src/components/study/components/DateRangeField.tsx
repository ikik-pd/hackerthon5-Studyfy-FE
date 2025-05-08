import { useThemeStore } from "../../../store/themeStore"

interface DateRangeFieldProps {
  startName: string
  endName: string
  startValue: string
  endValue: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export function DateRangeField({ 
  startName, 
  endName, 
  startValue, 
  endValue, 
  onChange, 
  error 
}: DateRangeFieldProps) {
  const isDark = useThemeStore((state: { isDark: boolean }) => state.isDark)
  const baseClasses = "mt-1 px-3 py-2 rounded-xl border dark:bg-zinc-900 bg-zinc-50 border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-black dark:focus:ring-white transition"

  return (
    <label>
      기간
      <input 
        type="date" 
        name={startName} 
        className={`${baseClasses} mr-2`} 
        value={startValue} 
        onChange={onChange}
      />
      ~
      <input 
        type="date" 
        name={endName} 
        className={baseClasses} 
        value={endValue} 
        onChange={onChange}
      />
      {error && <span className="text-red-500 text-xs block mt-1">{error}</span>}
    </label>
  )
} 