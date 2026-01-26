import { useState, useEffect } from 'react'
import type { Task } from '../types/Task'
import { KanbanBoard } from './KanbanBoard'
import { ListView } from './ListView'
import { AddTaskModal } from './AddTaskModal'
import './Dashboard.css'

type ViewMode = 'kanban' | 'list'

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleAddTask = (title: string, description: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks([...tasks, newTask])
  }

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task =>
      task.id === updatedTask.id
        ? { ...updatedTask, updatedAt: new Date().toISOString() }
        : task
    ))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  return (
    <div className="dashboard">
      <div className="dashboard-toolbar">
        <div className="view-toggle">
          <button
            className={`view-toggle-button ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewMode('kanban')}
          >
            カンバン
          </button>
          <button
            className={`view-toggle-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            リスト
          </button>
        </div>
        <button className="add-task-button" onClick={() => setIsModalOpen(true)}>
          + タスク追加
        </button>
      </div>

      {viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      ) : (
        <ListView
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {isModalOpen && (
        <AddTaskModal
          onAdd={handleAddTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
