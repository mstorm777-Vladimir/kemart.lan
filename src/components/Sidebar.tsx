import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Image as ImageIcon,
  Wrench,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Phone,
  FolderOpen,
  Settings,
  ChevronLeft,
  Home
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Дашборд' },
  { path: '/portfolio', icon: ImageIcon, label: 'Портфолио' },
  { path: '/services', icon: Wrench, label: 'Услуги и прайс' },
  { path: '/reviews', icon: MessageSquare, label: 'Отзывы' },
  { path: '/faq', icon: HelpCircle, label: 'FAQ' },
  { path: '/blog', icon: BookOpen, label: 'Блог' },
  { path: '/contacts', icon: Phone, label: 'Контакты' },
  { path: '/media', icon: FolderOpen, label: 'Медиафайлы' },
  { path: '/settings', icon: Settings, label: 'Настройки сайта' },
]

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-[#494840] text-white flex flex-col transition-all duration-300 ease-in-out flex-shrink-0`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {isOpen && (
          <div className="flex items-center gap-2">
            <Home className="w-7 h-7 text-[#2D98DA]" />
            <div>
              <span className="font-bold text-base block leading-tight">КемАрт</span>
              <span className="text-[10px] text-gray-400">Админ-панель</span>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform ${!isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#2D98DA] text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2D98DA] rounded-full flex items-center justify-center text-sm font-bold">
              А
            </div>
            <div>
              <p className="text-sm font-medium">Алёна</p>
              <p className="text-xs text-gray-400">kem-art@yandex.ru</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
