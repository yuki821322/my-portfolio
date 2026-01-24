function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Task<span className="text-emerald-400">Board</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
          <span className="text-slate-400">集中力を可視化するタスク管理</span>
        </p>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/30">
          はじめる
        </button>
      </div>
    </div>
  )
}

export default App
