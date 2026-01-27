import type { Task, User } from '../types/Task'
import { UserAvatar } from './UserAvatar'
import './TaskCard.css'

type Props = {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
  assignees: User[]
  onSelect: (taskId: string) => void
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) {
    return `${h}h ${m}m`
  }
  return `${m}m`
}

export function TaskCard({ task, onUpdate, onDelete, assignees, onSelect }: Props) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ ...task, status: e.target.value as Task['status'] })
  }

  const handleToggleFocus = () => {
    onUpdate({ ...task, isFocus: !task.isFocus })
  }

  return (
    <div
      className={`task-card ${task.isFocus ? 'focus' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelect(task.id)}
    >
      <div className="task-card-header">
        <h4 className="task-card-title">{task.title}</h4>
        <div className="task-card-actions">
          <button
            className={`task-card-focus ${task.isFocus ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              handleToggleFocus()
            }}
            aria-label="フォーカス"
            title="フォーカスに追加"
          >
            ◎
          </button>
          <button
            className="task-card-delete"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(task.id)
            }}
            aria-label="タスクを削除"
          >
            ×
          </button>
        </div>
      </div>
      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}
      {assignees.length > 0 && (
        <div className="task-card-assignees">
          {assignees.slice(0, 4).map((user) => (
            <UserAvatar key={user.id} user={user} size="sm" />
          ))}
          {assignees.length > 4 && (
            <span className="task-card-assignees-more">+{assignees.length - 4}</span>
          )}
        </div>
      )}
      <div className="task-card-footer">
        <select
          className="task-card-status"
          value={task.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation()
            handleStatusChange(e)
          }}
        >
          <option value="todo">未着手</option>
          <option value="doing">進行中</option>
          <option value="done">完了</option>
        </select>
        {task.totalTime > 0 && (
          <span className="task-card-time">{formatTime(task.totalTime)}</span>
        )}
      </div>
    </div>
  )
}
