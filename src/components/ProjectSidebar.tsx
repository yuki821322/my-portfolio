import type { Project, Team, User } from '../types/Task'
import { UserAvatar } from './UserAvatar'
import './ProjectSidebar.css'

type ProjectStats = {
  total: number
  todo: number
  doing: number
  done: number
}

type Props = {
  projects: Project[]
  teams: Team[]
  users: User[]
  currentUser: User | null
  selectedProjectId: string | null | 'all'
  projectStats: Record<string, ProjectStats>
  onSelectProject: (projectId: string | null | 'all') => void
  onOpenProjectModal: () => void
  onOpenTeamModal: () => void
}

export function ProjectSidebar({
  projects,
  teams,
  users,
  currentUser,
  selectedProjectId,
  projectStats,
  onSelectProject,
  onOpenProjectModal,
  onOpenTeamModal,
}: Props) {
  const personalStats = projectStats['personal'] ?? { total: 0, todo: 0, doing: 0, done: 0 }
  const allStats = projectStats['all'] ?? { total: 0, todo: 0, doing: 0, done: 0 }

  return (
    <aside className="project-sidebar">
      <div className="project-sidebar-header">
        {currentUser && (
          <div className="project-sidebar-user">
            <UserAvatar user={currentUser} size="md" />
            <div>
              <div className="project-sidebar-user-name">{currentUser.name}</div>
              <div className="project-sidebar-user-email">{currentUser.email}</div>
            </div>
          </div>
        )}
      </div>

      <div className="project-sidebar-section">
        <div className="project-sidebar-section-title">概要</div>
        <button
          className={`project-sidebar-item ${selectedProjectId === 'all' ? 'active' : ''}`}
          onClick={() => onSelectProject('all')}
        >
          <span className="project-sidebar-item-label">すべて</span>
          <span className="project-sidebar-item-count">{allStats.total}</span>
        </button>
        <button
          className={`project-sidebar-item ${selectedProjectId === null ? 'active' : ''}`}
          onClick={() => onSelectProject(null)}
        >
          <span className="project-sidebar-item-label">個人</span>
          <span className="project-sidebar-item-count">{personalStats.total}</span>
        </button>
      </div>

      <div className="project-sidebar-section">
        <div className="project-sidebar-section-header">
          <div className="project-sidebar-section-title">プロジェクト</div>
          <button className="project-sidebar-link" onClick={onOpenProjectModal}>
            + 作成
          </button>
        </div>
        {projects.length === 0 ? (
          <div className="project-sidebar-empty">まだプロジェクトがありません</div>
        ) : (
          <div className="project-sidebar-list">
            {projects.map((project) => {
              const stats = projectStats[project.id] ?? { total: 0, todo: 0, doing: 0, done: 0 }
              const isSelected = selectedProjectId === project.id
              return (
                <button
                  key={project.id}
                  className={`project-sidebar-item ${isSelected ? 'active' : ''}`}
                  onClick={() => onSelectProject(project.id)}
                >
                  <span className="project-sidebar-item-color" style={{ backgroundColor: project.color }} />
                  <span className="project-sidebar-item-label">{project.name}</span>
                  <span className="project-sidebar-item-count">{stats.total}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="project-sidebar-section">
        <div className="project-sidebar-section-header">
          <div className="project-sidebar-section-title">チーム</div>
          <button className="project-sidebar-link" onClick={onOpenTeamModal}>
            管理
          </button>
        </div>
        {teams.length === 0 ? (
          <div className="project-sidebar-empty">まだチームがありません</div>
        ) : (
          <div className="project-sidebar-team-list">
            {teams.map((team) => {
              const memberCount = team.memberIds.length
              const owner = users.find((user) => user.id === team.ownerId)
              return (
                <div key={team.id} className="project-sidebar-team-item">
                  <div className="project-sidebar-team-name">{team.name}</div>
                  <div className="project-sidebar-team-meta">
                    {owner ? `${owner.name} / ` : ''}
                    {memberCount}名
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}
