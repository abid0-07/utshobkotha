import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import FeaturedEvents from "@/components/featured-events"
import EventCategories from "@/components/event-categories"
import { upcomingEvents } from "@/lib/data"

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <Badge variant="outline" className="px-3 py-1 text-sm mb-4">
                DIU Event Hub
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">Discover, Create & Join Amazing Events</h1>
              <p className="text-muted-foreground text-lg">
                A powerful platform for DIU community members to discover, organize, and participate in campus events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link href="/events">Browse Events</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/auth/register">Create Account</Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                <Image
                  src="/placeholder.svg?width=600&height=400"
                  alt="Campus event"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Featured Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't miss out on these popular upcoming events across the campus.
            </p>
          </div>
          <FeaturedEvents />
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find events that match your interests from various categories.
            </p>
          </div>
          <EventCategories />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground">Check out what's happening at DIU in the coming days.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.slice(0, 6).map((event) => (
              <Link
                href={`/events/${event.id}`}
                key={event.id}
                className="group bg-card hover:bg-accent transition-colors rounded-lg overflow-hidden border shadow-sm"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={event.image || "/placeholder.svg?width=400&height=200"}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-3 right-3">{event.category}</Badge>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                    {event.title}
                  </h3>
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
                    <span className="text-sm">{event.attendees} attending</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild>
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              DIU Event Hub offers a comprehensive set of tools for event management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Event Creation & Management",
                description: "Easily create, edit, and manage events with customizable settings.",
                icon: <Calendar className="w-10 h-10 text-primary" />,
              },
              {
                title: "Digital Ticketing",
                description: "Generate and distribute digital tickets with QR codes for seamless check-in.",
                icon: <Users className="w-10 h-10 text-primary" />,
              },
              {
                title: "Volunteer Management",
                description: "Recruit and organize volunteers for your events efficiently.",
                icon: <Users className="w-10 h-10 text-primary" />,
              },
              {
                title: "Real-time Notifications",
                description: "Stay updated with real-time alerts about events and changes.",
                icon: <Clock className="w-10 h-10 text-primary" />,
              },
              {
                title: "Analytics Dashboard",
                description: "Track event performance with comprehensive analytics and insights.",
                icon: <Users className="w-10 h-10 text-primary" />,
              },
              {
                title: "Feedback Collection",
                description: "Gather valuable feedback through post-event surveys and ratings.",
                icon: <Users className="w-10 h-10 text-primary" />,
              },
            ].map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-lg border">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

