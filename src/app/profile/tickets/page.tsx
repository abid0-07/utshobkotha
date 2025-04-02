"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Download,
  QrCode,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { userRegistrations, upcomingEvents } from "@/lib/data";

export default function UserTicketsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) return null;

  // Get user's registrations and match with events
  const userTickets = userRegistrations
    .filter((reg) => reg.userId === user.id)
    .map((reg) => {
      const event = upcomingEvents.find((e) => e.id === reg.eventId);
      return { ...reg, event };
    });

  const upcomingTickets = userTickets.filter((ticket) => {
    if (!ticket.event) return false;
    const eventDate = new Date(ticket.event.date);
    return eventDate >= new Date();
  });

  const pastTickets = userTickets.filter((ticket) => {
    if (!ticket.event) return false;
    const eventDate = new Date(ticket.event.date);
    return eventDate < new Date();
  });

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Tickets</h1>

        <Tabs defaultValue="upcoming">
          <TabsList className="mb-8">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingTickets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Ticket className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    No upcoming tickets
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    You don't have any tickets for upcoming events. Browse
                    events to register.
                  </p>
                  <Button asChild>
                    <Link href="/events">Browse Events</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {upcomingTickets.map(
                  (ticket) =>
                    ticket.event && (
                      <Card key={ticket.id} className="overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                          <div className="relative h-48 lg:h-auto lg:w-72">
                            <Image
                              src={ticket.event.image || "/placeholder.svg"}
                              alt={ticket.event.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-3 right-3">
                              <Badge>{ticket.event.category}</Badge>
                            </div>
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex flex-col lg:flex-row gap-6 justify-between">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">
                                  {ticket.event.title}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-muted-foreground mb-4">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{ticket.event.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{ticket.event.time}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{ticket.event.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="h-4 w-4" />
                                    <span>Ticket #{ticket.ticketCode}</span>
                                  </div>
                                </div>
                                <div className="space-x-3">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1"
                                  >
                                    <QrCode className="h-4 w-4" /> Show QR Code
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1"
                                  >
                                    <Download className="h-4 w-4" /> Download
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-6 lg:mt-0 flex flex-col items-start lg:items-end">
                                <Badge variant="outline" className="mb-2">
                                  {ticket.status}
                                </Badge>
                                <Button variant="secondary" size="sm" asChild>
                                  <Link href={`/events/${ticket.event.id}`}>
                                    <ExternalLink className="mr-2 h-4 w-4" />{" "}
                                    View Event
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastTickets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Ticket className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No past tickets</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    You don't have any tickets for past events.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {pastTickets.map(
                  (ticket) =>
                    ticket.event && (
                      <Card
                        key={ticket.id}
                        className="overflow-hidden opacity-70"
                      >
                        <div className="flex flex-col lg:flex-row">
                          <div className="relative h-48 lg:h-auto lg:w-72">
                            <Image
                              src={ticket.event.image || "/placeholder.svg"}
                              alt={ticket.event.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-3 right-3">
                              <Badge variant="secondary">
                                {ticket.event.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex flex-col lg:flex-row gap-6 justify-between">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">
                                  {ticket.event.title}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-muted-foreground mb-4">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{ticket.event.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{ticket.event.time}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{ticket.event.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="h-4 w-4" />
                                    <span>Ticket #{ticket.ticketCode}</span>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1"
                                >
                                  <Download className="h-4 w-4" /> Certificate
                                </Button>
                              </div>
                              <div className="mt-6 lg:mt-0 flex flex-col items-start lg:items-end">
                                <Badge variant="outline" className="mb-2">
                                  Attended
                                </Badge>
                                <Button variant="secondary" size="sm" asChild>
                                  <Link href={`/events/${ticket.event.id}`}>
                                    <ExternalLink className="mr-2 h-4 w-4" />{" "}
                                    View Event
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Ticket(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}
