
import { getSessionAction } from '@/actions/auth.actions'
import { ChangePasswordForm } from '@/components/auth/ChangePassword'
import { NavbarNotifications } from '@/components/module/notification/Notification'
import ProfileModal from '@/components/module/user/ProfileCardContent'
import { IBaseUser } from '@/types/user.types'
import React from 'react'

const SettingPage = async () => {
  const userinfo = await getSessionAction();
  return (
    <div className='py-10'>
      <div className='mb-4'>
        <ProfileModal notification={<NavbarNotifications />} user={userinfo.data as IBaseUser} />
      </div>
      <div>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default SettingPage
