import { useState, useEffect } from 'react'
import { Save, MapPin, Phone, Mail, Globe } from 'lucide-react'
import { api } from '../api'

export default function ContactsSettings() {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState({
    address: '',
    phone1: '',
    phone2: '',
    email: '',
    telegram: '',
    vk: '',
    whatsapp: '',
    instagram: '',
    workHours: '',
    mapEmbed: '',
  })

  useEffect(() => { loadContacts() }, [])

  const loadContacts = async () => {
    try {
      const data = await api.getSettings()
      setContacts({
        address: data.address || 'г. Кемерово, пр. Советский 2/8, оф. 409',
        phone1: data.phone1 || '8-951-168-80-08',
        phone2: data.phone2 || '8-950-591-56-88',
        email: data.email || 'kem-art@yandex.ru',
        telegram: data.telegram || 'https://t.me/kemart',
        vk: data.vk || 'https://vk.com/kem_art',
        whatsapp: data.whatsapp || 'https://wa.me/89511688008',
        instagram: data.instagram || '',
        workHours: data.workHours || 'Пн-Пт: 10:00 - 19:00, Сб: 11:00 - 16:00',
        mapEmbed: data.mapEmbed || '',
      })
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleSave = async () => {
    try {
      await api.updateSettings(contacts)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Ошибка сохранения')
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Загрузка...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Контакты</h1>
          <p className="text-gray-500 mt-1">Контактная информация на сайте</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[#2D98DA] text-white rounded-lg hover:bg-[#2580b8]">
          <Save className="w-4 h-4" />
          Сохранить
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <p className="text-sm text-green-700">Контакты сохранены</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#2D98DA]" /> Адрес и телефоны</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Адрес офиса</label>
            <input type="text" value={contacts.address} onChange={(e) => setContacts({ ...contacts, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон 1</label>
            <input type="text" value={contacts.phone1} onChange={(e) => setContacts({ ...contacts, phone1: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон 2</label>
            <input type="text" value={contacts.phone2} onChange={(e) => setContacts({ ...contacts, phone2: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={contacts.email} onChange={(e) => setContacts({ ...contacts, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Часы работы</label>
            <input type="text" value={contacts.workHours} onChange={(e) => setContacts({ ...contacts, workHours: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Globe className="w-5 h-5 text-[#2D98DA]" /> Социальные сети и мессенджеры</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telegram</label>
            <input type="url" value={contacts.telegram} onChange={(e) => setContacts({ ...contacts, telegram: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ВКонтакте</label>
            <input type="url" value={contacts.vk} onChange={(e) => setContacts({ ...contacts, vk: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input type="url" value={contacts.whatsapp} onChange={(e) => setContacts({ ...contacts, whatsapp: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram / Одноклассники</label>
            <input type="url" value={contacts.instagram} onChange={(e) => setContacts({ ...contacts, instagram: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Код карты (embed)</label>
            <textarea value={contacts.mapEmbed} onChange={(e) => setContacts({ ...contacts, mapEmbed: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" placeholder="Вставьте код Яндекс.Карты..." />
          </div>
        </div>
      </div>
    </div>
  )
}
