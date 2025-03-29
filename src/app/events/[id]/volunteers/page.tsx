"use client"

import type React from "react"

import { Textarea } from "@/components/ui/textarea"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { upcomingEvents, volunteerOpportunities } from "@/lib/data"
import { Search, Download, Check, X, Eye } from "lucide-react"

export default function EventVolunteersPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [positionFilter, setPositionFilter] = useState("all")
  const [selectedVolunteer, setSelectedVolunteer] = useState<string | null>(null)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

  // Redirect if not organizer, faculty or admin
  useEffect(() => {
    if (user && user.role !== "organizer" && user.role !== "faculty" && user.role !== "admin") {
      router.push(`/events/${id}`)
    } else if (!user) {
      router.push("/auth/login")
    }
  }, [user, router, id])

  if (!user || (user.role !== "organizer" && user.role !== "faculty" && user.role !== "admin")) return null

  // Find the event with the matching ID
  const event = upcomingEvents.find((e) => e.id === id)

  // If the event doesn't exist, redirect to 404
  if (!event) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-8">The event you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/events")}>Browse Events</Button>
      </div>
    )
  }

  // Get volunteer opportunities for this event
  const eventVolunteerOpportunities = volunteerOpportunities.filter((opp) => opp.eventId === id)

  // Mock volunteer applications
  const mockVolunteerApplications = [
    {
      id: "va1",
      userId: "4",
      name: "Student User",
      email: "student@diu.edu",
      department: "Computer Science",
      opportunityId: "v1",
      position: "Technical Assistant",
      applicationDate: "2023-05-15",
      status: "Approved",
      message: "I have experience with technical workshops and can assist participants effectively.",
    },
    {
      id: "va2",
      userId: "5",
      name: "John Doe",
      email: "john@diu.edu",
      department: "Business",
      opportunityId: "v2",
      position: "Stage Management",
      applicationDate: "2023-05-16",
      status: "Pending",
      message: "I've managed stage events before and would love to help with this event.",
    },
    {
      id: "va3",
      userId: "6",
      name: "Jane Smith",
      email: "jane@diu.edu",
      department: "Engineering",
      opportunityId: "v1",
      position: "Technical Assistant",
      applicationDate: "2023-05-17",
      status: "Pending",
      message: "I'm skilled in technical setup and troubleshooting. I'd like to volunteer for this position.",
    },
    {
      id: "va4",
      userId: "7",
      name: "Robert Johnson",
      email: "robert@diu.edu",
      department: "Arts",
      opportunityId: "v2",
      position: "Stage Management",
      applicationDate: "2023-05-18",
      status: "Rejected",
      message: "I want to gain experience in event management and this seems like a great opportunity.",
    },
    {
      id: "va5",
      userId: "8",
      name: "Emily Davis",
      email: "emily@diu.edu",
      department: "Computer Science",
      opportunityId: "v3",
      position: "Registration Desk",
      applicationDate: "2023-05-19",
      status: "Approved",
      message: "I'm organized and enjoy interacting with people. I'd be a great fit for the registration desk.",
    },
  ]

  // Filter applications based on search term and filters
  const filteredApplications = mockVolunteerApplications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesPosition = positionFilter === "all" || app.position === positionFilter

    return matchesSearch && matchesStatus && matchesPosition
  })

  const handleApprove = (applicationId: string) => {
    toast({
      title: "Volunteer Approved",
      description: "The volunteer application has been approved successfully.",
    })
  }

  const handleReject = (applicationId: string) => {
    setIsRejectDialogOpen(false)
    toast({
      title: "Volunteer Rejected",
      description: "The volunteer application has been rejected.",
    })
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{event.title} - Volunteers</h1>
          <p className="text-muted-foreground mt-1">Manage volunteer applications for this event</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" asChild>
            <Link href={`/events/${id}`}>Back to Event</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="applications">
        <TabsList className="mb-8">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="approved">Approved Volunteers</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Volunteer Applications</CardTitle>
                  <CardDescription>Review and manage volunteer applications</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
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
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
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
                      <SelectItem key={opp.id} value={opp.title}>
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
                      <th className="py-3 px-4 text-left font-medium">Applied On</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                      <th className="py-3 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-muted-foreground">
                          No applications found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((application) => (
                        <tr key={application.id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{application.name}</p>
                                <p className="text-xs text-muted-foreground">{application.department}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{application.position}</td>
                          <td className="py-3 px-4">{application.applicationDate}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                application.status === "Approved"
                                  ? "default"
                                  : application.status === "Pending"
                                    ? "outline"
                                    : "destructive"
                              }
                            >
                              {application.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="h-8">
                                    <Eye className="h-4 w-4 mr-1" /> View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Volunteer Application</DialogTitle>
                                    <DialogDescription>
                                      Application details for {application.position}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-12 w-12">
                                        <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">{application.name}</p>
                                        <p className="text-sm text-muted-foreground">{application.email}</p>
                                        <p className="text-sm text-muted-foreground">{application.department}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium mb-1">Position</p>
                                      <p>{application.position}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium mb-1">Application Date</p>
                                      <p>{application.applicationDate}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium mb-1">Motivation</p>
                                      <p className="text-sm">{application.message}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium mb-1">Status</p>
                                      <Badge
                                        variant={
                                          application.status === "Approved"
                                            ? "default"
                                            : application.status === "Pending"
                                              ? "outline"
                                              : "destructive"
                                        }
                                      >
                                        {application.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    {application.status === "Pending" && (
                                      <>
                                        <Button variant="outline" onClick={() => setIsRejectDialogOpen(true)}>
                                          <X className="h-4 w-4 mr-1" /> Reject
                                        </Button>
                                        <Button onClick={() => handleApprove(application.id)}>
                                          <Check className="h-4 w-4 mr-1" /> Approve
                                        </Button>
                                      </>
                                    )}
                                    {application.status !== "Pending" && <Button variant="outline">Close</Button>}
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              {application.status === "Pending" && (
                                <>
                                  <Button size="sm" className="h-8" onClick={() => handleApprove(application.id)}>
                                    <Check className="h-4 w-4 mr-1" /> Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-destructive"
                                    onClick={() => {
                                      setSelectedVolunteer(application.id)
                                      setIsRejectDialogOpen(true)
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
                  Showing <span className="font-medium">{filteredApplications.length}</span> of{" "}
                  <span className="font-medium">{mockVolunteerApplications.length}</span> applications
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Volunteer Positions</CardTitle>
                  <CardDescription>Manage volunteer positions for this event</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Position
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventVolunteerOpportunities.map((position) => (
                  <div key={position.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium">{position.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{position.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {position.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <Badge variant={position.status === "Open" ? "default" : "secondary"}>{position.status}</Badge>
                        <p className="text-sm">
                          <span className="font-medium">{position.applied}</span>
                          <span className="text-muted-foreground"> of </span>
                          <span className="font-medium">{position.slots}</span>
                          <span className="text-muted-foreground"> positions filled</span>
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive">
                            Close
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Approved Volunteers</CardTitle>
                  <CardDescription>List of approved volunteers for this event</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export List
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Volunteer</th>
                      <th className="py-3 px-4 text-left font-medium">Position</th>
                      <th className="py-3 px-4 text-left font-medium">Department</th>
                      <th className="py-3 px-4 text-left font-medium">Contact</th>
                      <th className="py-3 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockVolunteerApplications
                      .filter((app) => app.status === "Approved")
                      .map((volunteer) => (
                        <tr key={volunteer.id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{volunteer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{volunteer.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{volunteer.position}</td>
                          <td className="py-3 px-4">{volunteer.department}</td>
                          <td className="py-3 px-4">{volunteer.email}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-8">
                                <Mail className="h-4 w-4 mr-1" /> Contact
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 text-destructive">
                                <X className="h-4 w-4 mr-1" /> Remove
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Volunteer Application</DialogTitle>
            <DialogDescription>Are you sure you want to reject this volunteer application?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Reason (Optional)</Label>
              <Textarea id="rejection-reason" placeholder="Provide a reason for rejection..." rows={3} />
              <p className="text-xs text-muted-foreground">This reason will be shared with the applicant.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleReject(selectedVolunteer || "")}>
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Plus({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function Mail({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

