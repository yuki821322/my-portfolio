import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { Task } from '../types/Task'
import './AnalyticsView.css'

type Props = {
  tasks: Task[]
}

function formatHours(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) {
    return `${h}h ${m}m`
  }
  return `${m}m`
}

export function AnalyticsView({ tasks }: Props) {
  // 過去7日間の日別作業時間
  const dailyData = useMemo(() => {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dayStart = startOfDay(date)
      const dayEnd = endOfDay(date)

      // その日に更新されたタスクの合計時間（簡易実装）
      // 実際にはセッションごとの記録が必要だが、ここではupdatedAtで近似
      const dayTasks = tasks.filter(task => {
        const updated = new Date(task.updatedAt)
        return updated >= dayStart && updated <= dayEnd && task.totalTime > 0
      })

      const totalSeconds = dayTasks.reduce((sum, task) => sum + task.totalTime, 0)

      data.push({
        date: format(date, 'M/d', { locale: ja }),
        day: format(date, 'E', { locale: ja }),
        minutes: Math.round(totalSeconds / 60),
        hours: totalSeconds / 3600,
      })
    }
    return data
  }, [tasks])

  // ステータス別タスク数
  const statusData = useMemo(() => {
    const todo = tasks.filter(t => t.status === 'todo').length
    const doing = tasks.filter(t => t.status === 'doing').length
    const done = tasks.filter(t => t.status === 'done').length

    return [
      { name: '未着手', value: todo, color: '#64748b' },
      { name: '進行中', value: doing, color: '#f59e0b' },
      { name: '完了', value: done, color: '#10b981' },
    ].filter(d => d.value > 0)
  }, [tasks])

  // 合計統計
  const stats = useMemo(() => {
    const totalTime = tasks.reduce((sum, t) => sum + t.totalTime, 0)
    const completedTasks = tasks.filter(t => t.status === 'done').length
    const focusTasks = tasks.filter(t => t.isFocus).length

    return {
      totalTime,
      totalTasks: tasks.length,
      completedTasks,
      focusTasks,
    }
  }, [tasks])

  return (
    <div className="analytics-view">
      <div className="analytics-stats">
        <div className="analytics-stat-card">
          <span className="analytics-stat-value">{formatHours(stats.totalTime)}</span>
          <span className="analytics-stat-label">総作業時間</span>
        </div>
        <div className="analytics-stat-card">
          <span className="analytics-stat-value">{stats.completedTasks}</span>
          <span className="analytics-stat-label">完了タスク</span>
        </div>
        <div className="analytics-stat-card">
          <span className="analytics-stat-value">{stats.totalTasks}</span>
          <span className="analytics-stat-label">総タスク数</span>
        </div>
        <div className="analytics-stat-card">
          <span className="analytics-stat-value">{stats.focusTasks}</span>
          <span className="analytics-stat-label">フォーカス中</span>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="analytics-chart-card">
          <h3 className="analytics-chart-title">週間作業時間</h3>
          <div className="analytics-chart">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(v) => `${v}m`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                  formatter={(value) => [`${value}分`, '作業時間']}
                />
                <Bar dataKey="minutes" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-chart-card">
          <h3 className="analytics-chart-title">タスク状況</h3>
          <div className="analytics-chart">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-chart-empty">タスクがありません</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
