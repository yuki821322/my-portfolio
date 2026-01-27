import { useState } from 'react'
import type { Activity, Comment, Task, User } from '../types/Task'
import { UserAvatar } from './UserAvatar'
import './TaskDetailPanel.css'

type Props = {
  task: Task
  users: User[]
  comments: Comment[]
  activities: Activity[]
  onAddComment: (content: string) => void
  onClose: () => void
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TaskDetailPanel({
  task,
  users,
  comments,
  activities,
  onAddComment,
  onClose,
}: Props) {
  const [comment, setComment] = useState('')

  const sortedComments = [...comments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    onAddComment(comment.trim())
    setComment('')
  }

  const assignees = users.filter((user) => task.assignedTo.includes(user.id))

  return (
    <aside className="task-detail-panel">
      <div className="task-detail-header">
        <div>
          <div className="task-detail-title">{task.title}</div>
          <div className="task-detail-meta">
            更新: {formatDate(task.updatedAt)}
          </div>
        </div>
        <button className="task-detail-close" onClick={onClose}>×</button>
      </div>

      {task.description && (
        <div className="task-detail-section">
          <div className="task-detail-section-title">説明</div>
          <p className="task-detail-description">{task.description}</p>
        </div>
      )}

      <div className="task-detail-section">
        <div className="task-detail-section-title">担当者</div>
        {assignees.length === 0 ? (
          <div className="task-detail-empty">担当者が設定されていません</div>
        ) : (
          <div className="task-detail-assignees">
            {assignees.map((user) => (
              <div key={user.id} className="task-detail-assignee">
                <UserAvatar user={user} size="sm" />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="task-detail-section">
        <div className="task-detail-section-title">コメント</div>
        {sortedComments.length === 0 ? (
          <div className="task-detail-empty">コメントはまだありません</div>
        ) : (
          <div className="task-detail-comments">
            {sortedComments.map((item) => {
              const user = users.find((u) => u.id === item.userId)
              return (
                <div key={item.id} className="task-detail-comment">
                  {user && <UserAvatar user={user} size="sm" />}
                  <div>
                    <div className="task-detail-comment-header">
                      <span className="task-detail-comment-user">{user?.name ?? 'Unknown'}</span>
                      <span className="task-detail-comment-date">{formatDate(item.createdAt)}</span>
                    </div>
                    <div className="task-detail-comment-content">{item.content}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <form onSubmit={handleSubmit} className="task-detail-comment-form">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="task-detail-textarea"
            placeholder="コメントを追加"
            rows={3}
          />
          <button type="submit" className="task-detail-comment-submit" disabled={!comment.trim()}>
            送信
          </button>
        </form>
      </div>

      <div className="task-detail-section">
        <div className="task-detail-section-title">履歴</div>
        {sortedActivities.length === 0 ? (
          <div className="task-detail-empty">履歴はありません</div>
        ) : (
          <div className="task-detail-activities">
            {sortedActivities.map((activity) => {
              const user = users.find((u) => u.id === activity.userId)
              return (
                <div key={activity.id} className="task-detail-activity">
                  <div className="task-detail-activity-title">
                    <span>{user?.name ?? 'Unknown'}</span>
                    <span className="task-detail-activity-date">{formatDate(activity.createdAt)}</span>
                  </div>
                  <div className="task-detail-activity-detail">{activity.details}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}
