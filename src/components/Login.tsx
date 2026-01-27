import { useState } from 'react'
import type { User } from '../types/Task'
import './Login.css'

type Props = {
  onLogin: () => void
}

export function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください')
      return
    }

    // localStorage認証（デモ用）
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find((u) => u.email === email || u.name === email)

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
      onLogin()
    } else {
      setError('メールアドレスまたはパスワードが間違っています')
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください')
      return
    }

    if (!name.trim()) {
      setError('名前を入力してください')
      return
    }

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')
    const exists = users.some((u) => u.email === email)

    if (exists) {
      setError('このメールアドレスは既に登録されています')
      return
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    }
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
        <p className="login-subtitle">
          {isRegisterMode ? '新規アカウントを作成' : 'ログインして始める'}
        </p>

        <form onSubmit={isRegisterMode ? handleRegister : handleSubmit} className="login-form">
          {isRegisterMode && (
            <div className="login-field">
              <label htmlFor="name" className="login-label">名前</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="login-input"
                placeholder="山田 太郎"
              />
            </div>
          )}

          <div className="login-field">
            <label htmlFor="email" className="login-label">メールアドレス / ユーザー名</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              placeholder="example@mail.com または 山田 太郎"
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
            {isRegisterMode ? '登録' : 'ログイン'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode)
              setError('')
            }}
            className="login-button-secondary"
          >
            {isRegisterMode ? 'ログインに戻る' : '新規登録'}
          </button>
        </form>
      </div>
    </div>
  )
}
