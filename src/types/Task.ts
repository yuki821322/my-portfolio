export type TaskStatus = 'todo' | 'doing' | 'done'

// ユーザー
export type User = {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

// チーム
export type Team = {
  id: string
  name: string
  ownerId: string
  memberIds: string[]
  createdAt: string
}

// プロジェクト
export type Project = {
  id: string
  name: string
  color: string
  isTeam: boolean
  teamId: string | null
  ownerId: string
  createdAt: string
}

// コメント
export type Comment = {
  id: string
  taskId: string
  userId: string
  content: string
  createdAt: string
}

// アクティビティ
export type ActivityType = 'created' | 'status_changed' | 'assigned' | 'commented' | 'completed'

export type Activity = {
  id: string
  taskId: string
  userId: string
  type: ActivityType
  details: string
  createdAt: string
}

// タスク
export type Task = {
  id: string
  title: string
  description?: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
  // フォーカス・タイマー関連
  isFocus: boolean
  totalTime: number // 秒単位
  startedAt: string | null // タイマー開始時刻（ISO文字列）
  // プロジェクト関連
  projectId: string | null // null = 個人タスク
  // チーム関連
  assignedTo: string[] // 担当者ID配列
  createdBy: string // 作成者ID
}
