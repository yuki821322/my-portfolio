import { useState, useEffect } from 'react'
import { Login } from './components/Login'
import { Dashboard } from './components/Dashboard'
import { UserAvatar } from './components/UserAvatar'
import type { User } from './types/Task'
import './App.css'

type Screen = 'lp' | 'login' | 'app'

function App() {
  const [screen, setScreen] = useState<Screen>('lp')
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (user) {
      setScreen('app')
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setScreen('lp')
    setCurrentUser(null)
  }

  const handleLogin = () => {
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    setScreen('app')
  }

  if (screen === 'login') {
    return <Login onLogin={handleLogin} />
  }

  if (screen === 'app') {
    return (
      <div className="app-main">
        <header className="app-header">
          <h1 className="app-logo">
            Task<span className="app-logo-accent">Board</span>
          </h1>
          <div className="app-header-actions">
            {currentUser && (
              <div className="app-user">
                <UserAvatar user={currentUser} size="sm" />
                <div className="app-user-info">
                  <span className="app-user-name">{currentUser.name}</span>
                  <span className="app-user-email">{currentUser.email}</span>
                </div>
              </div>
            )}
            <button onClick={handleLogout} className="logout-button">
              ログアウト
            </button>
          </div>
        </header>
        <main className="app-content">
          <Dashboard />
        </main>
      </div>
    )
  }

  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Task<span className="hero-title-accent">Board</span>
        </h1>
        <p className="hero-description">
          <span className="hero-subtitle">集中力を可視化するタスク管理</span>
        </p>
        <button className="hero-button" onClick={() => setScreen('login')}>
          はじめる
        </button>
      </div>
    </div>
  )
}

export default App
