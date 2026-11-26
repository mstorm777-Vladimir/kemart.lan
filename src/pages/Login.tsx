import { useState } from 'react'
import { Home, Eye, EyeOff } from 'lucide-react'

interface LoginProps {
  onLogin: (username: string, password: string) => boolean | Promise<boolean>
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const success = await onLogin(username, password)
      if (!success) setError('Неверный логин или пароль')
    } catch (err) {
      setError('Ошибка подключения к серверу')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#494840] via-[#2c2b26] to-[#494840] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#2D98DA] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#2D98DA] rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2D98DA]/20 rounded-full mb-4">
            <Home className="w-8 h-8 text-[#2D98DA]" />
          </div>
          <h1 className="text-2xl font-bold text-white">КемАрт</h1>
          <p className="text-gray-400 mt-1">Студия дизайна интерьера</p>
          <p className="text-gray-500 text-sm mt-2">Админ-панель управления сайтом</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Логин</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D98DA]"
              placeholder="Введите логин"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D98DA] pr-12"
                placeholder="Введите пароль"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full py-3 bg-[#2D98DA] hover:bg-[#2580b8] text-white font-medium rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-xs mt-6">Демо: admin / admin</p>
      </div>
    </div>
  )
}
