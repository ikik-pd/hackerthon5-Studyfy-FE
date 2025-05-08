import Avatar from 'react-avatar'

interface ParticipantListProps {
  participants: any[]
}

export function ParticipantList({ participants }: ParticipantListProps) {
  if (!participants?.length) return null
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">참여자 목록</h3>
      <div className="flex flex-wrap gap-2">
        {participants.map((p, i) => (
          <div key={i} className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-1.5">
            <Avatar
              name={p.nickname}
              size="24"
              round={true}
              className="border border-zinc-200 dark:border-zinc-700"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">{p.nickname}</span>
          </div>
        ))}
      </div>
    </div>
  )
} 