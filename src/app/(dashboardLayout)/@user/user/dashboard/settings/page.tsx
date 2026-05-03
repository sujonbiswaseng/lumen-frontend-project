import { getSessionAction } from '@/actions/auth.actions'
import { ChangePasswordForm } from '@/components/auth/ChangePassword'
import ErrorBoundary from '@/components/ErrorBoundary'
import ErrorFallback from '@/components/ErrorFallback'
import { NavbarNotifications } from '@/components/module/notification/Notification'
import ProfileModal from '@/components/module/user/ProfileCardContent'
import { IBaseUser } from '@/types/user.types'
const SettingPage = async() => {
  const userinfo=await getSessionAction()
  return (
    <div>
      <ErrorBoundary fallback={<ErrorFallback title="Password Change Error" message="Something went wrong while attempting to change your password." />}>
      <div className='py-10'>
      <div className='mb-4'>
      <ProfileModal user={userinfo.data as IBaseUser}/>
      </div>
      <div>
      <ChangePasswordForm/>


      </div>
    </div>
      </ErrorBoundary>
    </div>
  )
}

export default SettingPage