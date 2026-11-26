import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { api } from '../api'

export default function ServicesManager() {
  const [services, setServices] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [formData, setFormData] = useState({ title: '', description: '', price: '', image: '', slug: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadServices() }, [])

  const loadServices = async () => {
    try {
      const data = await api.getServices()
      setServices(data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleAdd = () => {
    setEditingService(null)
    setFormData({ title: '', description: '', price: '', image: '', slug: '' })
    setShowModal(true)
  }

  const handleEdit = (service: any) => {
    setEditingService(service)
    setFormData({ title: service.title, description: service.description, price: service.price, image: service.image, slug: service.slug })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Удалить эту услугу?')) {
      try {
        await api.deleteService(id)
        setServices(services.filter((s) => s.id !== id))
      } catch (err) { alert('Ошибка удаления') }
    }
  }

  const handleSave = async () => {
    try {
      if (editingService) {
        await api.updateService(editingService.id, formData)
      } else {
        await api.createService(formData)
      }
      setShowModal(false)
      loadServices()
    } catch (err) { alert('Ошибка сохранения') }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Загрузка...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Услуги и прайс</h1>
          <p className="text-gray-500 mt-1">Управление услугами студии</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-[#2D98DA] text-white rounded-lg hover:bg-[#2580b8]">
          <Plus className="w-4 h-4" />
          Добавить услугу
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                <p className="text-lg font-bold text-[#2D98DA] mt-3">{service.price}</p>
                {service.slug && <p className="text-xs text-gray-400 mt-1">URL: /services/{service.slug}</p>}
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button onClick={() => handleEdit(service)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(service.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">Нет услуг. Добавьте первую!</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingService ? 'Редактировать услугу' : 'Новая услуга'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Название</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Описание</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Цена</label><input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" placeholder="от 1500 ₽/м²" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">URL (slug)</label><input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" placeholder="design_proekt" /></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Отмена</button>
              <button onClick={handleSave} className="px-4 py-2 bg-[#2D98DA] text-white rounded-lg hover:bg-[#2580b8]">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
