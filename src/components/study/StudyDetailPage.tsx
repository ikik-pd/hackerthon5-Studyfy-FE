import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Study } from "../common/types";
import { useThemeStore } from "../../store/themeStore";
import { ThemeToggle } from "../common/ThemeToggle";
import Avatar from 'react-avatar';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudy, joinStudy, leaveStudy, deleteStudy } from "../../api/study";
import { QUERY_KEYS, getStudyQueryKey } from "../../constants/queryKeys";
import { STUDY_STATUS, STUDY_STATUS_LABEL, STUDY_BUTTON_LABEL, MODAL_DURATION } from "../../constants/study";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
};

export function StudyDetailPage() {
  const { id } = useParams<{id: string}>();
  const isDark = useThemeStore((state: { isDark: boolean }) => state.isDark);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isJoining, setIsJoining] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { data: study, isLoading } = useQuery({
    queryKey: getStudyQueryKey(id!),
    queryFn: () => getStudy(id!),
  });

  const joinStudyMutation = useMutation({
    mutationFn: () => joinStudy(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getStudyQueryKey(id!) });
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, MODAL_DURATION);
    }
  });

  const leaveStudyMutation = useMutation({
    mutationFn: () => leaveStudy(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getStudyQueryKey(id!) });
    }
  });

  const deleteStudyMutation = useMutation({
    mutationFn: () => deleteStudy(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDIES] });
      navigate('/studies');
    }
  });

  if (isLoading) {
    return <div className="text-center py-10">로딩중...</div>;
  }

  if (!study) {
    return <div className="text-center py-10">스터디를 찾을 수 없습니다.</div>;
  }

  // 진행률 계산
  const calculateProgress = () => {
    const start = new Date(study.durationStart).getTime();
    const end = new Date(study.durationEnd).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const current = now - start;
    const progress = Math.min(Math.max((current / total) * 100, 0), 100);
    return Math.round(progress);
  };

  const progress = calculateProgress();
  const isFinished = progress >= 100;
  const isNotStarted = progress <= 0;

  const getStudyStatus = () => {
    if (isFinished) return STUDY_STATUS.FINISHED;
    if (isNotStarted) return STUDY_STATUS.NOT_STARTED;
    return STUDY_STATUS.IN_PROGRESS;
  };

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await joinStudyMutation.mutateAsync();
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    setIsJoining(true);
    try {
      await leaveStudyMutation.mutateAsync();
    } finally {
      setIsJoining(false);
    }
  };

  const handleDelete = async () => {
    if(window.confirm('정말 삭제할까요?')) {
      await deleteStudyMutation.mutateAsync();
    }
  };

  const isJoined = study.participants?.some(p => p.nickname === "나");
  const isFull = study.participants?.length >= study.maxParticipants;

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-white dark:bg-zinc-900 transition-colors px-4`}>
      <div className="max-w-md mx-auto pt-5 pb-20">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">스터디 상세</h2>
          <ThemeToggle />
        </header>

        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{study.title}</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">{study.goal}</p>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {study.method}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              최대 {study.maxParticipants}명
            </span>
          </div>

          {/* 진행률 표시 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {STUDY_STATUS_LABEL[getStudyStatus()]}
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{progress}%</span>
            </div>
            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isFinished ? 'bg-green-500' : 
                  isNotStarted ? 'bg-zinc-400' : 
                  'bg-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{formatDate(study.durationStart)}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{formatDate(study.durationEnd)}</span>
            </div>
          </div>

          <div className="flex items-center mb-2 gap-2">
            <div className="flex -space-x-3">
              {study.participants?.slice(0, 3).map((p, i) => (
                <Avatar
                  key={i}
                  name={p.nickname}
                  size="32"
                  round={true}
                  className="border-2 border-white dark:border-zinc-900 shadow-sm"
                  style={{zIndex: 10-i}}
                />
              ))}
              {study.participants && study.participants.length > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs text-zinc-700 dark:text-zinc-200 translate-x-[-10px]">
                  +{study.participants.length - 3}
                </div>
              )}
            </div>
            <div className="ml-1 text-xs text-zinc-600 dark:text-zinc-300">
              {study.participants?.slice(0, 3).map(p => p.nickname).join(', ')}
              {study.participants && study.participants.length > 3 && ` 외 ${study.participants.length - 3}명`}
              <span className="ml-1 text-zinc-400">({study.participants?.length || 0}/{study.maxParticipants}명)</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">스터디 기간</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {formatDate(study.durationStart)} ~ {formatDate(study.durationEnd)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">모집 마감일</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{formatDate(study.deadline)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">스터디 설명</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{study.description}</p>
            </div>
          </div>

          <div className="flex gap-3">
            {isJoined ? (
              <button
                onClick={handleLeave}
                disabled={isJoining || leaveStudyMutation.isPending}
                className="flex-1 py-2 rounded-xl font-bold bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 transition disabled:opacity-50"
              >
                {leaveStudyMutation.isPending ? STUDY_BUTTON_LABEL.PROCESSING : STUDY_BUTTON_LABEL.LEAVE}
              </button>
            ) : (
              <button
                onClick={handleJoin}
                disabled={isJoining || isFull || isFinished || joinStudyMutation.isPending}
                className="flex-1 py-2 rounded-xl font-bold bg-black dark:bg-zinc-100 text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-200 transition disabled:opacity-50"
              >
                {joinStudyMutation.isPending ? STUDY_BUTTON_LABEL.PROCESSING : 
                 isFull ? STUDY_BUTTON_LABEL.FULL : 
                 isFinished ? STUDY_BUTTON_LABEL.FINISHED : 
                 STUDY_BUTTON_LABEL.JOIN}
              </button>
            )}
            <Link
              to="/studies"
              className="px-5 flex items-center justify-center rounded-xl font-bold bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
            >
              목록
            </Link>
          </div>
          <button 
            onClick={handleDelete}
            disabled={deleteStudyMutation.isPending}
            className="mt-3 w-full py-2 rounded-xl bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 font-semibold hover:bg-red-200 dark:hover:bg-red-700 transition disabled:opacity-50"
          >
            {deleteStudyMutation.isPending ? STUDY_BUTTON_LABEL.PROCESSING : STUDY_BUTTON_LABEL.DELETE}
          </button>
        </div>
      </div>

      {/* 참여 완료 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 m-4 max-w-sm w-full shadow-xl transform transition-all">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                참여 신청 완료!
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {study.title} 스터디에 참여 신청이 완료되었습니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 