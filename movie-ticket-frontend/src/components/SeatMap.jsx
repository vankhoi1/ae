import { useMemo } from 'react'

export default function SeatMap({ seats, selectedSeats, onToggle }) {
  const { rows, cols } = useMemo(() => {
    const rows = [...new Set(seats.map(s => s.seatRow))].sort()
    const cols = seats.length > 0 ? Math.max(...seats.map(s => s.seatNumber)) : 0
    return { rows, cols }
  }, [seats])

  if (seats.length === 0) return (
    <div className="text-center py-12 text-white/30">Không có dữ liệu sơ đồ ghế</div>
  )

  return (
    <div className="overflow-x-auto">
      {/* Screen */}
      <div className="relative mb-8 mx-auto w-3/4 max-w-sm">
        <div className="h-1.5 rounded-full bg-gradient-to-r from-purple-500/20 via-purple-400 to-purple-500/20 shadow-neon" />
        <p className="text-center text-xs text-white/30 mt-2 tracking-widest uppercase">Màn hình</p>
      </div>

      <table className="mx-auto" role="grid" aria-label="Sơ đồ ghế">
        <thead>
          <tr>
            <th className="w-8" />
            {Array.from({ length: cols }, (_, i) => (
              <th key={i+1} className="text-xs text-white/20 font-normal w-9 pb-2">{i+1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const rowSeats = seats.filter(s => s.seatRow === row).sort((a,b) => a.seatNumber - b.seatNumber)
            return (
              <tr key={row}>
                <td className="pr-3 text-sm font-bold text-white/30 text-right w-8">{row}</td>
                {rowSeats.map(seat => {
                  const isSelected = selectedSeats.includes(seat.id)
                  const isOccupied = seat.occupied
                  let cls = 'w-8 h-8 rounded-t-lg text-xs font-semibold transition-all duration-150 '
                  if (isOccupied) cls += 'seat-booked'
                  else if (isSelected) cls += 'seat-selected'
                  else if (seat.type === 'VIP') cls += 'seat-vip'
                  else cls += 'seat-standard'

                  return (
                    <td key={seat.id} className="p-0.5">
                      <button disabled={isOccupied} onClick={() => onToggle(seat)}
                        title={isOccupied ? `Ghế ${row}${seat.seatNumber} - Đã đặt` : `Ghế ${row}${seat.seatNumber} - ${seat.type === 'VIP' ? 'VIP' : 'Thường'}`}
                        aria-label={`Ghế ${row}${seat.seatNumber}`}
                        className={cls}>
                        {seat.seatNumber}
                      </button>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex justify-center flex-wrap gap-4 mt-6 text-xs text-white/50">
        <span className="flex items-center gap-1.5"><span className="w-4 h-4 seat-standard rounded inline-block" /> Thường</span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-4 seat-vip rounded inline-block" /> VIP</span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-4 seat-selected rounded inline-block" /> Đã chọn</span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-4 seat-booked rounded inline-block" /> Đã đặt</span>
      </div>
    </div>
  )
}
