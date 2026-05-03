import { getSessionAction } from '@/actions/auth.actions'
import { getUserNotificationsAction } from '@/actions/notification'
import ErrorBoundary from '@/components/ErrorBoundary'
import ErrorFallback from '@/components/ErrorFallback'
import ProfileUserInfo from '@/components/module/user/ProfileCardContent'
import { IBaseUser } from '@/types/user.types'
import React from 'react'

const ProfilePage = async() => {
  const notification=await getUserNotificationsAction()
    const userinfo=await getSessionAction()
  if (!userinfo || !userinfo.data || !userinfo.success) {
    return (
      <ErrorFallback
        title="Authentication Error"
        message="You must be signed in to view your profile."
      />
    );
  }
  return (
    <div>
        <ErrorBoundary fallback={<ErrorFallback title="Profile load failed" message="Something went wrong while loading your profile." />}>
          <ProfileUserInfo user={userinfo.data as IBaseUser}/>
        </ErrorBoundary>
    </div>
  )
}

export default ProfilePage