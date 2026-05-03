import { getCategory } from '@/actions/category.actions'
import { CreateEvent } from '@/components/module/event/CreateEvent'
import { TResponseCategoryData } from '@/types/category.type'
import React from 'react'

const EventCratePage = async() => {
  const res=await getCategory()
  return (
    <div>
      <CreateEvent data={res?.data as TResponseCategoryData[]}/>
        
    </div>
  )
}

export default EventCratePage