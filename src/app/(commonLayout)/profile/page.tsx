import ErrorBoundary from '@/components/ErrorBoundary'
import React from 'react'

const ProfilePage = () => {
  return (
    <ErrorBoundary fallback={<div>Unable to load profile.</div>}>
      <div className='mt-20'>ProfilePage</div>
    </ErrorBoundary>
  )
}

export default ProfilePage