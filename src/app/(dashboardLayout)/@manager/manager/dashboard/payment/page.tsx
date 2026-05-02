import { getSessionAction } from '@/actions/auth.actions';
import { getAllPayments } from '@/actions/payment.actions';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';
import PaymentContent from '@/components/module/payment/PaymentContent';
import { IBaseEvent, TPagination } from '@/types/event.types';
import { TBaseParticipant } from '@/types/participant.types';
import { TResponsePayment } from '@/types/payment.types';
import { IBaseUser } from '@/types/user.types';
import React from 'react'


const PaymentPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const search = await searchParams;
  const userinfo = await getSessionAction();
  if (!userinfo || !userinfo.data || !userinfo.success) {
    return (
      <ErrorFallback
        title="Authentication Error"
        message="You must be signed in to view payment information."
      />
    );
  }
  const role = userinfo.data.role;
  const payments = await getAllPayments(search);
  return (
    <div>
      <ErrorBoundary fallback={<ErrorFallback title="Loading payments failed" message="Something went wrong while loading payments." />}>
        <PaymentContent
          pagination={payments.pagination as TPagination}
          payments={payments.data as TResponsePayment<{event:IBaseEvent,participant:TBaseParticipant,user:IBaseUser}>[] || []}
          role={role as string}
        />
      </ErrorBoundary>
    </div>
  );
};

export default PaymentPage;