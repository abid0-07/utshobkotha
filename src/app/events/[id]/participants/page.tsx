"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { upcomingEvents } from "@/lib/data"
import { Search, Download, Mail } from "lucide-react"

export default function EventParticipantsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")

  // Check if user is a volunteer for this event
  const isVolunteer =
    user &&
    [
      { id: "4", name: "Student User", email: "student@diu.edu" },
      { id: "5", name: "Emily Davis", email: "emily@diu.edu" },
    ].some((volunteer) => volunteer.id === user.id)

  // Redirect if not organizer, faculty, admin or volunteer
  useEffect(() => {
    if (user && user.role !== "organizer" && user.role !== "faculty" && user.role !== "admin" && !isVolunteer) {
      router.push(`/events/${id}`)
    } else if (!user) {
      router.push("/auth/login")
    }
  }, [user, router, id, isVolunteer])

  if (!user || (user.role !== "organizer" && user.role !== "faculty" && user.role !== "admin" && !isVolunteer))
    return null

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

  // Mock participant data
  const mockParticipants = [
    {
      id: "p1",
      userId: "4",
      name: "Student User",
      email: "student@diu.edu",
      department: "Computer Science",
      registrationDate: "2023-05-20",
      status: "Confirmed",
      ticketType: "Standard",
    },
    {
      id: "p2",
      name: "Jane Smith",
      email: "jane@diu.edu",
      department: "Business",
      registrationDate: "2023-05-21",
      status: "Confirmed",
      ticketType: "Standard",
    },
    {
      id: "p3",
      name: "Robert Johnson",
      email: "robert@diu.edu",
      department: "Engineering",
      registrationDate: "2023-05-22",
      status: "Confirmed",
      ticketType: "VIP",
    },
    {
      id: "p4",
      name: "Emily Davis",
      email: "emily@diu.edu",
      department: "Arts",
      registrationDate: "2023-05-23",
      status: "Confirmed",
      ticketType: "Standard",
    },
    {
      id: "p5",
      name: "Michael Brown",
      email: "michael@diu.edu",
      department: "Computer Science",
      registrationDate: "2023-05-24",
      status: "Pending",
      ticketType: "Standard",
    },
    {
      id: "p6",
      name: "Sarah Wilson",
      email: "sarah@diu.edu",
      department: "Business",
      registrationDate: "2023-05-25",
      status: "Confirmed",
      ticketType: "VIP",
    },
    {
      id: "p7",
      name: "David Lee",
      email: "david@diu.edu",
      department: "Engineering",
      registrationDate: "2023-05-26",
      status: "Cancelled",
      ticketType: "Standard",
    },
    {
      id: "p8",
      name: "Lisa Chen",
      email: "lisa@diu.edu",
      department: "Arts",
      registrationDate: "2023-05-27",
      status: "Confirmed",
      ticketType: "Standard",
    },
    {
      id: "p9",
      name: "James Taylor",
      email: "james@diu.edu",
      department: "Computer Science",
      registrationDate: "2023-05-28",
      status: "Confirmed",
      ticketType: "Standard",
    },
    {
      id: "p10",
      name: "Jennifer Garcia",
      email: "jennifer@diu.edu",
      department: "Business",
      registrationDate: "2023-05-29",
      status: "Confirmed",
      ticketType: "Standard",
    },
  ]

  // Filter participants based on search term
  const filteredParticipants = mockParticipants.filter((participant) => {
    return (
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{event.title} - Participants</h1>
          <p className="text-muted-foreground mt-1">View and manage event participants</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/events/${id}`}>Back to Event</Link>
          </Button>
          {(user.role === "organizer" || user.role === "faculty" || user.role === "admin") && (
            <Button variant="outline" asChild>
              <Link href={`/events/${id}/volunteers`}>Manage Volunteers</Link>
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Participant List</CardTitle>
              <CardDescription>
                {isVolunteer
                  ? "As a volunteer, you can view the list of participants for this event"
                  : "View and manage participants for this event"}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export List
              </Button>
              {(user.role === "organizer" || user.role === "admin") && (
                <Button>
                  <Mail className="mr-2 h-4 w-4" /> Email All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search participants..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Badge className="h-9 px-4 flex items-center gap-1">
                <span className="font-normal text-xs">Total:</span> {mockParticipants.length}
              </Badge>
              <Badge variant="outline" className="h-9 px-4 flex items-center gap-1">
                <span className="font-normal text-xs">Confirmed:</span>{" "}
                {mockParticipants.filter((p) => p.status === "Confirmed").length}
              </Badge>
            </div>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium">Participant</th>
                  <th className="py-3 px-4 text-left font-medium">Department</th>
                  <th className="py-3 px-4 text-left font-medium">Registration Date</th>
                  <th className="py-3 px-4 text-left font-medium">Ticket Type</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  {(user.role === "organizer" || user.role === "faculty" || user.role === "admin") && (
                    <th className="py-3 px-4 text-left font-medium">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.length === 0 ? (
                  <tr>
                    <td
                      colSpan={user.role === "organizer" || user.role === "faculty" || user.role === "admin" ? 6 : 5}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No participants found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map((participant) => (
                    <tr key={participant.id} className="border-b">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <p className="text-xs text-muted-foreground">{participant.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{participant.department}</td>
                      <td className="py-3 px-4">{participant.registrationDate}</td>
                      <td className="py-3 px-4">
                        <Badge variant={participant.ticketType === "VIP" ? "default" : "outline"}>
                          {participant.ticketType}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            participant.status === "Confirmed"
                              ? "default"
                              : participant.status === "Pending"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {participant.status}
                        </Badge>
                      </td>
                      {(user.role === "organizer" || user.role === "faculty" || user.role === "admin") && (
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="h-8">
                              <Mail className="h-4 w-4 mr-1" /> Contact
                            </Button>
                            {participant.status === "Pending" && (
                              <Button size="sm" className="h-8">
                                Confirm
                              </Button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredParticipants.length}</span> of{" "}
              <span className="font-medium">{mockParticipants.length}</span> participants
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
    </div>
  )
}

