import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { ThemeToggle } from "../common/ThemeToggle";
import { signup } from "../../api/auth";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<"M" | "F">("");
  const [errors, setErrors] = useState<{[key:string]: string}>({});
  const [submitted, setSubmitted] = useState(false);
  const isDark = useThemeStore((state: { isDark: boolean }) => state.isDark);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: {[key:string]: string} = {};
    if (!name) errs.name = "이름을 입력해주세요";
    if (!email) errs.email = "이메일을 입력해주세요";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) errs.email = "올바른 이메일 형식";
    if (!gender) errs.gender = "성별을 선택해주세요";
    if (!password) errs.password = "비밀번호를 입력해주세요";
    else if (password.length < 6) errs.password = "6자 이상 입력";
    if (password !== confirmPassword) errs.confirmPassword = "비밀번호가 일치하지 않습니다";
    setErrors(errs);
    
    if (Object.keys(errs).length === 0) {
      try {
        const signupData = {
          user_name: name.trim(),
          password: password.trim(),
          email: email.trim(),
          gender
        };
        // console.log('회원가입 요청 데이터:', signupData);
        
        const response = await signup(signupData);
        // console.log('회원가입 응답:', response);
        
        if (response.password) {
          // 회원가입 성공 시 사용자 정보와 토큰을 저장
          login({
            id: response.id,
            name: response.userName,
            email: response.email,
            gender: response.gender
          }, response.password);
          
          console.log('사용자 정보와 토큰이 저장되었습니다.');
        }
        
        setSubmitted(true);
        setTimeout(() => {
          navigate("/studies");
        }, 1200);
      } catch (error) {
        console.error('회원가입 실패:', error);
        setErrors({ submit: error instanceof Error ? error.message : '회원가입에 실패했습니다. 다시 시도해주세요.' });
      }
    }
  };

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-white dark:bg-zinc-900 transition-colors px-4`}>
      <div className="max-w-md mx-auto pt-5 pb-20">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">회원가입</h2>
          <ThemeToggle />
        </header>

        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow">
          {submitted ? (
            <div className="text-center py-10">
              <div className="text-green-500 text-lg font-semibold mb-4">가입 완료!</div>
              <div className="text-zinc-500 dark:text-zinc-400">{gender === 'M' ? '남' : '여'} / {name}님 🎉 환영합니다</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">이름</label>
                <input
                  className={`w-full appearance-none px-4 py-3 rounded-xl border bg-zinc-50 dark:bg-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition ${errors.name ? "border-red-400 dark:border-red-500" : ""}`}
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="off"
                />
                {errors.name && <p className="text-xs mt-1 text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">이메일</label>
                <input
                  className={`w-full appearance-none px-4 py-3 rounded-xl border bg-zinc-50 dark:bg-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition ${errors.email ? "border-red-400 dark:border-red-500" : ""}`}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="off"
                />
                {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">성별</label>
                <div className="flex gap-4 mb-1">
                  <button
                    type="button"
                    className={`flex items-center gap-1 px-5 py-2 rounded-full border text-base select-none transition
                      ${gender==='M' ? 'bg-black text-white dark:bg-zinc-100 dark:text-black border-black dark:border-zinc-100 shadow' :
                       'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700'}
                    `}
                    onClick={()=>setGender('M')}
                    aria-pressed={gender==='M'}
                  >
                    <span className="text-lg">♂️</span> 남
                  </button>
                  <button
                    type="button"
                    className={`flex items-center gap-1 px-5 py-2 rounded-full border text-base select-none transition
                      ${gender==='F' ? 'bg-black text-white dark:bg-zinc-100 dark:text-black border-black dark:border-zinc-100 shadow' :
                       'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700'}
                    `}
                    onClick={()=>setGender('F')}
                    aria-pressed={gender==='F'}
                  >
                    <span className="text-lg">♀️</span> 여
                  </button>
                </div>
                {errors.gender && <p className="text-xs mt-1 text-red-500">{errors.gender}</p>}
              </div>
              <div>
                <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">비밀번호</label>
                <input
                  className={`w-full appearance-none px-4 py-3 rounded-xl border bg-zinc-50 dark:bg-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition ${errors.password ? "border-red-400 dark:border-red-500" : ""}`}
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                {errors.password && <p className="text-xs mt-1 text-red-500">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">비밀번호 확인</label>
                <input
                  className={`w-full appearance-none px-4 py-3 rounded-xl border bg-zinc-50 dark:bg-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition ${errors.confirmPassword ? "border-red-400 dark:border-red-500" : ""}`}
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && <p className="text-xs mt-1 text-red-500">{errors.confirmPassword}</p>}
              </div>
              {errors.submit && <p className="text-xs text-red-500">{errors.submit}</p>}
              <button
                type="submit"
                className="mt-3 py-3 w-full bg-black text-white dark:bg-zinc-800 dark:text-zinc-100 rounded-xl font-medium text-lg shadow hover:bg-zinc-900 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
              >
                회원가입
              </button>
              <div className="my-2 text-center">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">이미 회원이신가요? </span>
                <a
                  href="/login"
                  className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  로그인
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 