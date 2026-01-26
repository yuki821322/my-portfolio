import { useState } from 'react'
import './Login.css'

type Props = {
  onLogin: () => void
}

export function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください')
      return
    }

    // localStorage認証（デモ用）
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find((u: { email: string; password: string }) =>
      u.email === email && u.password === password
    )

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
      onLogin()
    } else {
      setError('メールアドレスまたはパスワードが間違っています')
    }
  }

  const handleRegister = () => {
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください')
      return
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const exists = users.some((u: { email: string }) => u.email === email)

    if (exists) {
      setError('このメールアドレスは既に登録されています')
      return
    }

    const newUser = { email, password }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    onLogin()
  }

  return (
    <div className="login">
      <div className="login-card">
        <h1 className="login-title">
          Task<span className="login-title-accent">Board</span>
        </h1>
        <p className="login-subtitle">ログインして始める</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="email" className="login-label">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              placeholder="example@mail.com"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-label">パスワード</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            ログイン
          </button>

          <button type="button" onClick={handleRegister} className="login-button-secondary">
            新規登録
          </button>
        </form>
      </div>
    </div>
  )
}
