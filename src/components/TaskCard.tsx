import type { Task } from '../types/Task'
import './TaskCard.css'

type Props = {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) {
    return `${h}h ${m}m`
  }
  return `${m}m`
}

export function TaskCard({ task, onUpdate, onDelete }: Props) {
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
    >
      <div className="task-card-header">
        <h4 className="task-card-title">{task.title}</h4>
        <div className="task-card-actions">
          <button
            className={`task-card-focus ${task.isFocus ? 'active' : ''}`}
            onClick={handleToggleFocus}
            aria-label="フォーカス"
            title="フォーカスに追加"
          >
            ◎
          </button>
          <button
            className="task-card-delete"
            onClick={() => onDelete(task.id)}
            aria-label="タスクを削除"
          >
            ×
          </button>
        </div>
      </div>
      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}
      <div className="task-card-footer">
        <select
          className="task-card-status"
          value={task.status}
          onChange={handleStatusChange}
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
