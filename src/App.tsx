import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import PortfolioManager from './pages/PortfolioManager'
import ServicesManager from './pages/ServicesManager'
import ReviewsManager from './pages/ReviewsManager'
import FaqManager from './pages/FaqManager'
import BlogManager from './pages/BlogManager'
import ContactsSettings from './pages/ContactsSettings'
import MediaManager from './pages/MediaManager'
import SiteSettings from './pages/SiteSettings'
import Login from './pages/Login'
import { api } from './api'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('kemart_token')
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      await api.login(username, password)
      setIsLoggedIn(true)
      return true
    } catch (err) {
      return false
    }
  }

  const handleLogout = () => {
    api.logout()
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onLogout={handleLogout} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/portfolio" element={<PortfolioManager />} />
              <Route path="/services" element={<ServicesManager />} />
              <Route path="/reviews" element={<ReviewsManager />} />
              <Route path="/faq" element={<FaqManager />} />
              <Route path="/blog" element={<BlogManager />} />
              <Route path="/contacts" element={<ContactsSettings />} />
              <Route path="/media" element={<MediaManager />} />
              <Route path="/settings" element={<SiteSettings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
