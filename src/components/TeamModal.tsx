import { useState } from 'react'
import type { Team, User } from '../types/Task'
import { UserAvatar } from './UserAvatar'
import './TeamModal.css'

type Props = {
  teams: Team[]
  users: User[]
  currentUser: User
  onAddTeam: (name: string) => void
  onAddMember: (teamId: string, email: string) => boolean
  onRemoveMember: (teamId: string, userId: string) => void
  onDeleteTeam: (teamId: string) => void
  onClose: () => void
}

export function TeamModal({
  teams,
  users,
  currentUser,
  onAddTeam,
  onAddMember,
  onRemoveMember,
  onDeleteTeam,
  onClose,
}: Props) {
  const [newTeamName, setNewTeamName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(teams[0]?.id || null)
  const [error, setError] = useState('')

  const selectedTeam = teams.find((t) => t.id === selectedTeamId)
  const teamMembers = selectedTeam
    ? users.filter((u) => selectedTeam.memberIds.includes(u.id))
    : []

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return
    onAddTeam(newTeamName.trim())
    setNewTeamName('')
  }

  const handleInvite = () => {
    if (!inviteEmail.trim() || !selectedTeamId) return
    setError('')
    const success = onAddMember(selectedTeamId, inviteEmail.trim())
    if (success) {
      setInviteEmail('')
    } else {
      setError('このメールアドレスのユーザーが見つかりません')
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal team-modal">
        <div className="modal-header">
          <h2 className="modal-title">チーム管理</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="team-modal-content">
          <div className="team-create-section">
            <h3 className="team-section-title">新しいチームを作成</h3>
            <div className="team-create-form">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="modal-input"
                placeholder="チーム名を入力"
              />
              <button
                className="modal-button-primary"
                onClick={handleCreateTeam}
                disabled={!newTeamName.trim()}
              >
                作成
              </button>
            </div>
          </div>

          {teams.length > 0 && (
            <div className="team-manage-section">
              <h3 className="team-section-title">チームを管理</h3>
              <div className="team-tabs">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    className={`team-tab ${selectedTeamId === team.id ? 'active' : ''}`}
                    onClick={() => setSelectedTeamId(team.id)}
                  >
                    {team.name}
                  </button>
                ))}
              </div>

              {selectedTeam && (
                <div className="team-details">
                  <div className="team-invite">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="modal-input"
                      placeholder="メールアドレスでメンバーを招待"
                    />
                    <button
                      className="modal-button-primary"
                      onClick={handleInvite}
                      disabled={!inviteEmail.trim()}
                    >
                      招待
                    </button>
                  </div>
                  {error && <p className="team-error">{error}</p>}

                  <div className="team-members">
                    <h4 className="team-members-title">メンバー ({teamMembers.length})</h4>
                    <ul className="team-member-list">
                      {teamMembers.map((member) => (
                        <li key={member.id} className="team-member-item">
                          <UserAvatar user={member} size="sm" />
                          <div className="team-member-info">
                            <span className="team-member-name">{member.name}</span>
                            <span className="team-member-email">{member.email}</span>
                          </div>
                          {member.id === selectedTeam.ownerId && (
                            <span className="team-member-badge">オーナー</span>
                          )}
                          {member.id !== selectedTeam.ownerId && currentUser.id === selectedTeam.ownerId && (
                            <button
                              className="team-member-remove"
                              onClick={() => onRemoveMember(selectedTeam.id, member.id)}
                            >
                              削除
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {currentUser.id === selectedTeam.ownerId && (
                    <div className="team-danger-zone">
                      <button
                        className="team-delete-btn"
                        onClick={() => {
                          if (window.confirm(`チーム「${selectedTeam.name}」を削除しますか？`)) {
                            onDeleteTeam(selectedTeam.id)
                            setSelectedTeamId(teams.find((t) => t.id !== selectedTeam.id)?.id || null)
                          }
                        }}
                      >
                        チームを削除
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="modal-button-secondary" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
