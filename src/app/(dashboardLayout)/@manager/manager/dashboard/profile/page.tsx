import { getSessionAction } from '@/actions/auth.actions'
import ErrorBoundary from '@/components/ErrorBoundary'
import ErrorFallback from '@/components/ErrorFallback'
import { IBaseUser } from '@/types/user.types'
import ProfileUserInfo from '@/components/module/user/ProfileCardContent'
import React from 'react'
import { getUserNotificationsAction } from '@/actions/notification'

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
      <React.Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary fallback={
            <ErrorFallback
              title="Profile Error"
              message="Sorry, there was a problem loading your profile. Please try again later."
              key="profile-error"
            />
          }
        >
            <div>
            <ProfileUserInfo user={userinfo.data as IBaseUser} notification={notification.data}/>
            </div>
          {/* Your profile page content goes here */}
        </ErrorBoundary>
      </React.Suspense>
    </div>
  )
}

export default ProfilePage