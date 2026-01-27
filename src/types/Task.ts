export type TaskStatus = 'todo' | 'doing' | 'done'

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
}

export type Project = {
  id: string
  name: string
  color: string
  isTeam: boolean
  createdAt: string
}
