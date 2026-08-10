import { fetchEvents } from '@/actions/event.actions'
import Trending from '@/components/chatbot/Trending'
import NotFoundItem from '@/components/NotFoundItem';
import { IBaseEvent, TResponseEvent } from '@/types/event.types';
import React from 'react'

const TrendingPage = async() => {
  const data = await fetchEvents();

  const events = data.data?.UPCOMING
    ?.sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 8);
    const result =events as IBaseEvent[]
    if(result.length===0){
      return <NotFoundItem content="No trending events found." />
    }
  return (
    <main className="min-h-screen py-8">
      <Trending events={result as IBaseEvent[]} />
    </main>
  )
}

export default TrendingPage