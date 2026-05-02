// types/dashboard.types.ts

export type Month = 
  | "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" 
  | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";

export interface ICounts {
  participatedEvents: number;
  invitations: number;
  payments: number;
  user:number
}

export type PublicStats = {
  totalEvents: number;
  totalUsers: number;
  totalManagers: number;
  totalAdmins: number;
  totalParticipants: number;
  totalReviews: number;
  totalNewsletters: number;
};


export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface IEventStatus {
  upcoming: number;
  completed: number;
  cancelled: number;
  draft: number;
  ongoing: number;
}

export interface ChartData {
  label?: string;    
  month?: Month;   
  value: number;
}

export interface IEventVisivillity {
  public: number;
  private: number;
}

export interface IPriceType {
  free: number;
  paid: number;
}


export interface DashboardData {
  counts: ICounts;
  priceType: IPriceType;
  totalRevenue: number;
  monthlyRevenue: MonthlyRevenue[];
  eventStatus: IEventStatus;
}