"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, Search, Filter } from "lucide-react"
import { upcomingEvents, eventCategories } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"

export default function EventsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "")
  const [sortBy, setSortBy] = useState("date")

  const { user } = useAuth()

  // Filter events based on search term and category
  const filteredEvents = upcomingEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? event.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  // Sort events based on selected criteria
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    } else if (sortBy === "popularity") {
      return b.registered - a.registered
    } else if (sortBy === "capacity") {
      return b.capacity - b.registered - (a.capacity - a.registered)
    }
    return 0
  })

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground mt-1">Browse and register for upcoming events at DIU</p>
        </div>
        {user?.role === "organizer" && (
          <Button asChild className="mt-4 md:mt-0">
            <Link href="/events/create">Create Event</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedCategory === "" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                All Categories
              </button>
              {eventCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === category.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  {category.name} <span className="text-xs text-muted-foreground">({category.count})</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Sort By</h3>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Newest First)</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="capacity">Available Spots</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {sortedEvents.length} {sortedEvents.length === 1 ? "event" : "events"} found
            </p>
            <div className="flex items-center gap-2 lg:hidden">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters</span>
            </div>
          </div>

          {sortedEvents.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No events found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedEvents.map((event) => (
                <Link
                  href={`/events/${event.id}`}
                  key={event.id}
                  className="group bg-card hover:bg-accent transition-colors rounded-lg overflow-hidden border shadow-sm"
                >
                  <div className="relative h-48 w-full">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                    <Badge className="absolute top-3 right-3">{event.category}</Badge>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">{event.description.substring(0, 100)}...</p>
                    <div className="flex items-center text-muted-foreground gap-1">
                      <Calendar size={16} />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground gap-1">
                      <MapPin size={16} />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground gap-1">
                      <Users size={16} />
                      <span className="text-sm">{event.registered} registered</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="text-sm font-medium">
                        {event.price === "Free" ? (
                          <span className="text-green-600 dark:text-green-400">Free</span>
                        ) : (
                          <span>{event.price}</span>
                        )}
                      </div>
                      <Badge variant={event.registered >= event.capacity ? "destructive" : "outline"}>
                        {event.registered >= event.capacity
                          ? "Full"
                          : `${event.capacity - event.registered} spots left`}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

