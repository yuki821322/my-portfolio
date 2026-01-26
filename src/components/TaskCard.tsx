import type { Task } from '../types/Task'
import './TaskCard.css'

type Props = {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, onUpdate, onDelete }: Props) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ ...task, status: e.target.value as Task['status'] })
  }

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="task-card-header">
        <h4 className="task-card-title">{task.title}</h4>
        <button
          className="task-card-delete"
          onClick={() => onDelete(task.id)}
          aria-label="タスクを削除"
        >
          ×
        </button>
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
          <option value="in_progress">進行中</option>
          <option value="done">完了</option>
        </select>
      </div>
    </div>
  )
}
