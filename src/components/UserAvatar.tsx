import type { User } from '../types/Task'
import './UserAvatar.css'

type Props = {
  user: User | null
  size?: 'sm' | 'md' | 'lg'
}

const sizeClassName: Record<NonNullable<Props['size']>, string> = {
  sm: 'user-avatar-sm',
  md: 'user-avatar-md',
  lg: 'user-avatar-lg',
}

// ユーザーIDからハッシュ値を生成して色を決定
function getColorFromId(id: string): string {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  ]
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function getInitials(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return '?'
  const parts = trimmed.split(/\s+/)
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '')
  return initials.join('')
}

export function UserAvatar({ user, size = 'md' }: Props) {
  if (!user) {
    return (
      <div className={`user-avatar ${sizeClassName[size]} user-avatar-empty`}>
        ?
      </div>
    )
  }

  const backgroundColor = getColorFromId(user.id)
  const initials = getInitials(user.name)

  return (
    <div
      className={`user-avatar ${sizeClassName[size]}`}
      style={{ backgroundColor }}
      title={user.name}
    >
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} className="user-avatar-image" />
      ) : (
        <span className="user-avatar-initials">{initials}</span>
      )}
    </div>
  )
}
