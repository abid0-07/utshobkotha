"use client";

import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Settings,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  FileText,
  Bell,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useAuth } from "@/lib/auth-context";
import { upcomingEvents, analyticsData, eventCategories } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/");
    } else if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  // Filter events based on search term and category
  const filteredEvents = upcomingEvents.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? event.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  // Mock user data for the users tab
  const mockUsers = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@diu.edu",
      role: "admin",
      status: "active",
      lastLogin: "2 hours ago",
    },
    {
      id: "2",
      name: "Event Organizer",
      email: "organizer@diu.edu",
      role: "organizer",
      status: "active",
      lastLogin: "1 day ago",
    },
    {
      id: "3",
      name: "Faculty Member",
      email: "faculty@diu.edu",
      role: "faculty",
      status: "active",
      lastLogin: "3 days ago",
    },
    {
      id: "4",
      name: "Student User",
      email: "student@diu.edu",
      role: "student",
      status: "active",
      lastLogin: "5 hours ago",
    },
    {
      id: "5",
      name: "John Doe",
      email: "john@diu.edu",
      role: "student",
      status: "inactive",
      lastLogin: "2 weeks ago",
    },
    {
      id: "6",
      name: "Jane Smith",
      email: "jane@diu.edu",
      role: "faculty",
      status: "active",
      lastLogin: "1 week ago",
    },
    {
      id: "7",
      name: "Robert Johnson",
      email: "robert@diu.edu",
      role: "organizer",
      status: "pending",
      lastLogin: "Never",
    },
  ];

  // Mock notifications for the notification center
  const mockNotifications = [
    {
      id: "1",
      title: "New User Registration",
      message: "John Doe has registered as a student",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: "2",
      title: "Event Created",
      message: "A new event 'AI Workshop' has been created",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      title: "System Update",
      message: "The system will undergo maintenance tonight",
      time: "3 hours ago",
      read: true,
    },
    {
      id: "4",
      title: "Payment Received",
      message: "Payment for 'Cultural Festival' has been received",
      time: "1 day ago",
      read: true,
    },
  ];

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage the event platform
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  {mockNotifications.filter((n) => !n.read).length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-primary"
                >
                  Mark all as read
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[300px]">
                {mockNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`py-3 cursor-pointer ${
                      !notification.read ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <div
                        className={`h-2 w-2 mt-1.5 rounded-full ${
                          !notification.read ? "bg-primary" : "bg-transparent"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center">
                <Link
                  href="/admin/notifications"
                  className="w-full text-center text-sm text-primary"
                >
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Events
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {upcomingEvents.length}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge
                variant="outline"
                className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800"
              >
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                12% increase
              </Badge>
              <span className="text-muted-foreground ml-2">
                from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <h3 className="text-3xl font-bold mt-1">2,478</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge
                variant="outline"
                className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800"
              >
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                8% increase
              </Badge>
              <span className="text-muted-foreground ml-2">
                from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Registrations
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {analyticsData.attendeeStats.totalRegistered}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge
                variant="outline"
                className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800"
              >
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                16% increase
              </Badge>
              <span className="text-muted-foreground ml-2">
                from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Average Attendance
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {analyticsData.attendeeStats.averageAttendanceRate}%
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge
                variant="outline"
                className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800"
              >
                <TrendingDown className="h-3.5 w-3.5 mr-1" />
                3% decrease
              </Badge>
              <span className="text-muted-foreground ml-2">
                from last month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Event Attendance</CardTitle>
                  <CardDescription>
                    Registration vs attendance for recent events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <PieChart className="h-16 w-16 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground ml-4">
                      Chart visualization would go here
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-sm text-muted-foreground">
                      Updated 2 hours ago
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin/analytics">
                        Full Analytics <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attendee Breakdown</CardTitle>
                  <CardDescription>
                    Attendees by department and role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium mb-2">By Department</p>
                      <div className="space-y-2">
                        {analyticsData.attendeeStats.departmentBreakdown.map(
                          (dept, i) => (
                            <div key={i} className="flex items-center">
                              <div className="w-full max-w-md">
                                <div className="flex justify-between mb-1 text-sm">
                                  <span>{dept.department}</span>
                                  <span className="font-medium">
                                    {dept.count}
                                  </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary rounded-full h-2"
                                    style={{
                                      width: `${
                                        (dept.count /
                                          analyticsData.attendeeStats
                                            .totalRegistered) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">By Role</p>
                      <div className="grid grid-cols-2 gap-4">
                        {analyticsData.attendeeStats.roleBreakdown.map(
                          (role, i) => (
                            <div
                              key={i}
                              className="flex flex-col items-center p-4 border rounded-lg"
                            >
                              <span className="text-2xl font-bold mb-1">
                                {role.percentage}%
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {role.role}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>
                    Latest actions on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <div className="px-6 divide-y">
                      {[
                        {
                          action: "Event Created",
                          user: "Event Organizer",
                          time: "10 minutes ago",
                          description:
                            "Created 'Advanced Machine Learning Workshop'",
                        },
                        {
                          action: "User Registered",
                          user: "Student User",
                          time: "25 minutes ago",
                          description:
                            "Registered for 'Annual Cultural Festival 2023'",
                        },
                        {
                          action: "Event Updated",
                          user: "Faculty Member",
                          time: "1 hour ago",
                          description:
                            "Updated details for 'Entrepreneurship Summit'",
                        },
                        {
                          action: "Volunteer Applied",
                          user: "Student User",
                          time: "2 hours ago",
                          description: "Applied for 'Technical Assistant' role",
                        },
                        {
                          action: "Event Cancelled",
                          user: "Admin User",
                          time: "3 hours ago",
                          description: "Cancelled 'Web Development Bootcamp'",
                        },
                        {
                          action: "New User",
                          user: "System",
                          time: "5 hours ago",
                          description:
                            "New user 'Jane Doe' registered on the platform",
                        },
                        {
                          action: "Feedback Submitted",
                          user: "Student User",
                          time: "1 day ago",
                          description:
                            "Submitted feedback for 'Robotics Competition'",
                        },
                      ].map((activity, i) => (
                        <div key={i} className="py-4">
                          <div className="flex justify-between mb-1">
                            <p className="font-medium">{activity.action}</p>
                            <span className="text-xs text-muted-foreground">
                              {activity.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                          <p className="text-xs mt-1">By: {activity.user}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Events in the next 7 days</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {upcomingEvents.slice(0, 3).map((event, i) => (
                      <div key={i} className="p-4">
                        <p className="font-medium">{event.title}</p>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline">
                            {event.registered} / {event.capacity}
                          </Badge>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/events/${event.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href="/events">View All Events</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>All Events</CardTitle>
                  <CardDescription>
                    Manage all events on the platform
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button asChild>
                    <Link href="/events/create">
                      <Calendar className="mr-2 h-4 w-4" /> Create Event
                    </Link>
                  </Button>
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
                    placeholder="Search events..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {eventCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> More Filters
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">
                        Registrations
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-lg font-medium">
                              No events found
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Try adjusting your search or filters
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 rounded-md overflow-hidden">
                                <Image
                                  src={
                                    event.image ||
                                    "/placeholder.svg?width=40&height=40"
                                  }
                                  alt={event.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{event.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {event.location}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{event.category}</Badge>
                          </TableCell>
                          <TableCell>{event.date}</TableCell>
                          <TableCell>
                            {new Date(event.date) > new Date() ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400 border-green-200 dark:border-green-800">
                                Upcoming
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Past</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-medium">
                              {event.registered}
                            </span>
                            <span className="text-muted-foreground">
                              {" "}
                              / {event.capacity}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/events/${event.id}`}>
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/events/edit/${event.id}`}>
                                    Edit Event
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => {
                                    setSelectedEvent(event.id);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  Delete Event
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium">{filteredEvents.length}</span>{" "}
                  of{" "}
                  <span className="font-medium">{upcomingEvents.length}</span>{" "}
                  events
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

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage users and their permissions
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button>
                    <Users className="mr-2 h-4 w-4" /> Add User
                  </Button>
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
                    placeholder="Search users..."
                    className="pl-8"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="organizer">Organizer</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="allStatus">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allStatus">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src="/placeholder.svg?height=32&width=32"
                                alt={user.name}
                              />
                              <AvatarFallback>
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.status === "active" ? (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>Active</span>
                            </div>
                          ) : user.status === "inactive" ? (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                              <span>Inactive</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span>Pending</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                Reset Password
                              </DropdownMenuItem>
                              {user.status === "active" ? (
                                <DropdownMenuItem className="text-amber-600">
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-600">
                                  Activate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium">{mockUsers.length}</span> of{" "}
                  <span className="font-medium">{mockUsers.length}</span> users
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

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Manage system-wide settings</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border-b">
                    <nav className="flex flex-col space-y-1 p-2">
                      {[
                        {
                          name: "General",
                          icon: <Settings className="h-4 w-4 mr-2" />,
                        },
                        {
                          name: "Appearance",
                          icon: <FileText className="h-4 w-4 mr-2" />,
                        },
                        {
                          name: "Notifications",
                          icon: <Bell className="h-4 w-4 mr-2" />,
                        },
                        {
                          name: "Security",
                          icon: <Shield className="h-4 w-4 mr-2" />,
                        },
                        {
                          name: "Integrations",
                          icon: <Activity className="h-4 w-4 mr-2" />,
                        },
                      ].map((item, i) => (
                        <Button
                          key={i}
                          variant={i === 0 ? "secondary" : "ghost"}
                          className="justify-start"
                          size="sm"
                        >
                          {item.icon}
                          {item.name}
                        </Button>
                      ))}
                    </nav>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium mb-2">Support</h3>
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        size="sm"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Documentation
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        size="sm"
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        System Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Manage basic platform settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Platform Name</Label>
                    <Input id="site-name" defaultValue="DIU Event Hub" />
                    <p className="text-xs text-muted-foreground">
                      This is the name that will be displayed throughout the
                      platform.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="site-description">
                      Platform Description
                    </Label>
                    <Textarea
                      id="site-description"
                      defaultValue="Event Management Platform for Daffodil International University"
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Registration Settings</Label>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Allow New Registrations</p>
                        <p className="text-sm text-muted-foreground">
                          Enable or disable new user registrations
                        </p>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          id="allow-registrations"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <label
                          htmlFor="allow-registrations"
                          className="relative flex h-6 w-11 cursor-pointer rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2"
                        >
                          <span className="absolute inset-y-0 left-0 flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Email Verification</p>
                        <p className="text-sm text-muted-foreground">
                          Require email verification for new accounts
                        </p>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          id="email-verification"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <label
                          htmlFor="email-verification"
                          className="relative flex h-6 w-11 cursor-pointer rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2"
                        >
                          <span className="absolute inset-y-0 left-0 flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Event Settings</Label>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Event Approval</p>
                        <p className="text-sm text-muted-foreground">
                          Require admin approval for new events
                        </p>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          id="event-approval"
                          className="sr-only peer"
                        />
                        <label
                          htmlFor="event-approval"
                          className="relative flex h-6 w-11 cursor-pointer rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2"
                        >
                          <span className="absolute inset-y-0 left-0 flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-attendees">
                        Default Maximum Attendees
                      </Label>
                      <Input
                        id="max-attendees"
                        type="number"
                        defaultValue="100"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Reset</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

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
            <Button
              variant="destructive"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedEvent(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
