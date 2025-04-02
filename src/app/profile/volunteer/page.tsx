"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { upcomingEvents } from "@/lib/data";
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";

// Mock volunteer applications for the current user
const mockUserApplications = [
  {
    id: "app1",
    userId: "4", // student user ID
    opportunityId: "v1",
    opportunityTitle: "Technical Assistant",
    eventId: "1",
    eventTitle: "Advanced Machine Learning Workshop",
    eventDate: "2023-06-15",
    eventLocation: "CSE Building, Room 301",
    applicationDate: "2023-05-15T10:30:00Z",
    status: "pending",
    feedback: null,
  },
  {
    id: "app2",
    userId: "4", // student user ID
    opportunityId: "v5",
    opportunityTitle: "Company Liaison",
    eventId: "5",
    eventTitle: "Career Fair 2023",
    eventDate: "2023-07-05",
    eventLocation: "DIU Convention Center",
    applicationDate: "2023-05-18T14:45:00Z",
    status: "approved",
    feedback:
      "Your communication skills and previous experience make you a great fit for this role.",
  },
  {
    id: "app3",
    userId: "4", // student user ID
    opportunityId: "v3",
    opportunityTitle: "Registration Desk",
    eventId: "2",
    eventTitle: "Annual Cultural Festival 2023",
    eventDate: "2023-06-20",
    eventLocation: "DIU Auditorium",
    applicationDate: "2023-05-20T09:15:00Z",
    status: "rejected",
    feedback:
      "We received many applications and had to prioritize candidates with previous experience in similar roles.",
  },
];

export default function VolunteerApplicationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) return null;

  // Filter applications based on the active tab
  const filteredApplications = mockUserApplications.filter((app) => {
    if (activeTab === "all") return true;
    return app.status === activeTab;
  });

  // Get event details for an application
  const getEventDetails = (eventId: string) => {
    return upcomingEvents.find((event) => event.id === eventId);
  };

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Volunteer Applications</h1>
            <p className="text-muted-foreground mt-1">
              Track the status of your volunteer applications
            </p>
          </div>
          <Button className="mt-4 md:mt-0" asChild>
            <Link href="/events">Browse Events</Link>
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredApplications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <AlertCircle className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    No applications found
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    {activeTab === "all"
                      ? "You haven't applied for any volunteer positions yet."
                      : `You don't have any ${activeTab} volunteer applications.`}
                  </p>
                  <Button asChild>
                    <Link href="/events">Browse Events</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredApplications.map((application) => {
                  const event = getEventDetails(application.eventId);

                  return (
                    <Card key={application.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant={
                                    application.status === "approved"
                                      ? "default"
                                      : application.status === "pending"
                                      ? "outline"
                                      : "destructive"
                                  }
                                >
                                  {application.status.charAt(0).toUpperCase() +
                                    application.status.slice(1)}
                                </Badge>
                                <Badge variant="outline">
                                  {application.opportunityTitle}
                                </Badge>
                              </div>
                              <h3 className="text-xl font-semibold">
                                {application.eventTitle}
                              </h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Applied on{" "}
                              {new Date(
                                application.applicationDate
                              ).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{application.eventDate}</span>
                            </div>
                            {event && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{event.time}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{application.eventLocation}</span>
                            </div>
                          </div>

                          {application.feedback && (
                            <div
                              className={`p-3 rounded-md ${
                                application.status === "approved"
                                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">
                                <span className="font-medium">Feedback: </span>
                                {application.feedback}
                              </p>
                            </div>
                          )}

                          <div className="flex justify-end mt-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/events/${application.eventId}`}>
                                View Event
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
