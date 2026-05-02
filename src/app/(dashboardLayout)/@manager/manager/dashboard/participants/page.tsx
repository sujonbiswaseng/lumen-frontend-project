import { getSessionAction } from '@/actions/auth.actions';
import { getParticipants } from '@/actions/participant.actions';
import ErrorBoundary from '@/components/ErrorBoundary';
import ParticipantContent from '@/components/module/participant/ParticipantContent';
import { IBaseEvent, TPagination } from '@/types/event.types';
import { TResponseParticipant } from '@/types/participant.types';
import { IBaseUser } from '@/types/user.types';
import next from 'next';
import React from 'react'

const ParticipantPage = async({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {

  const userinfo = await getSessionAction();
  const role=userinfo.data?.role
  const search=await searchParams
 
  const participants= await getParticipants(search);
  return (
    <div>
      <React.Suspense fallback={<div>Loading participants...</div>}>
        <ErrorBoundary fallback={<div>Something went wrong loading participants.</div>}>
          <ParticipantContent
            pagination={participants.pagination as TPagination}
            participants={participants.data as TResponseParticipant<{ user: IBaseUser[]; event: IBaseEvent[] }>[] || []} 
            role={role as string}
          />
        </ErrorBoundary>
      </React.Suspense>
    </div>
  )
}

export default ParticipantPage