import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Study, CATEGORY_OPTIONS, METHOD_OPTIONS } from "../common/types";
import { useThemeStore } from "../../store/themeStore";
import { ThemeToggle } from "../common/ThemeToggle";
import { createStudy, updateStudy } from "../../api/study";
import { User } from "../../types";
import { StudyCreateDto, StudyUpdateDto } from "../../types";
import { ParticipantList } from "./components/ParticipantList";
import { FormField } from "./components/FormField";
import { DateRangeField } from "./components/DateRangeField";
import { FormActions } from "./components/FormActions";

interface StudyEditFormProps {
  studies: Study[];
  onSave: (study: Study) => void;
  currentUser: User;
}

export function StudyEditForm({ studies, onSave, currentUser }: StudyEditFormProps) {
  const { id } = useParams<{id: string}>();
  const editing = Boolean(id);
  const isDark = useThemeStore((state: { isDark: boolean }) => state.isDark);
  const navigate = useNavigate();
  
  // 기존 스터디 찾기 또는 새 스터디 초기화
  const existingStudy = studies.find(s => s.id === Number(id));
  const studyInit = existingStudy || {
    id: 0,
    creatorId: currentUser.id,
    categoryId: 1,
    title: '',
    goal: '',
    description: '',
    maxParticipants: 5,
    method: METHOD_OPTIONS[0],
    durationStart: '',
    durationEnd: '',
    deadline: '',
    createdAt: '',
    updatedAt: '',
    participants: [],
  };

  const [form, setForm] = useState<Study>({...studyInit});
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ 
      ...f, 
      [name]: name === 'maxParticipants' ? Number(value) : 
              name === 'categoryId' ? Number(value) : 
              name === 'creatorId' ? Number(value) : value 
    }));
  };  

  const validateForm = () => {
    const errs: {[key:string]: string} = {};
    if (!form.title) errs.title = "제목 필수";
    if (!form.goal) errs.goal = "목표 필수";
    if (!form.description) errs.description = "설명 필수";
    if (!form.categoryId) errs.categoryId = "카테고리 선택";
    if (!form.method) errs.method = "모임방식 선택";
    if (!form.maxParticipants || form.maxParticipants < 2) errs.maxParticipants = "2명 이상";
    if (!form.durationStart || !form.durationEnd) errs.durationStart = "기간 입력";
    if (!form.deadline) errs.deadline = "신청마감 입력";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm();
    setErrors(errs);
    
    if (Object.keys(errs).length === 0) {
      try {
        if (id) {
          // 수정
          const updateData: StudyUpdateDto = {
            categoryId: form.categoryId,
            title: form.title,
            goal: form.goal,
            description: form.description,
            maxParticipants: form.maxParticipants,
            method: form.method,
            durationStart: new Date(form.durationStart).toISOString(),
            durationEnd: new Date(form.durationEnd).toISOString(),
            deadline: new Date(form.deadline).toISOString(),
          };
          const updatedStudy = await updateStudy(id, updateData);
          onSave(updatedStudy as Study);
        } else {
          // 생성
          const createData: StudyCreateDto = {
            creatorId: form.creatorId,
            categoryId: form.categoryId,
            title: form.title,
            goal: form.goal,
            description: form.description,
            maxParticipants: form.maxParticipants,
            method: form.method,
            durationStart: new Date(form.durationStart).toISOString(),
            durationEnd: new Date(form.durationEnd).toISOString(),
            deadline: new Date(form.deadline).toISOString(),
          };
          const newStudy = await createStudy(createData);
          onSave(newStudy as Study);
        }
        navigate('/studies');
      } catch (error) {
        console.error('스터디 저장 실패:', error);
        setErrors({ submit: '스터디 저장에 실패했습니다. 다시 시도해주세요.' });
      }
    }
  };

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen flex items-center justify-center px-4 bg-white dark:bg-zinc-900 transition-colors`}>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/90 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg p-7 flex flex-col gap-5 text-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold dark:text-white">{editing ? "스터디 수정" : "스터디 만들기"}</h2>
          <ThemeToggle />
        </div>
        
        {editing && <ParticipantList participants={form.participants} />}

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
          name="maxParticipants"
          type="number"
          min={2}
          max={99}
          value={form.maxParticipants}
          onChange={handleChange}
          error={errors.maxParticipants}
        />
        
        <DateRangeField
          startName="durationStart"
          endName="durationEnd"
          startValue={form.durationStart}
          endValue={form.durationEnd}
          onChange={handleChange}
          error={errors.durationStart}
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
        
        <FormActions isEditing={editing} />
      </form>
    </div>
  );
} 