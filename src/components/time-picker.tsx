"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerProps {
  time: string
  setTime: (time: string) => void
}

export function TimePicker({ time, setTime }: TimePickerProps) {
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"))
  const minutes = ["00", "15", "30", "45"]
  const periods = ["AM", "PM"]

  // Parse the initial time value
  const [selectedHour, setSelectedHour] = React.useState(() => {
    if (!time) return "09"
    const parts = time.split(":")
    return parts[0] || "09"
  })

  const [selectedMinute, setSelectedMinute] = React.useState(() => {
    if (!time) return "00"
    const parts = time.split(":")
    return parts[1]?.slice(0, 2) || "00"
  })

  const [selectedPeriod, setSelectedPeriod] = React.useState(() => {
    if (!time) return "AM"
    return time.slice(-2) || "AM"
  })

  // Use useEffect with proper dependency array to prevent infinite loops
  React.useEffect(() => {
    if (selectedHour && selectedMinute && selectedPeriod) {
      const newTime = `${selectedHour}:${selectedMinute} ${selectedPeriod}`
      // Only update if the time has actually changed
      if (newTime !== time) {
        setTime(newTime)
      }
    }
  }, [selectedHour, selectedMinute, selectedPeriod, setTime])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !time && "text-muted-foreground")}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time ? time : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <div className="flex gap-2">
          <Select value={selectedHour} onValueChange={setSelectedHour}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMinute} onValueChange={setSelectedMinute}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  )
}

