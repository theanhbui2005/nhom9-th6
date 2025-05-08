export interface DestinationInPlan {
  destinationId: string;
  order: number;
  startTime: string;
  endTime: string;
  travelDuration?: number; // Thời gian di chuyển đến điểm tiếp theo (phút)
}

export interface DayPlan {
  date: string;
  destinations: DestinationInPlan[];
}

export interface TravelPlan {
  id: string;
  name: string;
  days: DayPlan[];
  totalBudget: number;
  totalDuration: number;
} 