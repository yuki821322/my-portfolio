import { useState } from 'react'
import type { Project, Team, User } from '../types/Task'
import './ProjectModal.css'

type Props = {
  teams: Team[]
  currentUser: User | null
  onCreate: (project: Project) => void
  onClose: () => void
}

const colorOptions = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6']

export function ProjectModal({ teams, currentUser, onCreate, onClose }: Props) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(colorOptions[0])
  const [isTeam, setIsTeam] = useState(false)
  const [teamId, setTeamId] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    if (isTeam && !teamId) return

    onCreate({
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
      isTeam,
      teamId: isTeam ? teamId : null,
      ownerId: currentUser?.id ?? '',
      createdAt: new Date().toISOString(),
    })
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal project-modal">
        <div className="modal-header">
          <h2 className="modal-title">プロジェクトを作成</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label htmlFor="project-name" className="modal-label">プロジェクト名</label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="modal-input"
              placeholder="例：マーケティング施策"
              autoFocus
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">カラー</label>
            <div className="project-modal-colors">
              {colorOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`project-modal-color ${color === option ? 'active' : ''}`}
                  style={{ backgroundColor: option }}
                  onClick={() => setColor(option)}
                  aria-label={`色 ${option}`}
                />
              ))}
            </div>
          </div>

          <div className="modal-field">
            <label className="modal-label">種別</label>
            <div className="project-modal-toggle">
              <button
                type="button"
                className={`project-modal-toggle-button ${!isTeam ? 'active' : ''}`}
                onClick={() => setIsTeam(false)}
              >
                個人
              </button>
              <button
                type="button"
                className={`project-modal-toggle-button ${isTeam ? 'active' : ''}`}
                onClick={() => setIsTeam(true)}
              >
                チーム
              </button>
            </div>
          </div>

          {isTeam && (
            <div className="modal-field">
              <label htmlFor="project-team" className="modal-label">チーム</label>
              <select
                id="project-team"
                className="modal-input"
                value={teamId ?? ''}
                onChange={(e) => setTeamId(e.target.value || null)}
              >
                <option value="">チームを選択</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="modal-button-secondary" onClick={onClose}>
              キャンセル
            </button>
            <button
              type="submit"
              className="modal-button-primary"
              disabled={!name.trim() || (isTeam && !teamId)}
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
