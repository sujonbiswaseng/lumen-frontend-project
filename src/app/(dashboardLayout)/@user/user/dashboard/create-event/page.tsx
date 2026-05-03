
import { getCategory } from '@/actions/category.actions'
import ErrorBoundary from '@/components/ErrorBoundary'
import { CreateEvent } from '@/components/module/event/CreateEvent'
import { TResponseCategoryData } from '@/types/category.type'
import React from 'react'

const CreateEventPage = async() => {
  const res=await getCategory()

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Something went wrong while loading the Create Event form.</div>}>
        <div>
        <CreateEvent data={res?.data as TResponseCategoryData[]}/>
        </div>
      </ErrorBoundary>
    </React.Suspense>
  )
}

export default CreateEventPage