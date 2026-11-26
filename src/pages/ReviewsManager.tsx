import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Star } from 'lucide-react'
import { api } from '../api'

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingReview, setEditingReview] = useState<any>(null)
  const [formData, setFormData] = useState({ name: '', project: '', text: '', image: '', rating: 5 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadReviews() }, [])

  const loadReviews = async () => {
    try {
      const data = await api.getReviews()
      setReviews(data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleAdd = () => {
    setEditingReview(null)
    setFormData({ name: '', project: '', text: '', image: '', rating: 5 })
    setShowModal(true)
  }

  const handleEdit = (review: any) => {
    setEditingReview(review)
    setFormData({ name: review.name, project: review.project, text: review.text, image: review.image, rating: review.rating })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Удалить этот отзыв?')) {
      try {
        await api.deleteReview(id)
        setReviews(reviews.filter((r) => r.id !== id))
      } catch (err) { alert('Ошибка удаления') }
    }
  }

  const handleSave = async () => {
    try {
      if (editingReview) {
        await api.updateReview(editingReview.id, formData)
      } else {
        await api.createReview(formData)
      }
      setShowModal(false)
      loadReviews()
    } catch (err) { alert('Ошибка сохранения') }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Загрузка...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Отзывы клиентов</h1>
          <p className="text-gray-500 mt-1">Управление отзывами на сайте</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-[#2D98DA] text-white rounded-lg hover:bg-[#2580b8]">
          <Plus className="w-4 h-4" />
          Добавить отзыв
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
            <p className="text-xs text-gray-500">Отзывов</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-500">
              {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0'}
            </p>
            <p className="text-xs text-gray-500">Средний рейтинг</p>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{review.name}</h3>
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{review.project}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{review.text}</p>
              </div>
              <div className="flex items-center gap-1 ml-3">
                <button onClick={() => handleEdit(review)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(review.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">Нет отзывов. Добавьте первый!</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingReview ? 'Редактировать отзыв' : 'Новый отзыв'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Имя клиента</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Проект</label><input type="text" value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" placeholder="Квартира в Кемерово. 2024г." /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Текст отзыва</label><textarea value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Рейтинг</label><select value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]"><option value={5}>5 звёзд</option><option value={4}>4 звезды</option><option value={3}>3 звезды</option></select></div>
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
