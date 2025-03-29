"use client";

import type React from "react";

import Link from "next/link";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Heart,
  Ticket,
  CalendarCheck,
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
import {
  upcomingEvents,
  volunteerOpportunities,
  userRegistrations,
} from "@/lib/data";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // Find the event with the matching ID
  const event = upcomingEvents.find((e) => e.id === id);

  // If the event doesn't exist, redirect to 404
  if (!event) {
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

  // Check if user has already registered for this event
  const isRegistered = userRegistrations.some(
    (reg) => reg.eventId === id && user && reg.userId === user.id
  );

  // Get volunteer opportunities for this event
  const eventVolunteerOpportunities = volunteerOpportunities.filter(
    (opp) => opp.eventId === id
  );

  const handleRegister = () => {
    // In a real app, this would make an API call to register the user
    toast({
      title: "Registration Successful",
      description: `You have successfully registered for ${event.title}. Check your email for confirmation.`,
    });
    setIsRegistrationDialogOpen(false);
  };

  const handleDeleteEvent = () => {
    // In a real app, this would make an API call to delete the event
    toast({
      title: "Event Deleted",
      description: "The event has been successfully deleted.",
    });
    setIsDeleteDialogOpen(false);
    router.push("/events");
  };

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative rounded-xl overflow-hidden h-[300px] md:h-[400px]">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge>{event.category}</Badge>
              {event.registered >= event.capacity ? (
                <Badge variant="destructive">Fully Booked</Badge>
              ) : (
                <Badge variant="outline">
                  {event.capacity - event.registered} spots left
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {event.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder.svg?height=30&width=30"
                    alt={event.organizer.name}
                  />
                  <AvatarFallback>
                    {event.organizer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{event.organizer.name}</p>
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

            <Tabs defaultValue="about">
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="speakers">Speakers</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <h3 className="text-xl font-semibold mb-3">About This Event</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {event.description}
                </p>

                {eventVolunteerOpportunities.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-3">
                      Volunteer Opportunities
                    </h3>
                    <div className="space-y-4">
                      {eventVolunteerOpportunities.map((opportunity) => (
                        <div
                          key={opportunity.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">
                                {opportunity.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {opportunity.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {opportunity.skills.map((skill, index) => (
                                  <Badge key={index} variant="outline">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Badge
                              variant={
                                opportunity.status === "Open"
                                  ? "outline"
                                  : "secondary"
                              }
                            >
                              {opportunity.status}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <p className="text-sm">
                              <span className="font-medium">
                                {opportunity.applied}
                              </span>
                              <span className="text-muted-foreground">
                                {" "}
                                of{" "}
                              </span>
                              <span className="font-medium">
                                {opportunity.slots}
                              </span>
                              <span className="text-muted-foreground">
                                {" "}
                                positions filled
                              </span>
                            </p>

                            {opportunity.status === "Open" && user ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm">Apply Now</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Apply for Volunteer Position
                                    </DialogTitle>
                                    <DialogDescription>
                                      Apply to volunteer as {opportunity.title}{" "}
                                      for {event.title}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="motivation">
                                        Why do you want to volunteer?
                                      </Label>
                                      <Textarea
                                        id="motivation"
                                        placeholder="Share your motivation and relevant experience..."
                                        rows={4}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="availability">
                                        Availability
                                      </Label>
                                      <Select defaultValue="full">
                                        <SelectTrigger id="availability">
                                          <SelectValue placeholder="Select your availability" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="full">
                                            Full Event
                                          </SelectItem>
                                          <SelectItem value="morning">
                                            Morning Only
                                          </SelectItem>
                                          <SelectItem value="afternoon">
                                            Afternoon Only
                                          </SelectItem>
                                          <SelectItem value="custom">
                                            Custom Hours
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox id="terms" />
                                        <label
                                          htmlFor="terms"
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                          I agree to the volunteer guidelines
                                          and responsibilities
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => {}}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        toast({
                                          title: "Application Submitted",
                                          description:
                                            "Your volunteer application has been submitted successfully.",
                                        });
                                      }}
                                    >
                                      Submit Application
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <Button size="sm" disabled>
                                Apply
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="schedule" className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Event Schedule</h3>
                <div className="border rounded-lg divide-y">
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <CalendarCheck className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Registration & Welcome</h4>
                        <p className="text-sm text-muted-foreground">
                          09:00 AM - 09:30 AM
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <CalendarCheck className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Opening Keynote</h4>
                        <p className="text-sm text-muted-foreground">
                          09:30 AM - 10:30 AM
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <CalendarCheck className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Main Session</h4>
                        <p className="text-sm text-muted-foreground">
                          10:45 AM - 12:30 PM
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <CalendarCheck className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Lunch Break</h4>
                        <p className="text-sm text-muted-foreground">
                          12:30 PM - 01:30 PM
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <CalendarCheck className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Workshops</h4>
                        <p className="text-sm text-muted-foreground">
                          01:30 PM - 03:30 PM
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <CalendarCheck className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Closing Ceremony</h4>
                        <p className="text-sm text-muted-foreground">
                          03:45 PM - 04:30 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="speakers" className="mt-6">
                <h3 className="text-xl font-semibold mb-3">
                  Speakers & Presenters
                </h3>
                {event.speakers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.speakers.map((speaker, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 border rounded-lg"
                      >
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src="/placeholder.svg?height=60&width=60"
                            alt={speaker.name}
                          />
                          <AvatarFallback>
                            {speaker.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{speaker.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {speaker.designation}
                          </p>
                          <p className="text-sm mt-2">{speaker.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No speakers have been announced for this event yet.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="border rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Date</span>
                </div>
                <p className="font-medium">{event.date}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Time</span>
                </div>
                <p className="font-medium">{event.time}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </div>
                <p className="font-medium">{event.location}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Ticket className="h-4 w-4" />
                  <span>Price</span>
                </div>
                <p className="font-medium">
                  {event.price === "Free" ? (
                    <span className="text-green-600 dark:text-green-400">
                      Free
                    </span>
                  ) : (
                    event.price
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Capacity</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary rounded-full h-2.5"
                    style={{
                      width: `${(event.registered / event.capacity) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">{event.registered}</span> of{" "}
                  <span className="font-medium">{event.capacity}</span> spots
                  filled
                </p>
              </div>

              <Separator />

              {user ? (
                isRegistered ? (
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
                    {user &&
                      (user.role === "organizer" || user.role === "admin") && (
                        <div className="mt-4 space-y-2">
                          <Button className="w-full" variant="outline" asChild>
                            <Link href={`/events/edit/${id}`}>Edit Event</Link>
                          </Button>
                          <Button
                            className="w-full"
                            variant="destructive"
                            onClick={() => {
                              setSelectedEvent(id as string);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            Delete Event
                          </Button>
                        </div>
                      )}
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
                          disabled={event.registered >= event.capacity}
                        >
                          {event.registered >= event.capacity
                            ? "Fully Booked"
                            : "Register Now"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Register for {event.title}</DialogTitle>
                          <DialogDescription>
                            Complete your registration for this event. You'll
                            receive an email confirmation with your ticket.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Event</span>
                            <span className="font-medium">{event.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date</span>
                            <span className="font-medium">{event.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Time</span>
                            <span className="font-medium">{event.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Location
                            </span>
                            <span className="font-medium">
                              {event.location}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price</span>
                            <span className="font-medium">
                              {event.price === "Free" ? (
                                <span className="text-green-600 dark:text-green-400">
                                  Free
                                </span>
                              ) : (
                                event.price
                              )}
                            </span>
                          </div>
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

                    {event.registered >= event.capacity &&
                      event.waitlist > 0 && (
                        <Button className="w-full" variant="outline">
                          Join Waitlist ({event.waitlist} in line)
                        </Button>
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

            <div className="border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-lg">Share This Event</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <div className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <div className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <div className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <div className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  className="w-full px-3 py-2 border rounded-md pr-16"
                  value={`https://diu-events.com/events/${event.id}`}
                />
                <Button variant="ghost" className="absolute right-0" size="sm">
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
