import { useState, useEffect } from 'react'
import { Login } from './components/Login'
import './App.css'

type Screen = 'lp' | 'login' | 'app'

function App() {
  const [screen, setScreen] = useState<Screen>('lp')

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (user) {
      setScreen('app')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setScreen('lp')
  }

  if (screen === 'login') {
    return <Login onLogin={() => setScreen('app')} />
  }

  if (screen === 'app') {
    return (
      <div className="app-main">
        <header className="app-header">
          <h1 className="app-logo">
            Task<span className="app-logo-accent">Board</span>
          </h1>
          <button onClick={handleLogout} className="logout-button">
            ログアウト
          </button>
        </header>
        <main className="app-content">
          <p className="app-placeholder">ダッシュボード（準備中）</p>
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
