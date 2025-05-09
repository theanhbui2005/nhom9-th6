declare module Admin {
	export interface Record {
		description: string;
		visitTime: string;
		foodCost: number;
		accommodationCost: number;
		transportCost: number;
		rating: number;
		imageUrl?: string;
	}
}
