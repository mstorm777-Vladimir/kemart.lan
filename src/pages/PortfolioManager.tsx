import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react'
import { api } from '../api'

const categories = ['Гостиные', 'Кухни', 'Спальни', 'Детские', 'Прихожие', 'Ванные', 'Балконы', 'Общественные', 'Реализованные']

export default function PortfolioManager() {
  const [projects, setProjects] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [formData, setFormData] = useState({ title: '', category: '', description: '', image: '', status: 'draft' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const data = await api.getPortfolio()
      setProjects(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAdd = () => {
    setEditingProject(null)
    setFormData({ title: '', category: '', description: '', image: '', status: 'draft' })
    setShowModal(true)
  }

  const handleEdit = (project: any) => {
    setEditingProject(project)
    setFormData({ title: project.title, category: project.category, description: project.description, image: project.image, status: project.status })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Удалить этот проект?')) {
      try {
        await api.deletePortfolio(id)
        setProjects(projects.filter((p) => p.id !== id))
      } catch (err) {
        alert('Ошибка удаления')
      }
    }
  }

  const handleSave = async () => {
    try {
      if (editingProject) {
        await api.updatePortfolio(editingProject.id, formData)
      } else {
        await api.createPortfolio(formData)
      }
      setShowModal(false)
      loadProjects()
    } catch (err) {
      alert('Ошибка сохранения')
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Загрузка...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Портфолио</h1>
          <p className="text-gray-500 mt-1">Управление проектами и работами</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-[#2D98DA] text-white rounded-lg hover:bg-[#2580b8] transition-colors">
          <Plus className="w-4 h-4" />
          Добавить проект
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Поиск проектов..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D98DA]">
          <option value="all">Все категории</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <span className="text-4xl">🖼️</span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{project.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{project.category}</p>
              <div className="flex items-center justify-between mt-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${project.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {project.status === 'published' ? 'Опубликовано' : 'Черновик'}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(project)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(project.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingProject ? 'Редактировать проект' : 'Новый проект'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Название</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Категория</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]"><option value="">Выберите</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Описание</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Имя файла изображения</label><input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]" placeholder="project-name.jpeg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Статус</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D98DA]"><option value="draft">Черновик</option><option value="published">Опубликовано</option></select></div>
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
