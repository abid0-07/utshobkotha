import type React from "react"
import Link from "next/link"
import { BookOpen, Music, Trophy, Code, Briefcase, GraduationCap } from "lucide-react"
import { eventCategories } from "@/lib/data"

// Map of category names to icons
const categoryIcons: Record<string, React.ReactNode> = {
  Academic: <BookOpen className="h-10 w-10" />,
  Cultural: <Music className="h-10 w-10" />,
  Sports: <Trophy className="h-10 w-10" />,
  Technical: <Code className="h-10 w-10" />,
  Business: <Briefcase className="h-10 w-10" />,
  Career: <GraduationCap className="h-10 w-10" />,
}

export default function EventCategories() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {eventCategories.map((category) => (
        <Link
          key={category.id}
          href={`/events?category=${category.name}`}
          className="flex flex-col items-center justify-center p-6 border rounded-lg hover:border-primary transition-colors bg-card hover:bg-accent text-center"
        >
          <div className={`p-3 rounded-full ${category.color} text-white mb-3`}>{categoryIcons[category.name]}</div>
          <h3 className="font-medium">{category.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{category.count} events</p>
        </Link>
      ))}
    </div>
  )
}

