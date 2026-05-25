export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center py-20 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-purple-500/20"></div>
        <div className="absolute inset-0 rounded-full border-t-2 border-purple-400 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-t-2 border-gold-400 animate-spin" style={{animationDirection:'reverse',animationDuration:'0.8s'}}></div>
      </div>
      <p className="text-white/40 text-sm animate-pulse">Đang tải...</p>
    </div>
  )
}
