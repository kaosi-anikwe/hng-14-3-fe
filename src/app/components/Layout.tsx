import { useLocation, useNavigate, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { LayoutDashboard, Users, Search, User, LogOut, Menu, Sun, Moon } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'

const themes = [
  'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave',
  'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua',
  'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula',
  'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee',
  'winter', 'dim', 'nord', 'sunset', 'caramellatte', 'abyss', 'silk',
]

export default function Layout() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    function setBroswerTheme() {
      const saved = localStorage.getItem('insighta_theme')
      const resolvedTheme = saved ?? themes[Math.floor(Math.random() * themes.length)]
      if (!saved) localStorage.setItem('insighta_theme', resolvedTheme)
      setTheme(resolvedTheme)
      document.documentElement.setAttribute('data-theme', resolvedTheme)
    }
    setBroswerTheme()
  }, [])

  const toggleTheme = useCallback(() => {
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
    localStorage.setItem('insighta_theme', nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    toast(`Theme: ${nextTheme}`, 'info')
  }, [theme, toast])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profiles', label: 'Profiles', icon: Users },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/account', label: 'Account', icon: User }
  ]

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="main-drawer" title="Main Drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-100 lg:hidden border-b border-base-300">
          <div className="flex-none">
            <label htmlFor="main-drawer" className="btn btn-square btn-ghost">
              <Menu size={20} />
            </label>
          </div>
          <div className="flex-1">
            <span className="text-xl">Insighta Labs+</span>
          </div>
          <div className="flex-none">
            <button onClick={toggleTheme} className="btn btn-circle btn-ghost">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>

        <main className="flex-1 p-6 lg:p-8 bg-base-200">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <div className="drawer-side">
        <label htmlFor="main-drawer" className="drawer-overlay"></label>
        <aside className="bg-base-100 w-64 min-h-full flex flex-col border-r border-base-300">
          <div className="p-6 border-b border-base-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Search size={22} className="text-primary-content" />
              </div>
              <div>
                <h2 className="text-lg">Insighta Labs+</h2>
                <p className="text-xs text-base-content/60">Profile Intelligence</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="menu gap-2">
              {navItems.map(item => (
                <li key={item.path} className='w-50'>
                  <Link
                    to={item.path}
                    className={isActive(item.path) ? 'active' : ''}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-base-300">
            <div className="dropdown dropdown-top w-full">
              <div tabIndex={0} className="btn btn-ghost w-full justify-start gap-3 h-auto py-2">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src={user?.avatar_url} alt={user?.username} />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm">{user?.username}</div>
                  <div className="text-xs text-base-content/60">{user?.role}</div>
                </div>
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-lg border border-base-300 mb-2">
                <li>
                  <button onClick={toggleTheme} className="gap-2">
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    Toggle Theme
                  </button>
                </li>
                <li>
                  <button onClick={handleLogout} className="gap-2 text-error">
                    <LogOut size={16} />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
