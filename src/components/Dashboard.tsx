import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Task, Project, Team, User, Comment, Activity } from '../types/Task'
import { KanbanBoard } from './KanbanBoard'
import { ListView } from './ListView'
import { FocusView } from './FocusView'
import { AnalyticsView } from './AnalyticsView'
import { CalendarView } from './CalendarView'
import { AddTaskModal } from './AddTaskModal'
import { ProjectSidebar } from './ProjectSidebar'
import { ProjectModal } from './ProjectModal'
import { TeamModal } from './TeamModal'
import { TaskDetailPanel } from './TaskDetailPanel'
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
  const [projects, setProjects] = useState<Project[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [activities, setActivities] = useState<Activity[]>([])

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null | 'all'>('all')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  // 初回読み込み
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]') as Task[]
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]') as Project[]
    const savedTeams = JSON.parse(localStorage.getItem('teams') || '[]') as Team[]
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[]
    const savedComments = JSON.parse(localStorage.getItem('comments') || '[]') as Comment[]
    const savedActivities = JSON.parse(localStorage.getItem('activities') || '[]') as Activity[]

    const normalizedUsers = currentUser && !savedUsers.some((u) => u.id === currentUser.id)
      ? [...savedUsers, currentUser]
      : savedUsers

    const normalizedTasks = savedTasks.map((task) => ({
      ...task,
      projectId: task.projectId ?? null,
      assignedTo: task.assignedTo ?? [],
      createdBy: task.createdBy ?? currentUser?.id ?? '',
      isFocus: task.isFocus ?? false,
      totalTime: task.totalTime ?? 0,
      startedAt: task.startedAt ?? null,
    }))

    setTasks(normalizedTasks)
    setProjects(savedProjects)
    setTeams(savedTeams)
    setUsers(normalizedUsers)
    setComments(savedComments)
    setActivities(savedActivities)

    const savedProjectId = localStorage.getItem('selectedProjectId')
    if (savedProjectId) {
      setSelectedProjectId(savedProjectId === 'null' ? null : savedProjectId)
    }
  }, [currentUser])

  // 変更時に保存
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams))
  }, [teams])

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments))
  }, [comments])

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities))
  }, [activities])

  useEffect(() => {
    if (selectedProjectId === null) {
      localStorage.setItem('selectedProjectId', 'null')
    } else {
      localStorage.setItem('selectedProjectId', selectedProjectId)
    }
  }, [selectedProjectId])

  // 別タブ同期（storageイベント）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tasks' && e.newValue) setTasks(JSON.parse(e.newValue))
      if (e.key === 'projects' && e.newValue) setProjects(JSON.parse(e.newValue))
      if (e.key === 'teams' && e.newValue) setTeams(JSON.parse(e.newValue))
      if (e.key === 'users' && e.newValue) setUsers(JSON.parse(e.newValue))
      if (e.key === 'comments' && e.newValue) setComments(JSON.parse(e.newValue))
      if (e.key === 'activities' && e.newValue) setActivities(JSON.parse(e.newValue))
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // アクティビティ追加
  const addActivity = useCallback((taskId: string, type: Activity['type'], details: string) => {
    if (!currentUser) return
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      taskId,
      userId: currentUser.id,
      type,
      details,
      createdAt: new Date().toISOString(),
    }
    setActivities(prev => [...prev, newActivity])
  }, [currentUser])

  // タスク操作
  const handleAddTask = useCallback((
    title: string,
    description: string,
    projectId: string | null = null,
    assignedTo: string[] = []
  ) => {
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
      assignedTo,
      createdBy: currentUser?.id ?? '',
    }
    setTasks(prev => [...prev, newTask])
    addActivity(newTask.id, 'created', `タスク「${title}」を作成しました`)
  }, [currentUser, addActivity])

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks(prev => {
      const oldTask = prev.find(t => t.id === updatedTask.id)
      if (oldTask && oldTask.status !== updatedTask.status) {
        const statusLabel = updatedTask.status === 'todo'
          ? '未着手'
          : updatedTask.status === 'doing'
            ? '進行中'
            : '完了'
        addActivity(
          updatedTask.id,
          updatedTask.status === 'done' ? 'completed' : 'status_changed',
          `ステータスを「${statusLabel}」に変更しました`
        )
      }
      if (oldTask && oldTask.assignedTo.join(',') !== updatedTask.assignedTo.join(',')) {
        addActivity(updatedTask.id, 'assigned', '担当者を更新しました')
      }
      return prev.map(task =>
        task.id === updatedTask.id
          ? { ...updatedTask, updatedAt: new Date().toISOString() }
          : task
      )
    })
  }, [addActivity])

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    setComments(prev => prev.filter(c => c.taskId !== taskId))
    setActivities(prev => prev.filter(a => a.taskId !== taskId))
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null)
    }
  }, [selectedTaskId])

  // プロジェクト操作
  const handleAddProject = useCallback((project: Project) => {
    if (!currentUser) return
    setProjects(prev => [...prev, { ...project, ownerId: currentUser.id }])
  }, [currentUser])

  // チーム操作
  const handleAddTeam = useCallback((name: string) => {
    if (!currentUser) return
    const newTeam: Team = {
      id: crypto.randomUUID(),
      name,
      ownerId: currentUser.id,
      memberIds: [currentUser.id],
      createdAt: new Date().toISOString(),
    }
    setTeams(prev => [...prev, newTeam])
  }, [currentUser])

  const handleAddMember = useCallback((teamId: string, email: string): boolean => {
    const user = users.find(u => u.email === email)
    if (!user) return false

    setTeams(prev => prev.map(team =>
      team.id === teamId && !team.memberIds.includes(user.id)
        ? { ...team, memberIds: [...team.memberIds, user.id] }
        : team
    ))
    return true
  }, [users])

  const handleRemoveMember = useCallback((teamId: string, userId: string) => {
    setTeams(prev => prev.map(team =>
      team.id === teamId
        ? { ...team, memberIds: team.memberIds.filter(id => id !== userId) }
        : team
    ))
  }, [])

  const handleDeleteTeam = useCallback((teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId))
    setProjects(prev => prev.filter(p => p.teamId !== teamId))
  }, [])

  // コメント操作
  const handleAddComment = useCallback((taskId: string, content: string) => {
    if (!currentUser) return
    const newComment: Comment = {
      id: crypto.randomUUID(),
      taskId,
      userId: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
    }
    setComments(prev => [...prev, newComment])
    addActivity(taskId, 'commented', `コメントを追加しました`)
  }, [currentUser, addActivity])

  // フィルタリング
  const filteredTasks = useMemo(() => {
    if (selectedProjectId === 'all') return tasks
    if (selectedProjectId === null) {
      return tasks.filter(t => t.projectId === null)
    }
    return tasks.filter(t => t.projectId === selectedProjectId)
  }, [tasks, selectedProjectId])

  const selectedTask = useMemo(() => (
    tasks.find(t => t.id === selectedTaskId) ?? null
  ), [tasks, selectedTaskId])

  const taskComments = comments.filter(c => c.taskId === selectedTaskId)
  const taskActivities = activities.filter(a => a.taskId === selectedTaskId)

  // 選択中プロジェクトのチームメンバー
  const selectedProject = projects.find(p => p.id === selectedProjectId)
  const availableAssignees = selectedProject?.teamId
    ? users.filter(u => teams.find(t => t.id === selectedProject.teamId)?.memberIds?.includes(u.id))
    : users

  const projectStats = useMemo(() => {
    const buildStats = (list: Task[]) => ({
      total: list.length,
      todo: list.filter(t => t.status === 'todo').length,
      doing: list.filter(t => t.status === 'doing').length,
      done: list.filter(t => t.status === 'done').length,
    })

    const stats: Record<string, { total: number; todo: number; doing: number; done: number }> = {
      all: buildStats(tasks),
      personal: buildStats(tasks.filter(t => t.projectId === null)),
    }

    projects.forEach((project) => {
      stats[project.id] = buildStats(tasks.filter(t => t.projectId === project.id))
    })

    return stats
  }, [projects, tasks])

  const activeStats = useMemo(() => {
    if (selectedProjectId === 'all') return projectStats.all
    if (selectedProjectId === null) return projectStats.personal
    return projectStats[selectedProjectId] ?? { total: 0, todo: 0, doing: 0, done: 0 }
  }, [projectStats, selectedProjectId])

  const renderView = () => {
    const props = {
      tasks: filteredTasks,
      onUpdateTask: handleUpdateTask,
      onDeleteTask: handleDeleteTask,
      onSelectTask: setSelectedTaskId,
      users,
    }

    switch (viewMode) {
      case 'kanban':
        return <KanbanBoard {...props} />
      case 'list':
        return <ListView {...props} />
      case 'focus':
        return <FocusView tasks={filteredTasks} onUpdateTask={handleUpdateTask} />
      case 'analytics':
        return <AnalyticsView tasks={filteredTasks} />
      case 'calendar':
        return <CalendarView tasks={filteredTasks} />
    }
  }

  const showAddButton = viewMode === 'kanban' || viewMode === 'list'

  return (
    <div className="dashboard-layout">
      <ProjectSidebar
        projects={projects}
        teams={teams}
        users={users}
        currentUser={currentUser}
        selectedProjectId={selectedProjectId}
        projectStats={projectStats}
        onSelectProject={setSelectedProjectId}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        onOpenTeamModal={() => setIsTeamModalOpen(true)}
      />

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
            <button className="add-task-button" onClick={() => setIsTaskModalOpen(true)}>
              + タスク追加
            </button>
          )}
        </div>

        <div className="dashboard-status">
          <div className="dashboard-status-card">
            <span className="dashboard-status-value">{activeStats.todo}</span>
            <span className="dashboard-status-label">未着手</span>
          </div>
          <div className="dashboard-status-card">
            <span className="dashboard-status-value">{activeStats.doing}</span>
            <span className="dashboard-status-label">進行中</span>
          </div>
          <div className="dashboard-status-card">
            <span className="dashboard-status-value">{activeStats.done}</span>
            <span className="dashboard-status-label">完了</span>
          </div>
          <div className="dashboard-status-card">
            <span className="dashboard-status-value">{activeStats.total}</span>
            <span className="dashboard-status-label">合計</span>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-main">
            {renderView()}
          </div>

          {selectedTask && (
            <TaskDetailPanel
              task={selectedTask}
              comments={taskComments}
              activities={taskActivities}
              users={users}
              onAddComment={(content) => handleAddComment(selectedTask.id, content)}
              onClose={() => setSelectedTaskId(null)}
            />
          )}
        </div>
      </div>

      {isTaskModalOpen && (
        <AddTaskModal
          projects={projects}
          selectedProjectId={selectedProjectId === 'all' ? null : selectedProjectId}
          availableAssignees={availableAssignees}
          currentUser={currentUser}
          onAdd={handleAddTask}
          onClose={() => setIsTaskModalOpen(false)}
        />
      )}

      {isProjectModalOpen && (
        <ProjectModal
          teams={teams}
          currentUser={currentUser}
          onCreate={handleAddProject}
          onClose={() => setIsProjectModalOpen(false)}
        />
      )}

      {isTeamModalOpen && currentUser && (
        <TeamModal
          teams={teams}
          users={users}
          currentUser={currentUser}
          onAddTeam={handleAddTeam}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onDeleteTeam={handleDeleteTeam}
          onClose={() => setIsTeamModalOpen(false)}
        />
      )}
    </div>
  )
}
