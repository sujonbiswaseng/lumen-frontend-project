'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'
import { PublicStats } from '@/types/stats.types'

interface StaticsProps {
  stats: PublicStats
}

const statItems = [
  { key: 'totalUsers', label: 'Users' },
  { key: 'totalManagers', label: 'Managers' },
  { key: 'totalAdmins', label: 'Admins' },
  { key: 'totalParticipants', label: 'Participants' },
  { key: 'totalEvents', label: 'Events' },
  { key: 'totalReviews', label: 'Reviews' },
  { key: 'totalNewsletters', label: 'Newsletters' },
]

const cardAnimation = {
  initial: { opacity: 0, y: 40, scale: 0.96 },
  animate: (custom: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.07 * custom,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const Statics: FC<StaticsProps> = ({ stats }) => (
  <section className="w-full bg-background">
    <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-8 py-8 md:py-12 flex flex-col items-center">
      {/* Title & Description */}
      <div className="w-full flex flex-col items-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight text-center mb-2">
          Platform Public Statistics
        </h2>
        <p className="max-w-xl text-base text-muted-foreground text-center font-medium">
          Up-to-date usage and engagement stats from our amazing community. All stats update live and reflect platform-wide activity.
        </p>
      </div>
      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.7 }}
      >
        {statItems.map((item, idx) => (
          <motion.div
            key={item.key}
            custom={idx}
            initial="initial"
            animate="animate"
            whileInView="animate"
            viewport={{ once: true, amount: 0.7 }}
            className="flex flex-col items-center justify-center bg-card border border-border rounded-xl shadow-sm p-6 md:p-8 min-h-[120px] transition-all duration-300"
            whileHover={{
              scale: 1.025,
              boxShadow: '0px 8px 32px -8px var(--border)',
              transition: { type: 'spring', stiffness: 260, damping: 18 },
            }}
          >
            <span className="text-3xl md:text-4xl font-extrabold text-card-foreground mb-1 select-none">
              {stats?.[item.key as keyof PublicStats]?.toLocaleString?.() ?? 0}
            </span>
            <span className="text-lg md:text-xl text-muted-foreground font-semibold tracking-wide select-none">
              {item.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
)

export default Statics