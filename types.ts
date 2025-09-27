export interface InventoryItem {
  id: string;
  name: string;
  expiryDate: string;
  quantity: string;
  category: string;
}

export interface Recipe {
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
}

export interface DonationRequest {
  id: string;
  restaurantName: string;
  location: string;
  items: InventoryItem[];
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  donationDate?: string;
}