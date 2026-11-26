import { useState, useEffect } from 'react'
import { Image as ImageIcon, Wrench, MessageSquare, BookOpen, Download, Upload } from 'lucide-react'
import { api } from '../api'

const statsTemplate = [
  { title: 'Проектов в портфолио', key: 'portfolio', icon: ImageIcon, color: 'bg-[#2D98DA]' },
  { title: 'Услуг', key: 'services', icon: Wrench, color: 'bg-green-500' },
  { title: 'Отзывов', key: 'reviews', icon: MessageSquare, color: 'bg-purple-500' },
  { title: 'Статей в блоге', key: 'blog', icon: BookOpen, color: 'bg-orange-500' },
]

const siteSections = [
  { name: 'Главная', url: '/' },
  { name: 'Портфолио', url: '/portfolio' },
  { name: 'Наш прайс', url: '/price' },
  { name: 'О студии', url: '/aboutus' },
  { name: 'Как мы работаем', url: '/working' },
  { name: 'Контакты', url: '/contacts' },
  { name: 'Блог', url: '/blog' },
  { name: 'Чертежи', url: '/chertezhi' },
  { name: 'Полезное', url: '/useful' },
]

export default function Dashboard() {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await api.getStats()
      setStats(data)
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err)
    }
    setLoading(false)
  }

  const handleExport = async () => {
    try {
      const data = await api.exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `kemart-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Ошибка экспорта')
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      if (!confirm('Импорт заменит все текущие данные. Продолжить?')) return
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        await api.importData(data)
        alert('Данные импортированы!')
        loadStats()
      } catch (err) {
        alert('Ошибка импорта')
      }
    }
    input.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
          <p className="text-gray-500 mt-1">КемАрт — студия дизайна интерьера, Кемерово</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4" />
            Экспорт
          </button>
          <button onClick={handleImport} className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Upload className="w-4 h-4" />
            Импорт
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsTemplate.map((stat) => (
          <div key={stat.key} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {loading ? '...' : (stats[stat.key] ?? 0)}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">📍 Адрес</h3>
          <p className="text-sm text-gray-600">г. Кемерово, пр. Советский 2/8, оф. 409</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">📞 Телефоны</h3>
          <p className="text-sm text-gray-600">8-951-168-80-08</p>
          <p className="text-sm text-gray-600">8-950-591-56-88</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">🌐 Соцсети</h3>
          <p className="text-sm text-gray-600">VK: vk.com/kem_art</p>
          <p className="text-sm text-gray-600">TG: @kemart</p>
        </div>
      </div>

      {/* Site Sections */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Разделы сайта</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Раздел</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">URL</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {siteSections.map((s) => (
                <tr key={s.url} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-500"><code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{s.url}</code></td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Активен</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
