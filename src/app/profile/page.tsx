"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Loader2, Lock } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    department: "",
    phone: "",
    institution: "Daffodil International University",
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/auth/login")
    } else if (user) {
      // Load user data
      setProfileData({
        name: user.name,
        email: user.email,
        bio: "Computer Science student passionate about technology and innovation.",
        department: user.department || "Computer Science",
        phone: "+880 1712 345678",
        institution: "Daffodil International University",
      })
    }
  }, [user, router, isLoading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
      setIsLoading(false)
    }, 1000)
  }

  if (!user) return null

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <Tabs defaultValue="personal">
          <TabsList className="mb-8">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Update your profile picture</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-background">
                    <Image
                      src={user.image || "/placeholder.svg?height=128&width=128"}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                </CardContent>

                <CardHeader className="pt-6">
                  <CardTitle>Account Type</CardTitle>
                  <CardDescription>Your current role</CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <p className="font-medium capitalize">{user.role}</p>
                    <Button variant="ghost" size="sm" disabled>
                      <Lock className="h-3.5 w-3.5 mr-1.5" />
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={profileData.name} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleChange}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Your email address is used for login and cannot be changed.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select
                          value={profileData.department}
                          onValueChange={(value) => setProfileData((prev) => ({ ...prev, department: value }))}
                        >
                          <SelectTrigger id="department">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Arts">Arts & Humanities</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution</Label>
                        <Input
                          id="institution"
                          name="institution"
                          value={profileData.institution}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" value={profileData.phone} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about yourself"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Event Reminders</p>
                      <p className="text-sm text-muted-foreground">Receive reminders before your registered events</p>
                    </div>
                    <div>
                      <input type="checkbox" id="event-reminders" className="sr-only peer" defaultChecked />
                      <label
                        htmlFor="event-reminders"
                        className="relative flex h-6 w-11 cursor-pointer rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2"
                      >
                        <span className="absolute inset-y-0 left-0 flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Schedule Changes</p>
                      <p className="text-sm text-muted-foreground">Get notified when an event's schedule changes</p>
                    </div>
                    <div>
                      <input type="checkbox" id="schedule-changes" className="sr-only peer" defaultChecked />
                      <label
                        htmlFor="schedule-changes"
                        className="relative flex h-6 w-11 cursor-pointer rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2"
                      >
                        <span className="absolute inset-y-0 left-0 flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Volunteer Opportunities</p>
                      <p className="text-sm text-muted-foreground">Be notified of new volunteer positions</p>
                    </div>
                    <div>
                      <input type="checkbox" id="volunteer-opps" className="sr-only peer" />
                      <label
                        htmlFor="volunteer-opps"
                        className="relative flex h-6 w-11 cursor-pointer rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2"
                      >
                        <span className="absolute inset-y-0 left-0 flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Communications</p>
                      <p className="text-sm text-muted-foreground">Receive updates about new features and events</p>
                    </div>
                    <div>
                      <input type="checkbox" id="marketing" className="sr-only peer" />
                      <label
                        htmlFor="marketing"
                        className="relative flex h-6 w-11 cursor-pointer rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2"
                      >
                        <span className="absolute inset-y-0 left-0 flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

