import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Study, CATEGORY_OPTIONS, METHOD_OPTIONS } from "../common/types"
import { useThemeStore } from "../../store/themeStore"
import { useAuthStore } from "../../store/authStore"
import { ThemeToggle } from "../common/ThemeToggle"
import { createStudy } from "../../api/study"
import { StudyCreateDto } from "../../types"
import { FormField } from "./components/FormField"
import { DateRangeField } from "./components/DateRangeField"
import { FormActions } from "./components/FormActions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "../../constants/queryKeys"

export function StudyCreatePage() {
  const isDark = useThemeStore((state: { isDark: boolean }) => state.isDark)
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [form, setForm] = useState<StudyCreateDto>({
    creatorId: user!.id,
    categoryId: 1,
    title: '',
    goal: '',
    description: '',
    max_participants: 5,
    method: METHOD_OPTIONS[0],
    duration_start: '',
    duration_end: '',
    deadline: '',
  })
  
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const createStudyMutation = useMutation({
    mutationFn: (data: StudyCreateDto) => createStudy(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDIES] })
      navigate('/studies')
    },
    onError: (error) => {
      console.error('스터디 생성 실패:', error)
      setErrors({ submit: '스터디 생성에 실패했습니다. 다시 시도해주세요.' })
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(f => ({ 
      ...f, 
      [name]: name === 'max_participants' ? Number(value) : 
              name === 'categoryId' ? Number(value) : 
              name === 'creatorId' ? Number(value) : value 
    }))
  }

  const validateForm = () => {
    const errs: {[key:string]: string} = {}
    if (!form.title) errs.title = "제목 필수"
    if (!form.goal) errs.goal = "목표 필수"
    if (!form.description) errs.description = "설명 필수"
    if (!form.categoryId) errs.categoryId = "카테고리 선택"
    if (!form.method) errs.method = "모임방식 선택"
    if (!form.max_participants || form.max_participants < 2) errs.max_participants = "2명 이상"
    if (!form.duration_start || !form.duration_end) errs.duration_start = "기간 입력"
    if (!form.deadline) errs.deadline = "신청마감 입력"
    return errs
  }

  const handleSubmit = async () => {
    const errs = validateForm()
    setErrors(errs)
    
    if (Object.keys(errs).length === 0) {
      const createData: StudyCreateDto = {
        creatorId: form.creatorId,
        categoryId: form.categoryId,
        title: form.title,
        goal: form.goal,
        description: form.description,
        max_participants: form.max_participants,
        method: form.method,
        duration_start: new Date(form.duration_start).toISOString(),
        duration_end: new Date(form.duration_end).toISOString(),
        deadline: new Date(form.deadline).toISOString(),
      }
      createStudyMutation.mutate(createData)
    }
  }

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen flex items-center justify-center px-4 bg-white dark:bg-zinc-900 transition-colors`}>
      <form className="w-full max-w-md bg-white/90 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg p-7 flex flex-col gap-5 text-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold dark:text-white">스터디 만들기</h2>
          <ThemeToggle />
        </div>

        <FormField
          label="제목"
          name="title"
          value={form.title}
          onChange={handleChange}
          error={errors.title}
        />
        
        <FormField
          label="목표"
          name="goal"
          value={form.goal}
          onChange={handleChange}
          error={errors.goal}
        />
        
        <FormField
          label="카테고리"
          name="categoryId"
          type="select"
          value={form.categoryId}
          onChange={handleChange}
          error={errors.categoryId}
          options={CATEGORY_OPTIONS}
        />
        
        <FormField
          label="모임 방식"
          name="method"
          type="select"
          value={form.method}
          onChange={handleChange}
          error={errors.method}
          options={METHOD_OPTIONS}
        />
        
        <FormField
          label="최대 인원"
          name="max_participants"
          type="number"
          min={2}
          max={99}
          value={form.max_participants}
          onChange={handleChange}
          error={errors.max_participants}
        />
        
        <DateRangeField
          startName="duration_start"
          endName="duration_end"
          startValue={form.duration_start}
          endValue={form.duration_end}
          onChange={handleChange}
          error={errors.duration_start}
        />
        
        <FormField
          label="모집마감일"
          name="deadline"
          type="date"
          value={form.deadline}
          onChange={handleChange}
          error={errors.deadline}
        />
        
        <FormField
          label="설명"
          name="description"
          type="textarea"
          value={form.description}
          onChange={handleChange}
          error={errors.description}
        />
        
        {errors.submit && <span className="text-red-500 text-xs">{errors.submit}</span>}
        
        <FormActions 
          isEditing={false} 
          onSubmit={handleSubmit}
          isLoading={createStudyMutation.isPending}
        />
      </form>
    </div>
  )
} 