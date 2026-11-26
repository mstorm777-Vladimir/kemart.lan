import { useState } from 'react'
import { Save } from 'lucide-react'

export default function SiteSettings() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'КемАРТ - студия дизайна интерьера Кемерово',
    siteDescription: 'лучшая студия дизайна в городе Кемерово по версии наших мам',
    siteKeywords: 'дизайн студия Кемерово, дизайн интерьера Кемерово, проект квартиры Кемерово',
    siteUrl: 'https://kemart.ru',
    yandexMetricaId: '106166118',
    yandexMetricaId2: '106150251',
    headerBg: '#494840',
    accentColor: '#2D98DA',
    fontTitle: 'Ubuntu',
    fontBody: 'Open Sans',
    aboutText: 'КемАрт - семейная студия, которая знает как должен выглядеть дом для семьи. Наша команда уже 15 лет создает дизайн интерьеров разной сложности, как жилых, так и коммерческих объектов.',
    footerTagline: 'Ваш дом - ваши правила',
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Настройки сайта</h1>
          <p className="text-gray-500 mt-1">Общие параметры и SEO</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[#2D98DA] text-white rounded-lg hover:bg-[#2580b8] transition-colors">
          <Save className="w-4 h-4" />
          Сохранить
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <p className="text-sm text-green-700">Настройки сохранены</p>
        </div>
      )}

      <div className="space-y-6">
        {/* SEO */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-semibold text-gray-900">SEO настройки</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title страницы</label>
            <input type="text" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={settings.siteDescription} onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
            <textarea value={settings.siteKeywords} onChange={(e) => setSettings({ ...settings, siteKeywords: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL сайта</label>
            <input type="url" value={settings.siteUrl} onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-semibold text-gray-900">Яндекс.Метрика</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID счётчика 1</label>
              <input type="text" value={settings.yandexMetricaId} onChange={(e) => setSettings({ ...settings, yandexMetricaId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID счётчика 2</label>
              <input type="text" value={settings.yandexMetricaId2} onChange={(e) => setSettings({ ...settings, yandexMetricaId2: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-semibold text-gray-900">Внешний вид</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цвет шапки</label>
              <div className="flex items-center gap-3">
                <input type="color" value={settings.headerBg} onChange={(e) => setSettings({ ...settings, headerBg: e.target.value })} className="w-10 h-10 rounded cursor-pointer border" />
                <input type="text" value={settings.headerBg} onChange={(e) => setSettings({ ...settings, headerBg: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Акцентный цвет</label>
              <div className="flex items-center gap-3">
                <input type="color" value={settings.accentColor} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer border" />
                <input type="text" value={settings.accentColor} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Шрифт заголовков</label>
              <select value={settings.fontTitle} onChange={(e) => setSettings({ ...settings, fontTitle: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]">
                <option>Ubuntu</option>
                <option>Montserrat</option>
                <option>Roboto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Шрифт текста</label>
              <select value={settings.fontBody} onChange={(e) => setSettings({ ...settings, fontBody: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]">
                <option>Open Sans</option>
                <option>Inter</option>
                <option>Roboto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-semibold text-gray-900">Контент</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Текст «О студии»</label>
            <textarea value={settings.aboutText} onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Подпись в футере</label>
            <input type="text" value={settings.footerTagline} onChange={(e) => setSettings({ ...settings, footerTagline: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
          </div>
        </div>
      </div>
    </div>
  )
}
