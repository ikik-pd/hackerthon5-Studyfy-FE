import { Link } from "react-router-dom"

interface FormActionsProps {
  isEditing: boolean
  onSubmit: () => void
  isLoading?: boolean
}

export function FormActions({ isEditing, onSubmit, isLoading = false }: FormActionsProps) {
  return (
    <div className="flex gap-3 mt-4">
      <button 
        type="button" 
        onClick={onSubmit}
        disabled={isLoading}
        className="flex-1 py-2 rounded-xl font-bold bg-black dark:bg-zinc-100 text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "처리중..." : isEditing ? "수정완료" : "만들기"}
      </button>
      <Link 
        to="/studies" 
        className="px-5 flex items-center justify-center rounded-xl font-bold bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
      >
        취소
      </Link>
    </div>
  )
} 