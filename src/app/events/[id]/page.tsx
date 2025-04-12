"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Heart,
  Ticket,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useEvents } from "@/lib/event-context";
import { EventModel } from "@/lib/events-service";
import { volunteerOpportunities } from "@/lib/data"; // Keep using mock data for volunteers for now

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getEvent, registerForEvent, isRegistered, deleteEvent } = useEvents();
  const { toast } = useToast();

  const [event, setEvent] = useState<EventModel | null>(null);
  const [userIsRegistered, setUserIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch event details and registration status
  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      try {
        if (!id) return;

        // Get event details
        const eventData = await getEvent(id as string);
        setEvent(eventData);

        // Check if user is registered for this event (only if user is logged in)
        if (user) {
          const registered = await isRegistered(id as string);
          setUserIsRegistered(registered);
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError(
          "Failed to load event details. The event might not exist or has been removed."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, user, getEvent, isRegistered]);

  // Get volunteer opportunities for this event
  const eventVolunteerOpportunities = volunteerOpportunities.filter(
    (opp) => opp.eventId === id
  );

  const handleRegister = async () => {
    try {
      if (!event || !id) return;

      const success = await registerForEvent(id as string);
      if (success) {
        setUserIsRegistered(true);
        setIsRegistrationDialogOpen(false);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Failed to register for this event. Please try again.",
      });
    }
  };

  const handleDeleteEvent = async () => {
    try {
      if (!id) return;

      await deleteEvent(id as string);
      setIsDeleteDialogOpen(false);
      router.push("/events");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Failed to delete this event. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/events")}>Browse Events</Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event details - left side */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative rounded-xl overflow-hidden h-[300px] md:h-[400px]">
            <Image
              src={event.eventBannerBase64 || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div>
            {/* Categories and capacity */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge>{event.category}</Badge>
              {event.currentEnrolled >= event.capacity ? (
                <Badge variant="destructive">Fully Booked</Badge>
              ) : (
                <Badge variant="outline">
                  {event.capacity - event.currentEnrolled} spots left
                </Badge>
              )}
            </div>

            {/* Event title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {event.title}
            </h1>

            {/* Organizer info */}
            {event.organizer && (
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {event.organizer?.name?.charAt(0) || "O"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {event.organizer.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.organizer.department}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 md:ml-auto">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Heart className="h-4 w-4" /> Save
                  </Button>
                </div>
              </div>
            )}

            {/* Event tabs */}
            <Tabs defaultValue="about">
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              {/* About tab */}
              <TabsContent value="about" className="mt-6">
                <h3 className="text-xl font-semibold mb-3">About This Event</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {event.description}
                </p>
              </TabsContent>

              {/* Schedule tab */}
              <TabsContent value="schedule" className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Event Schedule</h3>
                <div className="border rounded-lg divide-y">
                  <div className="p-4">
                    <p className="font-medium">
                      Date: {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                    <p className="mt-2">
                      Time: {event.startTime} - {event.endTime}
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Details tab */}
              <TabsContent value="details" className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Event Details</h3>
                <p className="text-muted-foreground">
                  Location: {event.location}
                  <br />
                  Capacity: {event.capacity} attendees
                  <br />
                  Currently registered: {event.currentEnrolled} attendees
                  <br />
                  Price: {event.isFree ? "Free" : `${event.price} BDT`}
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar - right side */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Event details card */}
            <div className="border rounded-xl p-6 space-y-4">
              {/* Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Date</span>
                </div>
                <p className="font-medium">
                  {new Date(event.eventDate).toLocaleDateString()}
                </p>
              </div>

              {/* Time */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Time</span>
                </div>
                <p className="font-medium">{`${event.startTime} - ${event.endTime}`}</p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </div>
                <p className="font-medium">{event.location}</p>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Ticket className="h-4 w-4" />
                  <span>Price</span>
                </div>
                <p className="font-medium">
                  {event.isFree ? (
                    <span className="text-green-600 dark:text-green-400">
                      Free
                    </span>
                  ) : (
                    `${event.price} BDT`
                  )}
                </p>
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Capacity</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary rounded-full h-2.5"
                    style={{
                      width: `${
                        (event.currentEnrolled / event.capacity) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">{event.currentEnrolled}</span>{" "}
                  of <span className="font-medium">{event.capacity}</span> spots
                  filled
                </p>
              </div>

              <Separator />

              {/* Registration section */}
              {user ? (
                userIsRegistered ? (
                  <div className="space-y-4">
                    <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <p className="text-sm font-medium">
                        You're registered for this event!
                      </p>
                    </div>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href="/profile/tickets">View Ticket</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Dialog
                      open={isRegistrationDialogOpen}
                      onOpenChange={setIsRegistrationDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          className="w-full"
                          disabled={event.currentEnrolled >= event.capacity}
                        >
                          {event.currentEnrolled >= event.capacity
                            ? "Fully Booked"
                            : "Register Now"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Register for Event</DialogTitle>
                          <DialogDescription>
                            You are about to register for {event.title}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-muted-foreground">
                            {event.isFree
                              ? "This is a free event. Click confirm to complete your registration."
                              : `This event costs ${event.price} BDT. You will be asked to complete payment after registration.`}
                          </p>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsRegistrationDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleRegister}>
                            Confirm Registration
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Admin/organizer actions */}
                    {user &&
                      (user.role === "organizer" || user.role === "admin") && (
                        <div className="mt-4 space-y-2">
                          <Button className="w-full" variant="outline" asChild>
                            <Link href={`/events/edit/${id}`}>Edit Event</Link>
                          </Button>
                          <Button
                            className="w-full"
                            variant="destructive"
                            onClick={() => setIsDeleteDialogOpen(true)}
                          >
                            Delete Event
                          </Button>
                        </div>
                      )}
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <Button className="w-full" asChild>
                    <Link href="/auth/login">Login to Register</Link>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      href="/auth/register"
                      className="text-primary hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
