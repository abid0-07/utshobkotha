import api from "./api-service";

// Type definitions for events
export type EventModel = {
  id?: string;
  title: string;
  description: string;
  category: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  isFree: boolean;
  price: number;
  currentEnrolled: number;
  eventBannerBase64?: string | null;
  organizer?: {
    id: string;
    name: string;
    department: string;
  };
};

// Events API service
export const eventsApi = {
  // Get all events
  getAllEvents: async (): Promise<EventModel[]> => {
    const response = await api.get<EventModel[]>("/Events");
    return response.data;
  },

  // Get event by ID
  getEventById: async (id: string): Promise<EventModel> => {
    const response = await api.get<EventModel>(`/Events/${id}`);
    return response.data;
  },

  // Create new event
  createEvent: async (event: EventModel): Promise<EventModel> => {
    const response = await api.post<EventModel>("/Events", event);
    return response.data;
  },

  // Update event
  updateEvent: async (id: string, event: EventModel): Promise<EventModel> => {
    const response = await api.put<EventModel>(`/Events/${id}`, event);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id: string): Promise<boolean> => {
    await api.delete(`/Events/${id}`);
    return true;
  },

  // Get events by category
  getEventsByCategory: async (category: string): Promise<EventModel[]> => {
    const response = await api.get<EventModel[]>(
      `/Events/category/${category}`
    );
    return response.data;
  },

  // Register for an event
  registerForEvent: async (eventId: string): Promise<boolean> => {
    await api.post(`/Events/${eventId}/register`, {});
    return true;
  },

  // Get registered users for an event (admin/organizer only)
  getEventRegistrations: async (eventId: string): Promise<any[]> => {
    const response = await api.get(`/Events/${eventId}/registrations`);
    return response.data;
  },

  // Search events
  searchEvents: async (term: string): Promise<EventModel[]> => {
    const response = await api.get<EventModel[]>(
      `/Events/search?term=${encodeURIComponent(term)}`
    );
    return response.data;
  },
};
