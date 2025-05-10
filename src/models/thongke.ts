import { useState, useEffect } from 'react';
import useDestinationModel from './destination';

const useThongKeModel = () => {
  const { destinations } = useDestinationModel();
  const [stats, setStats] = useState({
    totalItineraries: 0,
    popularDestination: '',
    totalRevenue: 0,
  });

  useEffect(() => {
    // Calculate statistics from destinations
    const totalItineraries = destinations.length;
    const popularDestination = destinations[0]?.name || 'N/A';
    const totalRevenue = destinations.reduce(
      (acc, item) => acc + (item.foodCost + item.accommodationCost + item.transportCost),
      0
    );

    setStats({ totalItineraries, popularDestination, totalRevenue });
  }, [destinations]);

  return stats;
};

export default useThongKeModel;
