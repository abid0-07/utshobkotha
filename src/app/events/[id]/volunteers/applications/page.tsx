"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { upcomingEvents, volunteerOpportunities } from "@/lib/data";
import { Search, Check, X, Eye, ArrowLeft, Loader2 } from "lucide-react";

// Mock volunteer applications data
const mockApplications = [
  {
    id: "app1",
    userId: "4",
    name: "Student User",
    email: "student@diu.edu",
    department: "Computer Science",
    image: "/placeholder.svg?height=40&width=40",
    opportunityId: "v1",
    opportunityTitle: "Technical Assistant",
    eventId: "1",
    motivation:
      "I have experience with technical workshops and can assist participants effectively. I've volunteered at three similar events in the past and received positive feedback.",
    skills: "Technical troubleshooting, Audio/Visual setup, Public speaking",
    availability: "full",
    applicationDate: "2023-05-15T10:30:00Z",
    status: "pending",
  },
  {
    id: "app2",
    userId: "5",
    name: "Jane Smith",
    email: "jane@diu.edu",
    department: "Business",
    image: "/placeholder.svg?height=40&width=40",
    opportunityId: "v2",
    opportunityTitle: "Stage Management",
    eventId: "1",
    motivation:
      "I'm passionate about event management and would love to gain more experience in stage coordination. I've been part of the drama club for 2 years.",
    skills: "Organization, Time management, Leadership",
    availability: "full",
    applicationDate: "2023-05-16T14:45:00Z",
    status: "pending",
  },
  {
    id: "app3",
    userId: "6",
    name: "Robert Johnson",
    email: "robert@diu.edu",
    department: "Engineering",
    image: "/placeholder.svg?height=40&width=40",
    opportunityId: "v1",
    opportunityTitle: "Technical Assistant",
    eventId: "1",
    motivation:
      "I'm skilled in technical setup and troubleshooting. I'd like to volunteer for this position to apply my knowledge and help make the event successful.",
    skills: "Electronics, Computer networking, Problem-solving",
    availability: "morning",
    applicationDate: "2023-05-17T09:15:00Z",
    status: "approved",
  },
  {
    id: "app4",
    userId: "7",
    name: "Emily Davis",
    email: "emily@diu.edu",
    department: "Arts",
    image: "/placeholder.svg?height=40&width=40",
    opportunityId: "v2",
    opportunityTitle: "Stage Management",
    eventId: "1",
    motivation:
      "I want to gain experience in event management and this seems like a great opportunity. I've organized several small events for my department.",
    skills: "Creative direction, Team coordination, Public speaking",
    availability: "afternoon",
    applicationDate: "2023-05-18T16:20:00Z",
    status: "rejected",
    rejectionReason: "Limited availability doesn't match our requirements",
  },
  {
    id: "app5",
    userId: "8",
    name: "Michael Brown",
    email: "michael@diu.edu",
    department: "Computer Science",
    image: "/placeholder.svg?height=40&width=40",
    opportunityId: "v3",
    opportunityTitle: "Registration Desk",
    eventId: "1",
    motivation:
      "I'm organized and enjoy interacting with people. I'd be a great fit for the registration desk.",
    skills: "Communication, Organization, Attention to detail",
    availability: "full",
    applicationDate: "2023-05-19T11:30:00Z",
    status: "pending",
  },
];

export default function VolunteerApplicationsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if not organizer, faculty or admin
  useEffect(() => {
    if (
      user &&
      user.role !== "organizer" &&
      user.role !== "faculty" &&
      user.role !== "admin"
    ) {
      router.push(`/events/${id}`);
    } else if (!user) {
      router.push("/auth/login");
    }
  }, [user, router, id]);

  if (
    !user ||
    (user.role !== "organizer" &&
      user.role !== "faculty" &&
      user.role !== "admin")
  )
    return null;

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

  // Get volunteer opportunities for this event
  const eventVolunteerOpportunities = volunteerOpportunities.filter(
    (opp) => opp.eventId === id
  );

  // Filter applications based on search term and filters
  const filteredApplications = mockApplications
    .filter((app) => app.eventId === id)
    .filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.opportunityTitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;
      const matchesPosition =
        positionFilter === "all" || app.opportunityId === positionFilter;

      return matchesSearch && matchesStatus && matchesPosition;
    });

  const getSelectedApplication = () => {
    return mockApplications.find((app) => app.id === selectedApplication);
  };

  const handleApprove = async (applicationId: string) => {
    setIsProcessing(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Application Approved",
        description:
          "The volunteer application has been approved successfully.",
      });

      // In a real app, we would update the application status in the database
      // For now, we'll just close the dialog
      setIsViewDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Action failed",
        description:
          "There was an error approving the application. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        variant: "destructive",
        title: "Reason required",
        description: "Please provide a reason for rejection.",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Application Rejected",
        description: "The volunteer application has been rejected.",
      });

      // In a real app, we would update the application status in the database
      setIsRejectDialogOpen(false);
      setIsViewDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Action failed",
        description:
          "There was an error rejecting the application. Please try again.",
      });
    } finally {
      setIsProcessing(false);
      setRejectionReason("");
    }
  };

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {event.title} - Volunteer Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and manage volunteer applications for this event
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/events/${id}/volunteers`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Volunteers
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Applications</CardTitle>
              <CardDescription>
                Review and manage volunteer applications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {eventVolunteerOpportunities.map((opp) => (
                  <SelectItem key={opp.id} value={opp.id}>
                    {opp.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium">Applicant</th>
                  <th className="py-3 px-4 text-left font-medium">Position</th>
                  <th className="py-3 px-4 text-left font-medium">
                    Applied On
                  </th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No applications found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => (
                    <tr key={application.id} className="border-b">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={application.image}
                              alt={application.name}
                            />
                            <AvatarFallback>
                              {application.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{application.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {application.department}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {application.opportunityTitle}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(
                          application.applicationDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
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
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => {
                              setSelectedApplication(application.id);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>

                          {application.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="h-8"
                                onClick={() => handleApprove(application.id)}
                              >
                                <Check className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-destructive"
                                onClick={() => {
                                  setSelectedApplication(application.id);
                                  setIsRejectDialogOpen(true);
                                }}
                              >
                                <X className="h-4 w-4 mr-1" /> Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">{filteredApplications.length}</span>{" "}
              of{" "}
              <span className="font-medium">
                {mockApplications.filter((app) => app.eventId === id).length}
              </span>{" "}
              applications
            </p>
          </div>
        </CardContent>
      </Card>

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Volunteer Application</DialogTitle>
            <DialogDescription>
              Application details for{" "}
              {getSelectedApplication()?.opportunityTitle}
            </DialogDescription>
          </DialogHeader>

          {getSelectedApplication() && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={getSelectedApplication()?.image}
                    alt={getSelectedApplication()?.name}
                  />
                  <AvatarFallback>
                    {getSelectedApplication()?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">
                    {getSelectedApplication()?.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {getSelectedApplication()?.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getSelectedApplication()?.department}
                  </p>
                </div>
                <Badge
                  className="ml-auto"
                  variant={
                    getSelectedApplication()?.status === "approved"
                      ? "default"
                      : getSelectedApplication()?.status === "pending"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {getSelectedApplication()?.status.charAt(0).toUpperCase() +
                    getSelectedApplication()?.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-1">Position</h4>
                  <p>{getSelectedApplication()?.opportunityTitle}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Application Date</h4>
                  <p>
                    {new Date(
                      getSelectedApplication()?.applicationDate || ""
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Motivation</h4>
                <div className="bg-muted/50 p-3 rounded-md">
                  <p>{getSelectedApplication()?.motivation}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Skills</h4>
                <div className="bg-muted/50 p-3 rounded-md">
                  <p>{getSelectedApplication()?.skills}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Availability</h4>
                <p>
                  {getSelectedApplication()?.availability === "full"
                    ? "Full Event"
                    : getSelectedApplication()?.availability === "morning"
                    ? "Morning Only"
                    : getSelectedApplication()?.availability === "afternoon"
                    ? "Afternoon Only"
                    : "Custom Hours"}
                </p>
              </div>

              {getSelectedApplication()?.status === "rejected" &&
                getSelectedApplication()?.rejectionReason && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">
                      Rejection Reason
                    </h4>
                    <div className="bg-destructive/10 p-3 rounded-md text-destructive">
                      <p>{getSelectedApplication()?.rejectionReason}</p>
                    </div>
                  </div>
                )}
            </div>
          )}

          <DialogFooter>
            {getSelectedApplication()?.status === "pending" ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsRejectDialogOpen(true);
                  }}
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button
                  onClick={() =>
                    handleApprove(getSelectedApplication()?.id || "")
                  }
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Application Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Volunteer Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Reason for Rejection</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Provide a reason for rejection..."
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                This reason will be shared with the applicant.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Reject Application"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
