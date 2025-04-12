"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import  { eventsApi,EventModel } from './events-service';
import { eventsApiMock } from './events-mock-service';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from './auth-context';

// Configuration flag for development mode
const USE_MOCK_DATA = false; // Set to false to use real API

type EventContextType = {
  events: EventModel[];
  featuredEvents: EventModel[];
  isLoading: boolean;
  error: string | null;
  refreshEvents: () => Promise<void>;
  getEvent: (id: string) => Promise<EventModel>;
  createEvent: (eventData: EventModel) => Promise<EventModel>;
  updateEvent: (id: string, eventData: EventModel) => Promise<EventModel>;
  deleteEvent: (id: string) => Promise<boolean>;
  registerForEvent: (eventId: string) => Promise<boolean>;
  isRegistered: (eventId: string) => Promise<boolean>;
};

const EventContext = createContext<EventContextType | null>(null);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<EventModel[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Use the appropriate API based on development mode
  const api = USE_MOCK_DATA ? eventsApiMock : eventsApi;

  const loadEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getAllEvents();
      setEvents(data);
      // Set featured events (for example, taking the first 3)
      setFeaturedEvents(data.slice(0, 3));
    } catch (err: any) {
      console.error("Error loading events:", err);
      setError("Failed to load events. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load events. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load events on initial render
  useEffect(() => {
    loadEvents();
  }, []);

  const getEvent = async (id: string): Promise<EventModel> => {
    try {
      return await api.getEventById(id);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load event details.",
      });
      throw err;
    }
  };

  const createEvent = async (eventData: EventModel): Promise<EventModel> => {
    try {
      const newEvent = await api.createEvent(eventData);
      // Refresh the events list
      await loadEvents();
      toast({
        title: "Event Created",
        description: "Your event has been created successfully.",
      });
      return newEvent;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create event. Please try again.",
      });
      throw err;
    }
  };

  const updateEvent = async (id: string, eventData: EventModel): Promise<EventModel> => {
    try {
      const updatedEvent = await api.updateEvent(id, eventData);
      // Refresh the events list
      await loadEvents();
      toast({
        title: "Event Updated",
        description: "Your event has been updated successfully.",
      });
      return updatedEvent;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update event. Please try again.",
      });
      throw err;
    }
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    try {
      await api.deleteEvent(id);
      // Refresh the events list
      await loadEvents();
      toast({
        title: "Event Deleted",
        description: "Your event has been deleted successfully.",
      });
      return true;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete event. Please try again.",
      });
      throw err;
    }
  };

  const registerForEvent = async (eventId: string): Promise<boolean> => {
    if (!user) throw new Error("You must be logged in to register for events");
    
    try {
      const result = await api.registerForEvent(eventId, user.id);
      if (result) {
        toast({
          title: "Registration Successful",
          description: "You have successfully registered for this event.",
        });
        // Refresh events to update counts
        await loadEvents();
      }
      return result;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Failed to register for event. Please try again.",
      });
      throw err;
    }
  };

  const isRegistered = async (eventId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Use the events API service based on the mock flag
      return await api.checkRegistration(eventId, user.id);
      // Should be:
      return await (USE_MOCK_DATA
        ? eventsApiMock
        : eventsApi
      ).checkRegistration(eventId, user.id);
    } catch (err) {
      return false;
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        featuredEvents,
        isLoading,
        error,
        refreshEvents: loadEvents,
        getEvent,
        createEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        isRegistered
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }

  return context;
};