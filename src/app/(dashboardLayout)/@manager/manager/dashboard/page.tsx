import { getSessionAction } from '@/actions/auth.actions'
import { getStatsAction } from '@/actions/stats.actions'
import DashboardContent from '@/components/dashbaord/DashboardContent'
import ErrorBoundary from '@/components/ErrorBoundary'
import { DashboardData } from '@/types/stats.types'
import React from 'react'

const Page = async () => {
  const statsData = await getStatsAction()
  const userinfo = await getSessionAction()
  const role = userinfo.data?.role

  return (
    <ErrorBoundary fallback={<div className="text-red-600">An error occurred while loading the admin dashboard. Please refresh the page or try again later.</div>}>
      {statsData ? (
        <div className='scroll-m-0'>
          <DashboardContent
            role={role as string}
            eventVisivility={statsData.EventVisivillity}
            stats={statsData.data as DashboardData}
          />
        </div>
      ) : (
        <div className="text-red-600">Failed to load dashboard data. Please try again later.</div>
      )}
    </ErrorBoundary>
  )
}

export default Page
