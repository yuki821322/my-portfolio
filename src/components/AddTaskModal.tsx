import { useState } from 'react'
import type { Project, User } from '../types/Task'
import { AssigneeSelector } from './AssigneeSelector'
import './AddTaskModal.css'

type Props = {
  projects: Project[]
  selectedProjectId: string | null
  availableAssignees: User[]
  currentUser: User | null
  onAdd: (title: string, description: string, projectId: string | null, assignedTo: string[]) => void
  onClose: () => void
}

export function AddTaskModal({
  projects,
  selectedProjectId,
  availableAssignees,
  currentUser,
  onAdd,
  onClose,
}: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState<string | null>(selectedProjectId)
  const [assignedTo, setAssignedTo] = useState<string[]>(currentUser ? [currentUser.id] : [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), description.trim(), projectId, assignedTo)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">タスクを追加</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label htmlFor="task-title" className="modal-label">タイトル</label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="modal-input"
              placeholder="タスクのタイトル"
              autoFocus
            />
          </div>
          <div className="modal-field">
            <label htmlFor="task-description" className="modal-label">説明（任意）</label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="modal-textarea"
              placeholder="タスクの詳細を入力"
              rows={3}
            />
          </div>

          {projects.length > 0 && (
            <div className="modal-field">
              <label htmlFor="task-project" className="modal-label">プロジェクト</label>
              <select
                id="task-project"
                className="modal-input"
                value={projectId || ''}
                onChange={(e) => setProjectId(e.target.value || null)}
              >
                <option value="">プロジェクトなし</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
          )}

          {availableAssignees.length > 0 && (
            <div className="modal-field">
              <label className="modal-label">担当者</label>
              <AssigneeSelector
                users={availableAssignees}
                selectedIds={assignedTo}
                onChange={setAssignedTo}
              />
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="modal-button-secondary" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="modal-button-primary" disabled={!title.trim()}>
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
