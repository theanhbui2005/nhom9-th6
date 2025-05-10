import { Destination } from "./Destination/typing";

const STORAGE_KEY = 'destinations';

export const getDestinations = (): Destination[] => {
	return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

export const saveDestinations = (destinations: Destination[]): void => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(destinations));
};

export const addDestination = (destination: Destination): void => {
	const destinations = getDestinations();
	destinations.push(destination);
	saveDestinations(destinations);
};

export const updateDestination = (updatedDestination: Destination): void => {
	const destinations = getDestinations().map((destination) =>
		destination.description === updatedDestination.description ? updatedDestination : destination
	);
	saveDestinations(destinations);
};

export const deleteDestination = (description: string): void => {
	const destinations = getDestinations().filter((destination) => destination.description !== description);
	saveDestinations(destinations);
};
