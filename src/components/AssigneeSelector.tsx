import type { User } from '../types/Task'
import { UserAvatar } from './UserAvatar'
import './AssigneeSelector.css'

type Props = {
  users: User[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function AssigneeSelector({ users, selectedIds, onChange }: Props) {
  const toggleUser = (userId: string) => {
    if (selectedIds.includes(userId)) {
      onChange(selectedIds.filter((id) => id !== userId))
    } else {
      onChange([...selectedIds, userId])
    }
  }

  return (
    <div className="assignee-selector">
      {users.map((user) => (
        <button
          type="button"
          key={user.id}
          className={`assignee-item ${selectedIds.includes(user.id) ? 'selected' : ''}`}
          onClick={() => toggleUser(user.id)}
        >
          <UserAvatar user={user} size="sm" />
          <span className="assignee-name">{user.name}</span>
        </button>
      ))}
    </div>
  )
}
