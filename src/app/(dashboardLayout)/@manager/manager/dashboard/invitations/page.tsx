import { getSessionAction } from '@/actions/auth.actions';
import { GetAllinvitaionsAction } from '@/actions/invitation.actions';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';
import GetInvitations from '@/components/module/invitation/GetOwnInvitations';
import { TPagination } from '@/types/event.types';
import { IBaseUser } from '@/types/user.types';
import React from 'react'

const InvitationsPage = async({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const userinfo=await getSessionAction()
  const search=await searchParams
  const invitationsPromise =await GetAllinvitaionsAction(search);
  const invitationdata=invitationsPromise.data?.invitations
  const pagination=invitationsPromise.data?.pagination as TPagination
  if (!invitationdata || !Array.isArray(invitationdata)) {
    throw new Error("No invitation data found or invalid data format.");
  }
  return (
    <div>
      <ErrorBoundary fallback={<ErrorFallback title="invitation load failed" message="Something went wrong while loading your invitations." />}>
        <GetInvitations invitations={invitationdata} pagination={pagination} user={userinfo.data as IBaseUser} />
      </ErrorBoundary>
    </div>
  )
}

export default InvitationsPage