import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users } from "lucide-react"
import { upcomingEvents } from "@/lib/data"

export default function FeaturedEvents() {
  const featuredEvents = upcomingEvents.filter((event) => event.isFeatured).slice(0, 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredEvents.map((event) => (
        <Card key={event.id} className="overflow-hidden transition-all hover:shadow-md group">
          <Link href={`/events/${event.id}`} className="block h-full">
            <div className="relative h-48 w-full">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <Badge className="absolute top-3 right-3">{event.category}</Badge>
            </div>
            <CardContent className="p-4">
              <CardTitle className="text-xl mb-2 line-clamp-1">{event.title}</CardTitle>
              <p className="text-muted-foreground line-clamp-2 mb-3">{event.description.substring(0, 100)}...</p>
              <div className="space-y-2">
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
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t flex justify-between items-center">
              <div className="text-sm font-medium">
                {event.price === "Free" ? (
                  <span className="text-green-600 dark:text-green-400">Free</span>
                ) : (
                  <span>{event.price}</span>
                )}
              </div>
              <Badge variant={event.registered >= event.capacity ? "destructive" : "outline"}>
                {event.registered >= event.capacity ? "Full" : `${event.capacity - event.registered} spots left`}
              </Badge>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  )
}

