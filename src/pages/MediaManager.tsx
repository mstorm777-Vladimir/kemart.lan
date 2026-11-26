import { useState } from 'react'
import { Upload, Trash2, Download, Grid, List, Image as ImageIcon } from 'lucide-react'

interface MediaFile {
  id: number
  name: string
  type: 'image' | 'document' | 'video'
  size: string
  date: string
  dimensions?: string
}

const initialFiles: MediaFile[] = [
  { id: 1, name: '40456014-14bd-4a06-8027-bff091637204-15541264.jpeg', type: 'image', size: '2.4 MB', date: '2024-01-15', dimensions: '1920x1080' },
  { id: 2, name: '1527914d-3563-4460-9b2a-37059251c087-15541452.jpeg', type: 'image', size: '1.8 MB', date: '2024-01-14', dimensions: '1200x1200' },
  { id: 3, name: '85a6280d-0d19-4c78-a00c-58793425aab8-15547867.jpeg', type: 'image', size: '3.1 MB', date: '2024-01-13', dimensions: '1600x900' },
  { id: 4, name: 'a5912feb-ecbc-4b97-9193-c44265b6939b-15557864.jpeg', type: 'image', size: '2.7 MB', date: '2024-01-12', dimensions: '1600x900' },
  { id: 5, name: '9592c6db-4511-4a6a-af33-9b36844ad50e-15557863.jpeg', type: 'image', size: '2.2 MB', date: '2024-01-11', dimensions: '1600x900' },
  { id: 6, name: '9d36b536-bdd5-489f-9825-9f9fb37fcc90-15657347.jpeg', type: 'image', size: '4.5 MB', date: '2024-01-10', dimensions: '1920x1080' },
  { id: 7, name: '6ecd5946-c019-4368-bfae-25500dcb3099-6432129.jpeg', type: 'image', size: '3.8 MB', date: '2024-01-09', dimensions: '1920x1080' },
  { id: 8, name: 'fe84e8d5-3084-44a7-b2ff-012d8fab570e-15657367.jpeg', type: 'image', size: '890 KB', date: '2024-01-08', dimensions: '800x600' },
  { id: 9, name: '6f46446c-a166-4319-8634-7897d701560e-6368120.jpeg', type: 'image', size: '156 KB', date: '2024-01-07', dimensions: '120x120' },
  { id: 10, name: 'e24463c0-15d4-4cfd-b133-cf52a284138d-6556086.png', type: 'image', size: '32 KB', date: '2024-01-06', dimensions: '64x64' },
]

export default function MediaManager() {
  const [files, setFiles] = useState<MediaFile[]>(initialFiles)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const [showUpload, setShowUpload] = useState(false)

  const handleDelete = (id: number) => {
    if (confirm('Удалить файл?')) {
      setFiles(files.filter((f) => f.id !== id))
      setSelectedFiles(selectedFiles.filter((sid) => sid !== id))
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Удалить ${selectedFiles.length} файлов?`)) {
      setFiles(files.filter((f) => !selectedFiles.includes(f.id)))
      setSelectedFiles([])
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedFiles(selectedFiles.includes(id) ? selectedFiles.filter((sid) => sid !== id) : [...selectedFiles, id])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Медиафайлы</h1>
          <p className="text-gray-500 mt-1">Изображения и ресурсы сайта (assets/img/)</p>
        </div>
        <button onClick={() => setShowUpload(!showUpload)} className="flex items-center gap-2 px-4 py-2 bg-[#2D98DA] text-white rounded-lg hover:bg-[#2580b8] transition-colors">
          <Upload className="w-4 h-4" />
          Загрузить
        </button>
      </div>

      {showUpload && (
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-dashed border-[#2D98DA]/30">
          <div className="text-center">
            <Upload className="w-12 h-12 text-[#2D98DA] mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Перетащите файлы сюда или нажмите для выбора</p>
            <p className="text-sm text-gray-400">Файлы будут сохранены в assets/img/</p>
            <p className="text-xs text-red-500 mt-2">⚠️ GitHub ограничивает размер загрузки. Загружайте файлы напрямую на хостинг.</p>
            <input type="file" multiple accept="image/*" className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="inline-block mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors">
              Выбрать файлы
            </label>
          </div>
        </div>
      )}

      {/* Stats & Toolbar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Всего: <strong>{files.length}</strong> файлов</span>
          {selectedFiles.length > 0 && (
            <button onClick={handleBulkDelete} className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">
              <Trash2 className="w-3.5 h-3.5" />
              Удалить ({selectedFiles.length})
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:bg-gray-100'}`}><Grid className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:bg-gray-100'}`}><List className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Files */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {files.map((file) => (
            <div key={file.id} className={`bg-white rounded-xl overflow-hidden shadow-sm border cursor-pointer hover:shadow-md transition-all ${selectedFiles.includes(file.id) ? 'border-[#2D98DA] ring-2 ring-blue-200' : 'border-gray-100'}`} onClick={() => toggleSelect(file.id)}>
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-300" />
              </div>
              <div className="p-2">
                <p className="text-[10px] font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-[10px] text-gray-400">{file.size}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Файл</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Размер</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Разрешение</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Дата</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-xs">{file.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{file.size}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{file.dimensions || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{file.date}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(file.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
