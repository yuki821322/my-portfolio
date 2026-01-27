import { useState, useEffect, useCallback } from 'react'
import type { Task } from '../types/Task'
import { KanbanBoard } from './KanbanBoard'
import { ListView } from './ListView'
import { FocusView } from './FocusView'
import { AnalyticsView } from './AnalyticsView'
import { CalendarView } from './CalendarView'
import { AddTaskModal } from './AddTaskModal'
import './Dashboard.css'

type ViewMode = 'kanban' | 'list' | 'focus' | 'analytics' | 'calendar'

const viewLabels: Record<ViewMode, string> = {
  kanban: 'カンバン',
  list: 'リスト',
  focus: 'フォーカス',
  analytics: '分析',
  calendar: 'カレンダー',
}

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 初回読み込み
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // 変更時に保存
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // 別タブ同期（storageイベント）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tasks' && e.newValue) {
        setTasks(JSON.parse(e.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleAddTask = useCallback((title: string, description: string, projectId: string | null = null) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFocus: false,
      totalTime: 0,
      startedAt: null,
      projectId,
    }
    setTasks(prev => [...prev, newTask])
  }, [])

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks(prev => prev.map(task =>
      task.id === updatedTask.id
        ? { ...updatedTask, updatedAt: new Date().toISOString() }
        : task
    ))
  }, [])

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }, [])

  const renderView = () => {
    switch (viewMode) {
      case 'kanban':
        return (
          <KanbanBoard
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )
      case 'list':
        return (
          <ListView
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )
      case 'focus':
        return (
          <FocusView
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
          />
        )
      case 'analytics':
        return <AnalyticsView tasks={tasks} />
      case 'calendar':
        return <CalendarView tasks={tasks} />
    }
  }

  const showAddButton = viewMode === 'kanban' || viewMode === 'list'

  return (
    <div className="dashboard">
      <div className="dashboard-toolbar">
        <div className="view-toggle">
          {(Object.keys(viewLabels) as ViewMode[]).map(mode => (
            <button
              key={mode}
              className={`view-toggle-button ${viewMode === mode ? 'active' : ''}`}
              onClick={() => setViewMode(mode)}
            >
              {viewLabels[mode]}
            </button>
          ))}
        </div>
        {showAddButton && (
          <button className="add-task-button" onClick={() => setIsModalOpen(true)}>
            + タスク追加
          </button>
        )}
      </div>

      {renderView()}

      {isModalOpen && (
        <AddTaskModal
          onAdd={handleAddTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
