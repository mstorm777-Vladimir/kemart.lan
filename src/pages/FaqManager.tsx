import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { api } from '../api'

export default function FaqManager() {
  const [faq, setFaq] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingFaq, setEditingFaq] = useState<any>(null)
  const [formData, setFormData] = useState({ question: '', answer: '' })
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadFaq() }, [])

  const loadFaq = async () => {
    try {
      const data = await api.getFaq()
      setFaq(data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleAdd = () => {
    setEditingFaq(null)
    setFormData({ question: '', answer: '' })
    setShowModal(true)
  }

  const handleEdit = (item: any) => {
    setEditingFaq(item)
    setFormData({ question: item.question, answer: item.answer })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Удалить этот вопрос?')) {
      try {
        await api.deleteFaq(id)
        setFaq(faq.filter((f) => f.id !== id))
      } catch (err) { alert('Ошибка удаления') }
    }
  }

  const handleSave = async () => {
    try {
      if (editingFaq) {
        await api.updateFaq(editingFaq.id, { ...formData, order_num: editingFaq.order_num })
      } else {
        await api.createFaq({ ...formData, order_num: faq.length + 1 })
      }
      setShowModal(false)
      loadFaq()
    } catch (err) { alert('Ошибка сохранения') }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Загрузка...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ</h1>
          <p className="text-gray-500 mt-1">Часто задаваемые вопросы</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-[#2D98DA] text-white rounded-lg hover:bg-[#2580b8]">
          <Plus className="w-4 h-4" />
          Добавить вопрос
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {faq.map((item) => (
            <div key={item.id} className="p-5 hover:bg-gray-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{item.question}</h3>
                    {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  </div>
                  {expandedId === item.id && (
                    <p className="text-sm text-gray-600 mt-2">{item.answer}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleEdit(item)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {faq.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">Нет вопросов. Добавьте первый!</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingFaq ? 'Редактировать' : 'Новый вопрос'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Вопрос</label><input type="text" value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Ответ</label><textarea value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" /></div>
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
