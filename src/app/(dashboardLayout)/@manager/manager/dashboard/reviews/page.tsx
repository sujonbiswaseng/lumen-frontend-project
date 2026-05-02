import { getSessionAction } from '@/actions/auth.actions'
import { getMyReviews } from '@/actions/review.actions'
import ErrorBoundary from '@/components/ErrorBoundary'
import ErrorFallback from '@/components/ErrorFallback'
import Getreview from '@/components/module/reviews/Getreview'
import { TPagination } from '@/types/event.types'
import { IgetReviewData } from '@/types/review.types'
import React from 'react'

const ReviewsPage = async({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const search=await searchParams
  const reviews= await getMyReviews(search)
  const userinfo = await getSessionAction();
  if (!userinfo || !userinfo.data || !userinfo.success) {
    return (
      <ErrorFallback
        title="Authentication Error"
        message="You must be signed in to view your reviews."
      />
    );
  }
  const role=userinfo.data.role
  return (
    <div>
      <ErrorBoundary fallback={<ErrorFallback title="Loading reviews failed" message="Something went wrong while loading your reviews." />}>
        <Getreview role={role as string} reviews={reviews.data as IgetReviewData[]} pagination={reviews.pagination as TPagination}/>
      </ErrorBoundary>
    </div>
  )
}

export default ReviewsPage