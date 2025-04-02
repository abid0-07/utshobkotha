"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface VolunteerApplicationFormProps {
  opportunityId: string;
  opportunityTitle: string;
  eventId: string;
  eventTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function VolunteerApplicationForm({
  opportunityId,
  opportunityTitle,
  eventId,
  eventTitle,
  onSuccess,
  onCancel,
}: VolunteerApplicationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [availability, setAvailability] = useState("full");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [skills, setSkills] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!motivation.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please share your motivation for volunteering.",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        variant: "destructive",
        title: "Terms required",
        description:
          "You must agree to the volunteer guidelines and responsibilities.",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Application Submitted",
        description:
          "Your volunteer application has been submitted successfully.",
      });

      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description:
          "There was an error submitting your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="motivation">Why do you want to volunteer?</Label>
        <Textarea
          id="motivation"
          placeholder="Share your motivation and relevant experience..."
          rows={4}
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Relevant skills</Label>
        <Textarea
          id="skills"
          placeholder="List any skills that are relevant to this position..."
          rows={2}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="availability">Availability</Label>
        <Select value={availability} onValueChange={setAvailability}>
          <SelectTrigger id="availability">
            <SelectValue placeholder="Select your availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Full Event</SelectItem>
            <SelectItem value="morning">Morning Only</SelectItem>
            <SelectItem value="afternoon">Afternoon Only</SelectItem>
            <SelectItem value="custom">Custom Hours</SelectItem>
          </SelectContent>
        </Select>
        {availability === "custom" && (
          <Textarea
            placeholder="Please specify your available hours..."
            className="mt-2"
            rows={2}
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the volunteer guidelines and responsibilities
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </form>
  );
}
