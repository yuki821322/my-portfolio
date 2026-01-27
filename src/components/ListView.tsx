import type { Task, User } from '../types/Task'
import { UserAvatar } from './UserAvatar'
import './ListView.css'

type Props = {
  tasks: Task[]
  users: User[]
  onUpdateTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onSelectTask: (taskId: string) => void
}

const statusLabels: Record<Task['status'], string> = {
  todo: '未着手',
  doing: '進行中',
  done: '完了',
}

export function ListView({ tasks, users, onUpdateTask, onDeleteTask, onSelectTask }: Props) {
  const handleToggleDone = (task: Task) => {
    onUpdateTask({
      ...task,
      status: task.status === 'done' ? 'todo' : 'done',
    })
  }

  const handleStatusChange = (task: Task, status: Task['status']) => {
    onUpdateTask({ ...task, status })
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const order = { todo: 0, doing: 1, done: 2 }
    return order[a.status] - order[b.status]
  })

  return (
    <div className="list-view">
      {sortedTasks.length === 0 ? (
        <p className="list-view-empty">タスクがありません</p>
      ) : (
        <ul className="list-view-items">
          {sortedTasks.map(task => (
            <li
              key={task.id}
              className={`list-view-item ${task.status === 'done' ? 'done' : ''}`}
              onClick={() => onSelectTask(task.id)}
            >
              <label className="list-view-checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={task.status === 'done'}
                  onChange={(e) => {
                    e.stopPropagation()
                    handleToggleDone(task)
                  }}
                  className="list-view-checkbox"
                />
                <span className="list-view-checkmark"></span>
              </label>
              <div className="list-view-content">
                <span className="list-view-title">{task.title}</span>
                {task.description && (
                  <span className="list-view-description">{task.description}</span>
                )}
                {task.assignedTo.length > 0 && (
                  <div className="list-view-assignees">
                    {users
                      .filter((user) => task.assignedTo.includes(user.id))
                      .slice(0, 3)
                      .map((user) => (
                        <UserAvatar key={user.id} user={user} size="sm" />
                      ))}
                  </div>
                )}
              </div>
              <select
                className="list-view-status"
                value={task.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation()
                  handleStatusChange(task, e.target.value as Task['status'])
                }}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <button
                className="list-view-delete"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteTask(task.id)
                }}
                aria-label="タスクを削除"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
