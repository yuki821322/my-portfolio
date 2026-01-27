import type { Task, TaskStatus } from '../types/Task'
import { TaskCard } from './TaskCard'
import './KanbanBoard.css'

type Props = {
  tasks: Task[]
  onUpdateTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

const columns: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: '未着手' },
  { status: 'doing', label: '進行中' },
  { status: 'done', label: '完了' },
]

export function KanbanBoard({ tasks, onUpdateTask, onDeleteTask }: Props) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    const task = tasks.find(t => t.id === taskId)
    if (task && task.status !== status) {
      onUpdateTask({ ...task, status })
    }
  }

  return (
    <div className="kanban-board">
      {columns.map(column => (
        <div
          key={column.status}
          className="kanban-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.status)}
        >
          <div className="kanban-column-header">
            <h3 className="kanban-column-title">{column.label}</h3>
            <span className="kanban-column-count">
              {tasks.filter(t => t.status === column.status).length}
            </span>
          </div>
          <div className="kanban-column-content">
            {tasks
              .filter(task => task.status === column.status)
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
