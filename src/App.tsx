import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Study, CATEGORY_OPTIONS, METHOD_OPTIONS } from "./components/common/types";
import { SignupForm } from "./components/auth/SignupForm";
import { LoginForm } from "./components/auth/LoginForm";
import { StudyListPage } from "./components/study/StudyListPage";
import { StudyDetailPage } from "./components/study/StudyDetailPage";
import { StudyEditForm } from "./components/study/StudyEditForm";
import { StudyCreatePage } from "./components/study/StudyCreatePage";
import { getStudies, createStudy, updateStudy, deleteStudy } from "./api/study";
import { useThemeStore } from "./store/themeStore";
import { useAuthStore } from "./store/authStore";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 30, // 30분
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function App() {
  const isDark = useThemeStore((state: { isDark: boolean }) => state.isDark);
  const { user, isAuthenticated } = useAuthStore();
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // body 배경색 변경
  useEffect(() => {
    document.body.className = isDark ? 'dark:bg-zinc-900 bg-zinc-900' : 'bg-white';
  }, [isDark]);


  // 삭제
  const handleDelete = (id: string) => {
    setStudies(prev => prev.filter(s=>s.id!==Number(id)));
  };
  
  // 생성/수정
  const handleSave = (study: Study) => {
    setStudies(prev=>{
      const idx = prev.findIndex(s=>s.id===study.id);
      if (idx>-1) {
        const copy = [...prev];
        copy[idx] = study;
        return copy;
      }
      return [...prev, study];
    });
  };
  
  // 상세에서 참가/취소 등 participants 변경
  const handleUpdate = (newStudy: Study) => {
    setStudies(prev => prev.map(s => s.id === newStudy.id ? newStudy : s));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className={isDark ? "dark" : ""}>
    <Routes>
      <Route path="/" element={<SignupForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
          <Route 
            path="/studies" 
            element={
              isAuthenticated ? 
                <StudyListPage onDelete={handleDelete}/> : 
                <Navigate to="/" />
            } 
          />
          <Route 
            path="/create-study" 
            element={
              isAuthenticated ? 
                <StudyCreatePage onSave={handleSave} currentUser={user!}/> : 
                <Navigate to="/" />
            } 
          />
          <Route 
            path="/edit-study/:id" 
            element={
              isAuthenticated ? 
                <StudyEditForm studies={studies} onSave={handleSave} currentUser={user!}/> : 
                <Navigate to="/" />
            } 
          />
          <Route 
            path="/study/:id" 
            element={
              isAuthenticated ? 
                <StudyDetailPage studies={studies} onUpdate={handleUpdate} onDelete={handleDelete} /> : 
                <Navigate to="/" />
            } 
          />
    </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
