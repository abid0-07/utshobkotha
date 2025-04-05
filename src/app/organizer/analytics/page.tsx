"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { upcomingEvents } from "@/lib/data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Calendar, Users, TrendingUp, Clock, MapPin, Download, Filter, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function OrganizerAnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  // Redirect if not organizer or admin
  useEffect(() => {
    if (user && user.role !== "organizer" && user.role !== "admin") {
      router.push("/")
    } else if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user || (user.role !== "organizer" && user.role !== "admin")) return null

  // Get organizer's events
  const organizerEvents = upcomingEvents.filter(
    (event) => event.organizer.id === "org1" || event.organizer.id === "org2",
  )

  // Get selected event data
  const eventData = selectedEvent ? upcomingEvents.find((event) => event.id === selectedEvent) : organizerEvents[0]

  // Mock data for event analytics
  const mockEventAnalytics = {
    registrationsByDay: [
      { date: "2023-05-01", count: 5 },
      { date: "2023-05-02", count: 8 },
      { date: "2023-05-03", count: 12 },
      { date: "2023-05-04", count: 10 },
      { date: "2023-05-05", count: 15 },
      { date: "2023-05-06", count: 20 },
      { date: "2023-05-07", count: 18 },
    ],
    attendeesByDepartment: [
      { name: "Computer Science", value: 35 },
      { name: "Business", value: 25 },
      { name: "Engineering", value: 20 },
      { name: "Arts", value: 15 },
      { name: "Others", value: 5 },
    ],
    registrationStatus: [
      { name: "Confirmed", value: 75 },
      { name: "Pending", value: 15 },
      { name: "Cancelled", value: 10 },
    ],
    ticketSales: [
      { name: "Standard", value: 60, revenue: 12000 },
      { name: "VIP", value: 25, revenue: 10000 },
      { name: "Early Bird", value: 15, revenue: 2250 },
    ],
    volunteerStats: {
      total: 15,
      approved: 10,
      pending: 5,
      byDepartment: [
        { name: "Computer Science", value: 6 },
        { name: "Business", value: 4 },
        { name: "Engineering", value: 3 },
        { name: "Arts", value: 2 },
      ],
    },
  }

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Event Analytics</h1>
          <p className="text-muted-foreground mt-1">Track and analyze your event performance</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Select value={selectedEvent || ""} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {organizerEvents.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {eventData && (
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold">{eventData.title}</h2>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center text-muted-foreground gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{eventData.date}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{eventData.time}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{eventData.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground gap-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {eventData.registered} registered of {eventData.capacity} capacity
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{eventData.category}</Badge>
                  {eventData.price === "Free" ? (
                    <Badge variant="secondary">Free</Badge>
                  ) : (
                    <Badge variant="secondary">{eventData.price}</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registrations</p>
                <h3 className="text-3xl font-bold mt-1">{eventData?.registered || 0}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge
                variant="outline"
                className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800"
              >
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                {Math.round(((eventData?.registered || 0) / (eventData?.capacity || 1)) * 100)}% filled
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Volunteers</p>
                <h3 className="text-3xl font-bold mt-1">
                  {mockEventAnalytics.volunteerStats.approved}/{mockEventAnalytics.volunteerStats.total}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge
                variant="outline"
                className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800"
              >
                {mockEventAnalytics.volunteerStats.pending} pending applications
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <h3 className="text-3xl font-bold mt-1">
                  {eventData?.price === "Free"
                    ? "0 BDT"
                    : `${Number.parseInt(eventData?.price?.split(" ")[0] || "0") * (eventData?.registered || 0)} BDT`}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge
                variant="outline"
                className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800"
              >
                {eventData?.price === "Free" ? "Free Event" : "Paid Event"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Registration Trend</CardTitle>
                <CardDescription>Daily registration count over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={mockEventAnalytics.registrationsByDay}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendees by Department</CardTitle>
                <CardDescription>Distribution of attendees across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockEventAnalytics.attendeesByDepartment}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockEventAnalytics.attendeesByDepartment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registration Status</CardTitle>
                <CardDescription>Status of event registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockEventAnalytics.registrationStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockEventAnalytics.registrationStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ticket Sales</CardTitle>
                <CardDescription>Breakdown of ticket types and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockEventAnalytics.ticketSales}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="value" name="Tickets Sold" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="revenue" name="Revenue (BDT)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="registrations">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Registration List</CardTitle>
                  <CardDescription>All registrations for this event</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> Filter
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Name</th>
                      <th className="py-3 px-4 text-left font-medium">Email</th>
                      <th className="py-3 px-4 text-left font-medium">Department</th>
                      <th className="py-3 px-4 text-left font-medium">Registration Date</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: 1,
                        name: "John Doe",
                        email: "john@diu.edu",
                        department: "Computer Science",
                        date: "2023-05-01",
                        status: "Confirmed",
                      },
                      {
                        id: 2,
                        name: "Jane Smith",
                        email: "jane@diu.edu",
                        department: "Business",
                        date: "2023-05-02",
                        status: "Confirmed",
                      },
                      {
                        id: 3,
                        name: "Robert Johnson",
                        email: "robert@diu.edu",
                        department: "Engineering",
                        date: "2023-05-03",
                        status: "Pending",
                      },
                      {
                        id: 4,
                        name: "Emily Davis",
                        email: "emily@diu.edu",
                        department: "Arts",
                        date: "2023-05-03",
                        status: "Confirmed",
                      },
                      {
                        id: 5,
                        name: "Michael Brown",
                        email: "michael@diu.edu",
                        department: "Computer Science",
                        date: "2023-05-04",
                        status: "Cancelled",
                      },
                    ].map((registration) => (
                      <tr key={registration.id} className="border-b">
                        <td className="py-3 px-4">{registration.name}</td>
                        <td className="py-3 px-4">{registration.email}</td>
                        <td className="py-3 px-4">{registration.department}</td>
                        <td className="py-3 px-4">{registration.date}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              registration.status === "Confirmed"
                                ? "default"
                                : registration.status === "Pending"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {registration.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">5</span> of <span className="font-medium">25</span>{" "}
                  registrations
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

        <TabsContent value="volunteers">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Volunteer Management</CardTitle>
                  <CardDescription>Manage volunteer applications for this event</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select defaultValue="all">
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
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Name</th>
                      <th className="py-3 px-4 text-left font-medium">Email</th>
                      <th className="py-3 px-4 text-left font-medium">Department</th>
                      <th className="py-3 px-4 text-left font-medium">Position</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                      <th className="py-3 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: 1,
                        name: "Alex Johnson",
                        email: "alex@diu.edu",
                        department: "Computer Science",
                        position: "Registration Desk",
                        status: "Approved",
                      },
                      {
                        id: 2,
                        name: "Sarah Williams",
                        email: "sarah@diu.edu",
                        department: "Business",
                        position: "Technical Support",
                        status: "Approved",
                      },
                      {
                        id: 3,
                        name: "David Lee",
                        email: "david@diu.edu",
                        department: "Engineering",
                        position: "Stage Management",
                        status: "Pending",
                      },
                      {
                        id: 4,
                        name: "Lisa Chen",
                        email: "lisa@diu.edu",
                        department: "Arts",
                        position: "Registration Desk",
                        status: "Pending",
                      },
                      {
                        id: 5,
                        name: "Mark Wilson",
                        email: "mark@diu.edu",
                        department: "Computer Science",
                        position: "Technical Support",
                        status: "Rejected",
                      },
                    ].map((volunteer) => (
                      <tr key={volunteer.id} className="border-b">
                        <td className="py-3 px-4">{volunteer.name}</td>
                        <td className="py-3 px-4">{volunteer.email}</td>
                        <td className="py-3 px-4">{volunteer.department}</td>
                        <td className="py-3 px-4">{volunteer.position}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              volunteer.status === "Approved"
                                ? "default"
                                : volunteer.status === "Pending"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {volunteer.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {volunteer.status === "Pending" ? (
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-8">
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 text-destructive">
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" className="h-8">
                              <ChevronDown className="h-4 w-4 mr-1" /> Actions
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">5</span> of <span className="font-medium">15</span> volunteers
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

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Analysis</CardTitle>
              <CardDescription>Analysis of attendee feedback for this event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Overall Rating</h3>
                  <div className="flex items-center gap-4">
                    <div className="h-32 w-32 rounded-full border-8 border-primary flex items-center justify-center">
                      <span className="text-4xl font-bold">4.7</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Based on 42 responses</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">5 stars</span>
                          <div className="h-2 bg-muted rounded-full w-32">
                            <div className="h-2 bg-primary rounded-full" style={{ width: "70%" }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">70%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">4 stars</span>
                          <div className="h-2 bg-muted rounded-full w-32">
                            <div className="h-2 bg-primary rounded-full" style={{ width: "20%" }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">20%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">3 stars</span>
                          <div className="h-2 bg-muted rounded-full w-32">
                            <div className="h-2 bg-primary rounded-full" style={{ width: "5%" }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">5%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">2 stars</span>
                          <div className="h-2 bg-muted rounded-full w-32">
                            <div className="h-2 bg-primary rounded-full" style={{ width: "3%" }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">3%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">1 star</span>
                          <div className="h-2 bg-muted rounded-full w-32">
                            <div className="h-2 bg-primary rounded-full" style={{ width: "2%" }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">2%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Category Ratings</h3>
                  <div className="space-y-4">
                    {[
                      { category: "Content Quality", rating: 4.8 },
                      { category: "Speaker Quality", rating: 4.9 },
                      { category: "Organization", rating: 4.5 },
                      { category: "Venue", rating: 4.3 },
                      { category: "Value for Money", rating: 4.6 },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span>{item.category}</span>
                          <span className="font-medium">{item.rating}/5.0</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{ width: `${(item.rating / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Recent Comments</h3>
                <div className="space-y-4">
                  {[
                    {
                      name: "John D.",
                      comment:
                        "Excellent event! The speakers were very knowledgeable and the content was relevant to my field.",
                      rating: 5,
                    },
                    {
                      name: "Sarah M.",
                      comment: "Well organized event. I particularly enjoyed the networking opportunities.",
                      rating: 4,
                    },
                    {
                      name: "David L.",
                      comment: "The content was good but the venue was a bit crowded. Overall a positive experience.",
                      rating: 4,
                    },
                    { name: "Emily R.", comment: "Great event! Would definitely attend again next year.", rating: 5 },
                  ].map((feedback, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{feedback.name}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${i < feedback.rating ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

