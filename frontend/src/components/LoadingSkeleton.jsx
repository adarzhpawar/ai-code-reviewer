import { motion } from 'framer-motion'

export function ReviewSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse bg-surface-light h-full">
      <div className="h-16 bg-surface-lighter border border-border rounded-lg" />
      <div className="h-20 bg-surface-lighter border border-border rounded-lg" />
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-14 bg-surface-lighter border border-border rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function ChatSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse bg-surface-light h-full">
      {[1, 2, 3].map(i => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <div className={`${i % 2 === 0 ? 'w-3/4' : 'w-1/2'} h-12 bg-surface-lighter border border-border rounded-lg`} />
        </div>
      ))}
    </div>
  )
}

export function LearningSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse bg-surface-light h-full">
      <div className="h-8 w-40 bg-surface-lighter border border-border rounded-lg" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-surface-lighter border border-border rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export default function LoadingSkeleton({ type = 'review' }) {
  const Component = {
    review: ReviewSkeleton,
    chat: ChatSkeleton,
    learning: LearningSkeleton,
  }[type]

  if (!Component) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Component />
    </motion.div>
  )
}
