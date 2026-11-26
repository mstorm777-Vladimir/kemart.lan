import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react'
import { api } from '../api'

export default function BlogManager() {
  const [posts, setPosts] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [formData, setFormData] = useState({ title: '', excerpt: '', content: '', image: '', slug: '', status: 'draft' })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadPosts() }, [])

  const loadPosts = async () => {
    try {
      const data = await api.getBlog()
      setPosts(data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleAdd = () => {
    setEditingPost(null)
    setFormData({ title: '', excerpt: '', content: '', image: '', slug: '', status: 'draft' })
    setShowModal(true)
  }

  const handleEdit = (post: any) => {
    setEditingPost(post)
    setFormData({ title: post.title, excerpt: post.excerpt, content: post.content, image: post.image, slug: post.slug, status: post.status })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Удалить эту статью?')) {
      try {
        await api.deleteBlog(id)
        setPosts(posts.filter((p) => p.id !== id))
      } catch (err) { alert('Ошибка удаления') }
    }
  }

  const handleSave = async () => {
    try {
      if (editingPost) {
        await api.updateBlog(editingPost.id, formData)
      } else {
        await api.createBlog(formData)
      }
      setShowModal(false)
      loadPosts()
    } catch (err) { alert('Ошибка сохранения') }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Загрузка...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Блог</h1>
          <p className="text-gray-500 mt-1">Статьи и полезные материалы</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-[#2D98DA] text-white rounded-lg hover:bg-[#2580b8]">
          <Plus className="w-4 h-4" />
          Новая статья
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Пока нет статей. Создайте первую!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{post.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {post.status === 'published' ? 'Опубликовано' : 'Черновик'}
                  </span>
                </div>
                {post.excerpt && <p className="text-sm text-gray-500 mt-1">{post.excerpt}</p>}
                <p className="text-xs text-gray-400 mt-2">/useful/{post.slug} • {new Date(post.created_at).toLocaleDateString('ru-RU')}</p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button onClick={() => handleEdit(post)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingPost ? 'Редактировать статью' : 'Новая статья'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Краткое описание</label><textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Содержание (HTML)</label><textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={8} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" placeholder="HTML или текст статьи..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">URL (slug)</label><input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Статус</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]"><option value="draft">Черновик</option><option value="published">Опубликовано</option></select></div>
              </div>
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
