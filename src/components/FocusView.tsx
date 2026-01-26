import { useState, useEffect, useRef } from 'react'
import type { Task } from '../types/Task'
import './FocusView.css'

type Props = {
  tasks: Task[]
  onUpdateTask: (task: Task) => void
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function FocusView({ tasks, onUpdateTask }: Props) {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const intervalRef = useRef<number | null>(null)

  const focusTasks = tasks.filter(task => task.isFocus && task.status !== 'done')
  const activeTask = tasks.find(task => task.id === activeTaskId)

  // タイマー稼働中の経過時間更新
  useEffect(() => {
    if (activeTask?.startedAt) {
      // 既にタイマーが動いている場合、経過時間を計算
      const startTime = new Date(activeTask.startedAt).getTime()
      const now = Date.now()
      const elapsed = Math.floor((now - startTime) / 1000)
      setElapsedTime(activeTask.totalTime + elapsed)

      intervalRef.current = window.setInterval(() => {
        const currentElapsed = Math.floor((Date.now() - startTime) / 1000)
        setElapsedTime(activeTask.totalTime + currentElapsed)
      }, 1000)
    } else if (activeTask) {
      setElapsedTime(activeTask.totalTime)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [activeTaskId, activeTask?.startedAt, activeTask?.totalTime])

  // ページを離れるときにタイマーを保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (activeTask?.startedAt) {
        const startTime = new Date(activeTask.startedAt).getTime()
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        onUpdateTask({
          ...activeTask,
          totalTime: activeTask.totalTime + elapsed,
          startedAt: null,
        })
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [activeTask, onUpdateTask])

  const handleStart = (task: Task) => {
    // 他のタスクが実行中なら停止
    if (activeTask?.startedAt && activeTask.id !== task.id) {
      handleStop()
    }

    setActiveTaskId(task.id)
    onUpdateTask({
      ...task,
      status: 'doing',
      startedAt: new Date().toISOString(),
    })
  }

  const handleStop = () => {
    if (!activeTask?.startedAt) return

    const startTime = new Date(activeTask.startedAt).getTime()
    const elapsed = Math.floor((Date.now() - startTime) / 1000)

    onUpdateTask({
      ...activeTask,
      totalTime: activeTask.totalTime + elapsed,
      startedAt: null,
    })

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleComplete = () => {
    if (!activeTask) return

    // タイマーが動いていたら停止して保存
    let finalTotalTime = activeTask.totalTime
    if (activeTask.startedAt) {
      const startTime = new Date(activeTask.startedAt).getTime()
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      finalTotalTime += elapsed
    }

    onUpdateTask({
      ...activeTask,
      status: 'done',
      totalTime: finalTotalTime,
      startedAt: null,
      isFocus: false,
    })

    setActiveTaskId(null)
    setElapsedTime(0)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const isRunning = activeTask?.startedAt !== null && activeTask?.startedAt !== undefined

  return (
    <div className="focus-view">
      {focusTasks.length === 0 ? (
        <div className="focus-view-empty">
          <p className="focus-view-empty-text">フォーカスするタスクがありません</p>
          <p className="focus-view-empty-hint">カンバンでタスクの◎をクリックして追加</p>
        </div>
      ) : (
        <>
          <div className="focus-task-list">
            {focusTasks.map(task => (
              <button
                key={task.id}
                className={`focus-task-item ${activeTaskId === task.id ? 'active' : ''}`}
                onClick={() => setActiveTaskId(task.id)}
              >
                <span className="focus-task-title">{task.title}</span>
                <span className="focus-task-time">{formatTime(task.totalTime)}</span>
              </button>
            ))}
          </div>

          {activeTask && (
            <div className="focus-timer">
              <h2 className="focus-timer-title">{activeTask.title}</h2>
              <div className="focus-timer-display">{formatTime(elapsedTime)}</div>
              <div className="focus-timer-actions">
                {isRunning ? (
                  <button className="focus-button stop" onClick={handleStop}>
                    停止
                  </button>
                ) : (
                  <button className="focus-button start" onClick={() => handleStart(activeTask)}>
                    開始
                  </button>
                )}
                <button className="focus-button complete" onClick={handleComplete}>
                  完了
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
