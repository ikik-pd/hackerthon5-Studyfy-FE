import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Study, CATEGORY_OPTIONS, METHOD_OPTIONS } from "../common/types";
import { ThemeToggle } from "../common/ThemeToggle";
import { useThemeStore } from "../../store/themeStore";
import Avatar from 'react-avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudies, deleteStudy } from "../../api/study";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { useAuthStore } from '../../store/authStore'

interface StudyListPageProps {
  onDelete: (id: string) => void;
}

export function StudyListPage({ onDelete }: StudyListPageProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | "">("");
  const [sortType, setSortType] = useState<string>("latest");
  const navigate = useNavigate();
  const isDark = useThemeStore((state: { isDark: boolean }) => state.isDark);
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user)

  // 스터디 목록 조회
  const { data: studies = [], isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.STUDIES],
    queryFn: getStudies,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분
  });


  // 스터디 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStudy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDIES] })
    },
    onError: (error: Error) => {
      console.error('스터디 삭제 실패:', error)
      alert(error.message)
    }
  });

  // StudyResponseDto를 Study로 변환
  const transformedStudies: Study[] = studies.map(study => ({
    ...study,
    participants: [] // API 응답에는 participants가 없으므로 빈 배열로 초기화
  }));

  // 필터, 검색, 정렬 적용 리스트
  const filtered = transformedStudies
    .filter((s: Study) => !selectedCategory || s.categoryId === selectedCategory)
    .filter((s: Study) => !selectedMethod || s.method === selectedMethod)
    .filter((s: Study) =>
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.goal.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a: Study, b: Study) => {
      if (sortType === "latest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortType === "deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (sortType === "participants") return (b.participants?.length || 0) - (a.participants?.length || 0);
      return 0;
    });

  // 진행률 계산 함수(중복방지)
  const getProgress = (s: Study) => {
    if (!s.durationStart || !s.durationEnd) return 0;
    const start = new Date(s.durationStart).getTime();
    const end = new Date(s.durationEnd).getTime();
    const now = Date.now();
    if (now <= start) return 0;
    if (now >= end) return 100;
    return Math.floor(((now - start) / (end - start)) * 100);
  };

  if (isLoading) {
    return (
      <div className={`${isDark ? "dark" : ""} min-h-screen bg-white dark:bg-zinc-900 transition-colors px-2`}>
        <div className="max-w-md mx-auto pt-5 pb-20 relative">
          <div className="text-center text-zinc-500 py-16">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isDark ? "dark" : ""} min-h-screen bg-white dark:bg-zinc-900 transition-colors px-2`}>
        <div className="max-w-md mx-auto pt-5 pb-20 relative">
          <div className="text-center text-red-500 py-16">스터디 목록을 불러오는데 실패했습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-white dark:bg-zinc-900 transition-colors px-2`}>
      <div className="max-w-md mx-auto pt-5 pb-20 relative">
        <header className="flex items-center justify-between mb-2 px-2">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">스터디 리스트</h2>
          <ThemeToggle />
        </header>
        {/* 검색 · 필터 컨트롤 */}
        <div className="flex flex-col gap-2 mb-5 mt-3 px-2">
          <input
            placeholder="스터디 제목, 설명, 목표 검색"
            className="appearance-none w-full rounded-xl border px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-black dark:focus:ring-white transition text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {/* 카테고리 태그: 가로 스크롤, shadow */}
          <div className="-mx-2 px-2 overflow-x-auto scrollbar-none relative">
            <div className="flex flex-nowrap gap-2 items-center min-w-0">
              <span className="text-xs text-zinc-400 mr-1 shrink-0 bg-white dark:bg-zinc-900 z-10 relative">카테고리:</span>
              {CATEGORY_OPTIONS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition whitespace-nowrap shrink-0 ${selectedCategory === c.id ? "bg-black dark:bg-zinc-100 text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"}`}
                >
                  {c.name}
                </button>
              ))}
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-2 py-1 rounded-full border text-xs font-medium transition whitespace-nowrap shrink-0 ${!selectedCategory ? "border-black dark:border-zinc-50 text-black dark:text-zinc-50" : "border-zinc-100 dark:border-zinc-700 text-zinc-400"}`}
              >모두</button>
            </div>
            {/* 오른쪽 shadow 효과: 항상 고정 */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 z-20 bg-gradient-to-l from-white dark:from-zinc-900 to-transparent" />
          </div>
          {/* 방식 태그: 가로 스크롤 */}
          <div className="-mx-2 px-2 overflow-x-auto scrollbar-none">
            <div className="flex flex-nowrap gap-1 items-center">
              <span className="text-xs text-zinc-400 mr-1 shrink-0">방식:</span>
              {METHOD_OPTIONS.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMethod(selectedMethod === m ? "" : m)}
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition ${selectedMethod === m ? "bg-black dark:bg-zinc-100 text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"}`}
                >
                  {m}
                </button>
              ))}
              <button
                onClick={() => setSelectedMethod("")}
                className={`px-2 py-1 rounded-full border text-xs font-medium transition ${!selectedMethod ? "border-black dark:border-zinc-50 text-black dark:text-zinc-50" : "border-zinc-100 dark:border-zinc-700 text-zinc-400"}`}
              >모두</button>
            </div>
          </div>
          <div className="flex gap-2 mt-2 items-center">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 mr-1">정렬:</span>
            <select 
              value={sortType} 
              onChange={e=>setSortType(e.target.value)} 
              className="rounded-lg border text-xs px-2 py-1 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            >
              <option value="latest">최신순</option>
              <option value="deadline">마감 임박순</option>
              <option value="participants">참가자 많은순</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {filtered.length === 0 && (<div className="text-center text-zinc-500 py-16">검색/필터에 맞는 스터디가 없습니다.</div>)}
          {filtered.map((study: Study) => {
            const progress = getProgress(study);
            const isSuccess = progress >= 100;
            return (
              <div
                key={study.id}
                className={
                  `relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow flex flex-col gap-2 transition group `
                  + (isSuccess
                      ? ' bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 opacity-60'
                      : ' hover:shadow-md cursor-pointer')
                }
                onClick={e => {
                  if ((e.target as HTMLElement).closest('a,button')) return;
                  navigate(`/study/${study.id}`);
                }}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/study/${study.id}`);
                  }
                }}
                aria-label={`${study.title} 상세로 이동`}
              >
                {/* 성공 뱃지 */}
                {isSuccess && (
                  <span className="absolute top-4 right-5 flex items-center gap-1 bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700 text-pink-500 text-base px-3 py-1 rounded-full font-semibold  min-w-[54px] justify-center z-10">
                    <span className="text-xl">🎉</span>
                    <span className="text-xs font-bold ml-1">성공</span>
                    <span className="hidden md:inline text-[10px] text-zinc-500 ml-2">상세에서 꽃가루가 1분간 날려요!</span>
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-medium text-zinc-800 dark:text-zinc-100">{study.title}</span>
                  <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-600">{CATEGORY_OPTIONS.find(cat=>cat.id===study.categoryId)?.name}</span>
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 text-xs mb-1">{study.goal}</div>
                <div className="text-zinc-600 dark:text-zinc-400 text-sm mb-2 line-clamp-2">{study.description}</div>
                <div className="flex items-center justify-between mt-1 gap-2">
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 select-none">
                    최대 {study.maxParticipants}명 / {study.method}
                  </span>
                  <div className="flex items-center gap-2">
                    {/* 참여자 프로필 오버랩 */}
                    <div className="flex -space-x-2 mr-1">
                      {study.participants?.slice(0,3).map((p, i: number) => (
                        <Avatar
                          key={i}
                          name={p.nickname}
                          size="24"
                          round={true}
                          className="border-2 border-white dark:border-zinc-900 shadow-sm"
                          style={{zIndex: 10-i}}
                          title={p.nickname}
                        />
                      ))}
                      {study.participants && study.participants.length > 3 && (
                        <div className="w-6 h-6 rounded-full border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] text-zinc-700 dark:text-zinc-200 translate-x-[-6px]">+{study.participants.length-3}</div>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-300">{study.participants?.length || 0}/{study.maxParticipants}</span>
                    {/* 수정/삭제 버튼: 본인 글만 노출 */}
                    {user?.id === study.creatorId && (
                      <>
                        <Link to={`/edit-study/${study.id}`} className="text-xs px-2 py-1 rounded-xl bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition" onClick={e=>e.stopPropagation()}>수정</Link>
                        <button 
                          onClick={e => {
                            e.stopPropagation()
                            if (window.confirm('정말로 이 스터디를 삭제하시겠습니까?')) {
                              deleteMutation.mutate(study.id.toString())
                            }
                          }} 
                          disabled={deleteMutation.isPending}
                          className={`text-xs px-2 py-1 rounded-xl ${
                            deleteMutation.isPending 
                              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                              : 'bg-red-100 dark:bg-red-800 text-red-500 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700'
                          } transition`}
                        >
                          {deleteMutation.isPending ? '삭제 중...' : '삭제'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {/* 진행률 바 */}
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-0.5">
                    <span>진행률</span>
                    <span>
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden">
                    <div className="h-2 rounded-xl transition-all" style={{
                      width: `${progress}%`,
                      backgroundColor: '#FF1744'
                    }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Link to="/create-study" className="fixed bottom-6 right-6 md:right-[calc(50vw-200px)] z-30 shadow-xl rounded-full p-4 bg-black dark:bg-white text-white dark:text-black text-2xl hover:bg-zinc-900 dark:hover:bg-zinc-200 transition focus:outline-none">
          +
        </Link>
      </div>
    </div>
  );
} 