"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { TimePicker } from "@/components/time-picker";
import { useAuth } from "@/lib/auth-context";
import { eventCategories } from "@/lib/data";
import { useEvents } from "@/lib/event-context";
import { Loader2 } from "lucide-react";

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { createEvent } = useEvents();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventBanner, setEventBanner] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    capacity: "",
    isFree: true,
    price: 0,
    currentEnrolled: 0,
  });

  // Check user role once on component mount
  useEffect(() => {
    if (user && user.role !== "organizer" && user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Create separate handlers for each complex input to avoid circular dependencies
  const handleDateChange = (date?: Date) => {
    setFormData((prev) => ({
      ...prev,
      eventDate: date ? date.toISOString().split("T")[0] : "",
    }));
  };

  const handleStartTimeChange = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      startTime: time,
    }));
  };

  const handleEndTimeChange = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      endTime: time,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleIsFreeChange = (value: string) => {
    const isFree = value === "Free";
    setFormData((prev) => ({
      ...prev,
      isFree: isFree,
      price: isFree ? 0 : prev.price,
    }));
  };

  const handlePriceChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      price: parseInt(value),
    }));
  };

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      capacity: isNaN(value) ? "" : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventBanner(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create event data object
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        eventDate: formData.eventDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        capacity: parseInt(formData.capacity as string),
        isFree: formData.isFree,
        price: formData.price,
        currentEnrolled: 0,
        eventBannerBase64: eventBanner,
      };

      await createEvent(eventData);
      router.push("/events/manage");
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not authorized, don't render the form
  if (user && user.role !== "organizer" && user.role !== "admin") {
    return null;
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Event</h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Provide the main details about your event.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Give your event a clear and attractive title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your event in detail"
                    className="min-h-[150px]"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Date & Time</CardTitle>
                <CardDescription>
                  When will your event take place?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Event Date</Label>
                  <DatePicker
                    date={
                      formData.eventDate
                        ? new Date(formData.eventDate)
                        : undefined
                    }
                    setDate={handleDateChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <TimePicker
                      time={formData.startTime}
                      setTime={handleStartTimeChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <TimePicker
                      time={formData.endTime}
                      setTime={handleEndTimeChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location & Capacity</CardTitle>
                <CardDescription>
                  Where will your event take place and how many people can
                  attend?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter the venue or location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="Maximum number of attendees"
                    value={formData.capacity}
                    onChange={handleCapacityChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Price Type</Label>
                  <Select
                    value={formData.isFree ? "Free" : "Paid"}
                    onValueChange={handleIsFreeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select price type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {!formData.isFree && (
                  <div className="space-y-2">
                    <Label>Price (in BDT)</Label>
                    <Select
                      value={formData.price.toString()}
                      onValueChange={handlePriceChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select price" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 BDT</SelectItem>
                        <SelectItem value="200">200 BDT</SelectItem>
                        <SelectItem value="500">500 BDT</SelectItem>
                        <SelectItem value="1000">1000 BDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Banner</CardTitle>
                <CardDescription>
                  Upload an image to represent your event.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      {eventBanner ? (
                        <div className="relative w-full h-[200px]">
                          <img
                            src={eventBanner}
                            alt="Event banner preview"
                            className="object-cover max-h-[200px] mx-auto"
                          />
                        </div>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-10 w-10 text-muted-foreground"
                        >
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                          <line x1="16" x2="22" y1="5" y2="5" />
                          <line x1="19" x2="19" y1="2" y2="8" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <label
                        htmlFor="banner-upload"
                        className="font-medium text-primary cursor-pointer"
                      >
                        {eventBanner ? "Change image" : "Click to upload"}
                      </label>{" "}
                      {!eventBanner && "or drag and drop"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      SVG, PNG, JPG or GIF (max. 2MB)
                    </p>
                    <input
                      id="banner-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
