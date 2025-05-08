import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useThemeStore } from "../../store/themeStore"
import { useAuthStore } from "../../store/authStore"
import { ThemeToggle } from "../common/ThemeToggle"
import { login as loginApi } from "../../api/auth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{[key:string]: string}>({})
  const [submitted, setSubmitted] = useState(false)
  const isDark = useThemeStore((state: { isDark: boolean }) => state.isDark)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: {[key:string]: string} = {}
    if (!email) errs.email = "이메일을 입력해주세요"
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) errs.email = "올바른 이메일 형식"
    if (!password) errs.password = "비밀번호를 입력해주세요"
    setErrors(errs)

    if (Object.keys(errs).length === 0) {
      try {
        const response = await loginApi({ email: email.trim(), password: password.trim() })
        if (response.token) {
          // 토큰 저장 및 사용자 정보 저장
          login({ 
            id: response.id, 
            name: response.userName, 
            email: response.email, 
            gender: response.gender 
          }, response.token)
          setSubmitted(true)
          setTimeout(() => {
            navigate("/studies")
          }, 1200)
        } else {
          setErrors({ submit: "로그인에 실패했습니다. 다시 시도해주세요." })
        }
      } catch (error: any) {
        setErrors({ submit: error?.message || "로그인에 실패했습니다. 다시 시도해주세요." })
      }
    }
  }

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-white dark:bg-zinc-900 transition-colors px-4`}>
      <div className="max-w-md mx-auto pt-5 pb-20">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">로그인</h2>
          <ThemeToggle />
        </header>
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow">
          {submitted ? (
            <div className="text-center py-10">
              <div className="text-green-500 text-lg font-semibold mb-4">로그인 성공!</div>
              <div className="text-zinc-500 dark:text-zinc-400">환영합니다 🎉</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">이메일</label>
                <input
                  className={`w-full appearance-none px-4 py-3 rounded-xl border bg-zinc-50 dark:bg-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition ${errors.email ? "border-red-400 dark:border-red-500" : ""}`}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
                {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">비밀번호</label>
                <input
                  className={`w-full appearance-none px-4 py-3 rounded-xl border bg-zinc-50 dark:bg-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition ${errors.password ? "border-red-400 dark:border-red-500" : ""}`}
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                {errors.password && <p className="text-xs mt-1 text-red-500">{errors.password}</p>}
              </div>
              {errors.submit && <p className="text-xs text-red-500">{errors.submit}</p>}
              <button
                type="submit"
                className="mt-3 py-3 w-full bg-black text-white dark:bg-zinc-800 dark:text-zinc-100 rounded-xl font-medium text-lg shadow hover:bg-zinc-900 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
              >
                로그인
              </button>
            </form>
          )}
          {!submitted && (
            <div className="my-2 mt-6 text-center">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">아직 회원이 아니신가요? </span>
              <a
                href="/signup"
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline ml-1"
              >
                회원가입
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 