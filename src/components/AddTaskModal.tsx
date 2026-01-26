import { useState } from 'react'
import './AddTaskModal.css'

type Props = {
  onAdd: (title: string, description: string) => void
  onClose: () => void
}

export function AddTaskModal({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), description.trim())
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
