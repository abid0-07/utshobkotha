import { EventModel } from "./events-service";
import { upcomingEvents } from "./data";

// Convert the mock data to match the API model
const convertMockEvents = (): EventModel[] => {
  return upcomingEvents.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    category: event.category,
    eventDate: event.date,
    startTime: event.time.split(" - ")[0],
    endTime: event.time.split(" - ")[1],
    location: event.location,
    capacity: event.capacity,
    isFree: event.price === "Free",
    price: event.price === "Free" ? 0 : parseInt(event.price.split(" ")[0]),
    currentEnrolled: event.registered,
    eventBannerBase64: event.image,
    organizer: event.organizer,
  }));
};

// Mock Events API service for development
export const eventsApiMock = {
  // Get all events
  getAllEvents: async (): Promise<EventModel[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
    return convertMockEvents();
  },

  // Get event by ID
  getEventById: async (id: string): Promise<EventModel> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const event = upcomingEvents.find((e) => e.id === id);
    if (!event) throw new Error("Event not found");

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      eventDate: event.date,
      startTime: event.time.split(" - ")[0],
      endTime: event.time.split(" - ")[1],
      location: event.location,
      capacity: event.capacity,
      isFree: event.price === "Free",
      price: event.price === "Free" ? 0 : parseInt(event.price.split(" ")[0]),
      currentEnrolled: event.registered,
      eventBannerBase64: event.image,
      organizer: event.organizer,
    };
  },

  // Create new event
  createEvent: async (eventData: EventModel): Promise<EventModel> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
    };
  },

  // Update existing event
  updateEvent: async (
    id: string,
    eventData: EventModel
  ): Promise<EventModel> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      ...eventData,
      id,
    };
  },

  // Delete event
  deleteEvent: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  },

  // Get events by category
  getEventsByCategory: async (category: string): Promise<EventModel[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return convertMockEvents().filter((event) => event.category === category);
  },

  // Register for an event
  registerForEvent: async (
    eventId: string,
    userId?: string
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  },

  // Get registered users for an event
  getEventRegistrations: async (eventId: string): Promise<any[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [];
  },

  // Search events
  searchEvents: async (term: string): Promise<EventModel[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockEvents = convertMockEvents();
    return mockEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(term.toLowerCase()) ||
        event.description.toLowerCase().includes(term.toLowerCase())
    );
  },

  // Check if user is registered for an event
  checkRegistration: async (
    eventId: string,
    userId: string
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return Math.random() > 0.5; // Random result for demonstration
  },
};
