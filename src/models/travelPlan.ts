import { useState, useEffect } from "react";
import useDestinationModel from "./destination";
import type { TravelPlan, DayPlan, DestinationInPlan } from "@/services/TravelPlan/typing";
import type { Destination } from "@/services/Destination/typing";

// Hằng số cho việc tính toán
const AVERAGE_SPEED = 50; // km/h - tốc độ di chuyển trung bình
const DISTANCES: Record<string, Record<string, number>> = {
  "Quảng Ninh": {
    "Lào Cai": 380,
    "Đà Nẵng": 850,
  },
  "Lào Cai": {
    "Quảng Ninh": 380,
    "Đà Nẵng": 1000,
  },
  "Đà Nẵng": {
    "Quảng Ninh": 850,
    "Lào Cai": 1000,
  },
};

// Dữ liệu mẫu mặc định
const defaultTravelPlans: TravelPlan[] = [
  {
    id: "1",
    name: "Kế hoạch du lịch miền Bắc",
    days: [
      {
        date: new Date().toISOString().split('T')[0],
        destinations: [
          {
            destinationId: "1",
            order: 1,
            startTime: "08:00",
            endTime: "12:00",
            travelDuration: 0,
          },
        ],
      },
    ],
    totalBudget: 1500000,
    totalDuration: 240,
  },
];

const useTravelPlanModel = () => {
  const { destinations } = useDestinationModel();
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>(() => {
    const stored = localStorage.getItem("travelPlans");
    return stored ? JSON.parse(stored) : defaultTravelPlans;
  });
  const [currentPlan, setCurrentPlan] = useState<TravelPlan | null>(null);

  // Lưu dữ liệu vào localStorage
  const saveToStorage = (data: TravelPlan[]) => {
    localStorage.setItem("travelPlans", JSON.stringify(data));
  };

  useEffect(() => {
    if (travelPlans.length > 0 && !currentPlan) {
      setCurrentPlan(travelPlans[0]);
    }
  }, [travelPlans, currentPlan]);

  // Tính thời gian di chuyển giữa hai địa điểm (phút)
  const calculateTravelTime = (fromLocation: string, toLocation: string): number => {
    if (fromLocation === toLocation) return 0;
    
    const distance = DISTANCES[fromLocation]?.[toLocation] || 
                    DISTANCES[toLocation]?.[fromLocation] || 
                    300; // Mặc định 300km nếu không có dữ liệu
    
    return Math.round((distance / AVERAGE_SPEED) * 60); // Chuyển giờ sang phút
  };

  // Tìm điểm đến từ ID
  const findDestinationById = (id: string): Destination | undefined => {
    return destinations.find((d: Destination) => d.id === id);
  };

  // Tạo mới một kế hoạch du lịch
  const createTravelPlan = (name: string) => {
    const newPlan: TravelPlan = {
      id: Date.now().toString(),
      name,
      days: [
        {
          date: new Date().toISOString().split('T')[0],
          destinations: [],
        },
      ],
      totalBudget: 0,
      totalDuration: 0,
    };
    
    const newList = [...travelPlans, newPlan];
    saveToStorage(newList);
    setTravelPlans(newList);
    setCurrentPlan(newPlan);
    return newPlan;
  };

  // Cập nhật kế hoạch
  const updateTravelPlan = (updated: TravelPlan) => {
    const newList = travelPlans.map((plan: TravelPlan) =>
      plan.id === updated.id ? updated : plan
    );
    saveToStorage(newList);
    setTravelPlans(newList);
    if (currentPlan?.id === updated.id) {
      setCurrentPlan(updated);
    }
  };

  // Xoá kế hoạch
  const deleteTravelPlan = (id: string) => {
    const newList = travelPlans.filter((plan: TravelPlan) => plan.id !== id);
    saveToStorage(newList);
    setTravelPlans(newList);
    if (currentPlan?.id === id) {
      setCurrentPlan(newList.length > 0 ? newList[0] : null);
    }
  };

  // Thêm ngày mới vào kế hoạch
  const addDayToPlan = (planId: string, date: string) => {
    if (!currentPlan || currentPlan.id !== planId) return;
    
    // Kiểm tra ngày đã tồn tại chưa
    if (currentPlan.days.some((day: DayPlan) => day.date === date)) {
      return alert("Ngày này đã tồn tại trong kế hoạch!");
    }
    
    const updatedPlan = {
      ...currentPlan,
      days: [
        ...currentPlan.days,
        {
          date,
          destinations: [],
        },
      ],
    };
    
    updateTravelPlan(updatedPlan);
  };

  // Xoá ngày khỏi kế hoạch
  const removeDayFromPlan = (planId: string, date: string) => {
    if (!currentPlan || currentPlan.id !== planId) return;
    
    const updatedPlan = {
      ...currentPlan,
      days: currentPlan.days.filter((day: DayPlan) => day.date !== date),
    };
    
    // Cập nhật lại totalBudget và totalDuration
    const { totalBudget, totalDuration } = calculateTotals(updatedPlan);
    updatedPlan.totalBudget = totalBudget;
    updatedPlan.totalDuration = totalDuration;
    
    updateTravelPlan(updatedPlan);
  };

  // Thêm điểm đến vào một ngày
  const addDestinationToDay = (planId: string, date: string, destinationId: string, startTime: string, endTime: string) => {
    if (!currentPlan || currentPlan.id !== planId) return;
    
    const dayIndex = currentPlan.days.findIndex((day: DayPlan) => day.date === date);
    if (dayIndex === -1) return;
    
    const day = currentPlan.days[dayIndex];
    const destinationsList = [...day.destinations];
    
    // Tính order mới
    const newOrder = destinationsList.length > 0 
      ? Math.max(...destinationsList.map(d => d.order)) + 1 
      : 1;
    
    // Tính thời gian di chuyển từ điểm trước đó
    let travelDuration = 0;
    if (destinationsList.length > 0) {
      const lastDestination = destinationsList[destinationsList.length - 1];
      const lastDestinationData = findDestinationById(lastDestination.destinationId);
      const newDestinationData = findDestinationById(destinationId);
      
      if (lastDestinationData && newDestinationData) {
        travelDuration = calculateTravelTime(
          lastDestinationData.location,
          newDestinationData.location
        );
      }
    }
    
    // Thêm điểm đến mới
    const newDestination: DestinationInPlan = {
      destinationId,
      order: newOrder,
      startTime,
      endTime,
      travelDuration,
    };
    
    // Cập nhật ngày với điểm đến mới
    const updatedDays = [...currentPlan.days];
    updatedDays[dayIndex] = {
      ...day,
      destinations: [...destinationsList, newDestination],
    };
    
    const updatedPlan = {
      ...currentPlan,
      days: updatedDays,
    };
    
    // Cập nhật lại totalBudget và totalDuration
    const { totalBudget, totalDuration } = calculateTotals(updatedPlan);
    updatedPlan.totalBudget = totalBudget;
    updatedPlan.totalDuration = totalDuration;
    
    updateTravelPlan(updatedPlan);
  };

  // Xoá điểm đến khỏi ngày
  const removeDestinationFromDay = (planId: string, date: string, destinationOrder: number) => {
    if (!currentPlan || currentPlan.id !== planId) return;
    
    const dayIndex = currentPlan.days.findIndex((day: DayPlan) => day.date === date);
    if (dayIndex === -1) return;
    
    const day = currentPlan.days[dayIndex];
    
    // Lọc bỏ điểm đến cần xoá
    const updatedDestinations = day.destinations.filter((d: DestinationInPlan) => d.order !== destinationOrder);
    
    // Cập nhật lại order cho các điểm đến còn lại
    const reorderedDestinations = updatedDestinations.map((d: DestinationInPlan, index) => ({
      ...d,
      order: index + 1,
    }));
    
    // Cập nhật lại thời gian di chuyển
    const destinationsWithUpdatedTravelTime = reorderedDestinations.map((d: DestinationInPlan, index) => {
      if (index === 0) return { ...d, travelDuration: 0 };
      
      const prevDest = findDestinationById(reorderedDestinations[index - 1].destinationId);
      const currDest = findDestinationById(d.destinationId);
      
      const travelDuration = prevDest && currDest
        ? calculateTravelTime(prevDest.location, currDest.location)
        : 0;
      
      return { ...d, travelDuration };
    });
    
    // Cập nhật ngày
    const updatedDays = [...currentPlan.days];
    updatedDays[dayIndex] = {
      ...day,
      destinations: destinationsWithUpdatedTravelTime,
    };
    
    const updatedPlan = {
      ...currentPlan,
      days: updatedDays,
    };
    
    // Cập nhật lại totalBudget và totalDuration
    const { totalBudget, totalDuration } = calculateTotals(updatedPlan);
    updatedPlan.totalBudget = totalBudget;
    updatedPlan.totalDuration = totalDuration;
    
    updateTravelPlan(updatedPlan);
  };

  // Sắp xếp lại điểm đến trong một ngày
  const reorderDestinations = (planId: string, date: string, destinationOrders: number[]) => {
    if (!currentPlan || currentPlan.id !== planId) return;
    
    const dayIndex = currentPlan.days.findIndex((day: DayPlan) => day.date === date);
    if (dayIndex === -1) return;
    
    const day = currentPlan.days[dayIndex];
    
    // Sắp xếp lại các điểm đến theo thứ tự mới
    const reorderedDestinations = destinationOrders.map((order: number, index: number) => {
      const destination = day.destinations.find((d: DestinationInPlan) => d.order === order);
      if (!destination) return null;
      return { ...destination, order: index + 1 };
    }).filter(Boolean) as DestinationInPlan[];
    
    // Cập nhật lại thời gian di chuyển
    const destinationsWithUpdatedTravelTime = reorderedDestinations.map((d: DestinationInPlan, index: number) => {
      if (index === 0) return { ...d, travelDuration: 0 };
      
      const prevDest = findDestinationById(reorderedDestinations[index - 1].destinationId);
      const currDest = findDestinationById(d.destinationId);
      
      const travelDuration = prevDest && currDest
        ? calculateTravelTime(prevDest.location, currDest.location)
        : 0;
      
      return { ...d, travelDuration };
    });
    
    // Cập nhật ngày
    const updatedDays = [...currentPlan.days];
    updatedDays[dayIndex] = {
      ...day,
      destinations: destinationsWithUpdatedTravelTime,
    };
    
    const updatedPlan = {
      ...currentPlan,
      days: updatedDays,
    };
    
    // Cập nhật lại totalBudget và totalDuration
    const { totalBudget, totalDuration } = calculateTotals(updatedPlan);
    updatedPlan.totalBudget = totalBudget;
    updatedPlan.totalDuration = totalDuration;
    
    updateTravelPlan(updatedPlan);
  };

  // Tính toán tổng chi phí và thời gian
  const calculateTotals = (plan: TravelPlan) => {
    let totalBudget = 0;
    let totalDuration = 0;
    
    plan.days.forEach((day: DayPlan) => {
      day.destinations.forEach((destination: DestinationInPlan) => {
        // Cộng chi phí của điểm đến
        const destData = findDestinationById(destination.destinationId);
        if (destData) {
          totalBudget += destData.price;
        }
        
        // Cộng thời gian tham quan
        const startMinutes = convertTimeToMinutes(destination.startTime);
        const endMinutes = convertTimeToMinutes(destination.endTime);
        if (startMinutes !== null && endMinutes !== null) {
          totalDuration += endMinutes - startMinutes;
        }
        
        // Cộng thời gian di chuyển
        totalDuration += destination.travelDuration || 0;
      });
    });
    
    return { totalBudget, totalDuration };
  };

  // Chuyển đổi thời gian "HH:MM" sang phút
  const convertTimeToMinutes = (time: string): number | null => {
    const match = time.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    
    return hours * 60 + minutes;
  };

  return {
    travelPlans,
    currentPlan,
    setCurrentPlan,
    createTravelPlan,
    updateTravelPlan,
    deleteTravelPlan,
    addDayToPlan,
    removeDayFromPlan,
    addDestinationToDay,
    removeDestinationFromDay,
    reorderDestinations,
    findDestinationById,
    calculateTravelTime,
  };
};

export default useTravelPlanModel; 