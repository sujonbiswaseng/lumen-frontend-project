"use client";
import {
  DashboardData,
  ICounts,
  IEventStatus,
  IEventVisivillity,
  IPriceType,
  MonthlyRevenue,
} from "@/types/stats.types";
import React from "react";
import { StatsCard } from "./StatsCard";
import Earnings from "./chart/EarningChart";

export const StatsCounts = ({
  statsCount,
  role,
}: {
  statsCount: ICounts;
  role: string;
}) => {
  const total =
    (statsCount.participatedEvents || 0) +
      (statsCount.invitations || 0) +
      (statsCount.payments || 0) || 1;
  return (
    <div className="max-w-[1380px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Participated Events"
          value={statsCount.participatedEvents.toString()}
          bgGradient="from-cyan-500 to-teal-400"
          iconName="Calendar"
          key="participated-events"
          percentage={(
            ((statsCount.participatedEvents || 0) / total) *
            100
          ).toFixed(0)}
          trend="up"
        />
        <StatsCard
          title="Invitations"
          value={statsCount.invitations.toString()}
          bgGradient="from-emerald-500 to-teal-400"
          iconName="Mail"
          key="invitations"
          percentage={(
            ((statsCount.invitations || 0) / total) *
            100
          ).toFixed(0)}
          trend="up"
        />
        <StatsCard
          title="Payments"
          value={statsCount.payments.toString()}
          bgGradient="from-amber-500 to-orange-400"
          iconName="DollarSign"
          key="payments"
          percentage={(
            ((statsCount.payments || 0) / total) *
            100
          ).toFixed(0)}
          trend="up"
        />
        {role === "ADMIN" && (
          <StatsCard
            title="Users"
            value={statsCount.user?.toString() ?? "0"}
            bgGradient="from-violet-500 to-fuchsia-400"
            iconName="Users"
            key="users"
            trend="up"
          />
        )}
      </div>
    </div>
  );
};

// FreeAndPublic: shows counts for free and paid events
export const FreeAndPublic = ({
  statsCount,
}: {
  statsCount: { free: number; paid: number };
}) => {
  const total = (statsCount.free || 0) + (statsCount.paid || 0) || 1;
  return (
    <div className="max-w-[1380px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Free Events"
          value={statsCount.free.toString()}
          bgGradient="from-cyan-500 to-sky-400"
          iconName="Gift"
          key="free-events"
          percentage={(((statsCount.free || 0) / total) * 100).toFixed(0)}
          trend="up"
        />
        <StatsCard
          title="Paid Events"
          value={statsCount.paid.toString()}
          bgGradient="from-amber-500 to-orange-400"
          iconName="CreditCard"
          key="paid-events"
          percentage={(((statsCount.paid || 0) / total) * 100).toFixed(0)}
          trend="up"
        />
      </div>
    </div>
  );
};

// VisibilityPublicPrivate: shows counts for public and private events
export const VisibilityPublicPrivate = ({
  statsCount,
}: {
  statsCount: { public: number; private: number };
}) => {
  const total = (statsCount.public || 0) + (statsCount.private || 0) || 1;
  return (
    <div className="max-w-[1380px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Public Events"
          value={statsCount.public.toString()}
          bgGradient="from-emerald-500 to-teal-400"
          iconName="Globe"
          key="public-events"
          percentage={(((statsCount.public || 0) / total) * 100).toFixed(0)}
          trend="up"
        />
        <StatsCard
          title="Private Events"
          value={statsCount.private.toString()}
          bgGradient="from-slate-600 to-slate-400"
          iconName="Lock"
          key="private-events"
          percentage={(((statsCount.private || 0) / total) * 100).toFixed(0)}
          trend="up"
        />
      </div>
    </div>
  );
};

// EventStatusCounts: shows event status breakdown
export const EventStatusCounts = ({
  eventStatus,
}: {
  eventStatus: IEventStatus;
}) => {
  const total =
    (eventStatus.upcoming || 0) +
    (eventStatus.completed || 0) +
    (eventStatus.cancelled || 0) +
    (eventStatus.draft || 0) +
    (eventStatus.ongoing || 0) || 1;

  const cardData = [
    {
      title: "Upcoming Events",
      value: (eventStatus.upcoming ?? 0).toString(),
      bgGradient: "from-cyan-500 to-teal-400",
      iconName: "Clock",
      key: "upcoming-events",
      trend: eventStatus.upcoming > 0 ? "up" : "neutral",
      percentage: (((eventStatus.upcoming || 0) / total) * 100).toFixed(0),
    },
    {
      title: "Completed Events",
      value: (eventStatus.completed ?? 0).toString(),
      bgGradient: "from-emerald-500 to-lime-400",
      iconName: "CheckCircle",
      key: "completed-events",
      trend: eventStatus.completed > 0 ? "up" : "neutral",
      percentage: (((eventStatus.completed || 0) / total) * 100).toFixed(0),
    },
    {
      title: "Cancelled Events",
      value: (eventStatus.cancelled ?? 0).toString(),
      bgGradient: "from-rose-500 to-orange-400",
      iconName: "XCircle",
      key: "cancelled-events",
      trend: eventStatus.cancelled > 0 ? "down" : "neutral",
      percentage: (((eventStatus.cancelled || 0) / total) * 100).toFixed(0),
    },
    {
      title: "Draft Events",
      value: (eventStatus.draft ?? 0).toString(),
      bgGradient: "from-sky-500 to-cyan-400",
      iconName: "FileText",
      key: "draft-events",
      trend: eventStatus.draft > 0 ? "up" : "neutral",
      percentage: (((eventStatus.draft || 0) / total) * 100).toFixed(0),
    },
    {
      title: "Ongoing Events",
      value: (eventStatus.ongoing ?? 0).toString(),
      bgGradient: "from-violet-500 to-fuchsia-400",
      iconName: "RefreshCw",
      key: "ongoing-events",
      trend: eventStatus.ongoing > 0 ? "up" : "neutral",
      percentage: (((eventStatus.ongoing || 0) / total) * 100).toFixed(0),
    },
  ];

  return (
    <div className="max-w-[1380px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
        {cardData.map((card) => (
          <StatsCard
            key={card.key}
            title={card.title}
            value={card.value}
            bgGradient={card.bgGradient}
            iconName={card.iconName}
            trend={card.trend as "up" | "down" }
            percentage={card.percentage}
          />
        ))}
      </div>
    </div>
  );
};

// DashboardContent: main dashboard layout
const DashboardContent = ({
  stats,
  eventVisivility,
  role,
}: {
  stats: DashboardData;
  eventVisivility: IEventVisivillity;
  role: string;
}) => {
  const sectionTitle =
    role === "ADMIN" ? "Admin Dashboard Overview" : "Your Dashboard Overview";
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="max-w-[1380px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-2">
        <div className="rounded-xl border border-cyan-100 bg-linear-to-r from-white via-cyan-50 to-emerald-50 p-4 sm:p-5 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            {sectionTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-700">
            A unique, responsive stats overview with a fresh color system.
          </p>
        </div>
      </div>
      <FreeAndPublic statsCount={stats?.priceType as IPriceType} />
      <StatsCounts role={role} statsCount={stats?.counts as ICounts} />
      <VisibilityPublicPrivate statsCount={eventVisivility} />
      <EventStatusCounts eventStatus={stats.eventStatus} />
      <Earnings
        stats={stats.monthlyRevenue as MonthlyRevenue[]}
        earningRate={stats.totalRevenue}
      />
    </div>
  );
};

export default DashboardContent;
