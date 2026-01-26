import { useState, useMemo } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns'
import { ja } from 'date-fns/locale'
import type { Task } from '../types/Task'
import './CalendarView.css'

type Props = {
  tasks: Task[]
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) {
    return `${h}h${m}m`
  }
  return `${m}m`
}

export function CalendarView({ tasks }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

    const daysArray = []
    let day = startDate

    while (day <= endDate) {
      daysArray.push(day)
      day = addDays(day, 1)
    }

    return daysArray
  }, [currentMonth])

  const getTasksForDay = (date: Date): Task[] => {
    return tasks.filter(task => {
      const taskDate = new Date(task.updatedAt)
      return isSameDay(taskDate, date)
    })
  }

  const getTotalTimeForDay = (date: Date): number => {
    const dayTasks = getTasksForDay(date)
    return dayTasks.reduce((sum, task) => sum + task.totalTime, 0)
  }

  const selectedDayTasks = selectedDate ? getTasksForDay(selectedDate) : []

  return (
    <div className="calendar-view">
      <div className="calendar-container">
        <div className="calendar-header">
          <button
            className="calendar-nav-button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            ←
          </button>
          <h2 className="calendar-title">
            {format(currentMonth, 'yyyy年 M月', { locale: ja })}
          </h2>
          <button
            className="calendar-nav-button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            →
          </button>
        </div>

        <div className="calendar-weekdays">
          {['日', '月', '火', '水', '木', '金', '土'].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {days.map((day, index) => {
            const totalTime = getTotalTimeForDay(day)
            const hasTime = totalTime > 0
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <button
                key={index}
                className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday(day) ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasTime ? 'has-time' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <span className="calendar-day-number">{format(day, 'd')}</span>
                {hasTime && (
                  <span className="calendar-day-time">{formatTime(totalTime)}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="calendar-detail">
          <h3 className="calendar-detail-title">
            {format(selectedDate, 'M月d日 (E)', { locale: ja })}
          </h3>
          {selectedDayTasks.length === 0 ? (
            <p className="calendar-detail-empty">この日のタスクはありません</p>
          ) : (
            <ul className="calendar-detail-tasks">
              {selectedDayTasks.map(task => (
                <li key={task.id} className="calendar-detail-task">
                  <span className={`calendar-detail-status ${task.status}`}></span>
                  <span className="calendar-detail-task-title">{task.title}</span>
                  {task.totalTime > 0 && (
                    <span className="calendar-detail-task-time">
                      {formatTime(task.totalTime)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
