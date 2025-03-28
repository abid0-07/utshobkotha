"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { eventCategories, upcomingEvents } from "@/lib/data";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EditEventPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventNotFound, setEventNotFound] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    capacity: "",
    price: "Free",
  });

  // Check user role and load event data
  useEffect(() => {
    if (user && user.role !== "organizer" && user.role !== "admin") {
      router.push("/");
      return;
    }

    // Find the event with the matching ID
    const event = upcomingEvents.find((e) => e.id === id);

    if (!event) {
      setEventNotFound(true);
      setIsLoading(false);
      return;
    }

    // Extract time from the event.time string (format: "10:00 AM - 4:00 PM")
    const timeRange = event.time.split(" - ");
    const startTime = timeRange[0];
    const endTime = timeRange.length > 1 ? timeRange[1] : "";

    // Populate form data with event details
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      startTime: startTime,
      endTime: endTime,
      location: event.location,
      capacity: event.capacity.toString(),
      price: event.price,
    });

    setIsLoading(false);
  }, [user, router, id]);

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
      date: date ? date.toISOString().split("T")[0] : "",
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

  const handlePriceChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      price: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call to update event
    setTimeout(() => {
      toast({
        title: "Event Updated",
        description: "Your event has been updated successfully.",
      });
      setIsSubmitting(false);
      router.push("/events/manage");
    }, 1500);
  };

  const handleDelete = () => {
    setIsSubmitting(true);

    // Simulate API call to delete event
    setTimeout(() => {
      toast({
        title: "Event Deleted",
        description: "Your event has been deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      setIsSubmitting(false);
      router.push("/events/manage");
    }, 1500);
  };

  // If event is not found, show error message
  if (eventNotFound) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground text-center mb-6">
              The event you're trying to edit doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/events/manage")}>
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Edit Event</h1>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete Event
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the main details about your event.
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
                    date={formData.date ? new Date(formData.date) : undefined}
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
                    name="capacity"
                    type="number"
                    placeholder="Maximum number of attendees"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Select
                    value={formData.price}
                    onValueChange={handlePriceChange}
                  >
                    <SelectTrigger id="price">
                      <SelectValue placeholder="Select price type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="100 BDT">100 BDT</SelectItem>
                      <SelectItem value="200 BDT">200 BDT</SelectItem>
                      <SelectItem value="500 BDT">500 BDT</SelectItem>
                      <SelectItem value="1000 BDT">1000 BDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Banner</CardTitle>
                <CardDescription>
                  Update the image for your event.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex justify-center">
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
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <label
                        htmlFor="banner-upload"
                        className="font-medium text-primary cursor-pointer"
                      >
                        Click to upload
                      </label>{" "}
                      or drag and drop
                    </div>
                    <p className="text-xs text-muted-foreground">
                      SVG, PNG, JPG or GIF (max. 2MB)
                    </p>
                    <input id="banner-upload" type="file" className="sr-only" />
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
                  Updating...
                </>
              ) : (
                "Update Event"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Dialog */}
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Event"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
