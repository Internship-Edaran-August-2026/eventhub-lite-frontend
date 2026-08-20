import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { eventService } from "@/services/eventService";
import type { ParticipantFormValues } from "@/services/participantService";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ParticipantFormProps = {
  submitLabel: string;
  onSubmit: (values: ParticipantFormValues) => Promise<unknown>;
};

export function ParticipantForm({
  submitLabel,
  onSubmit,
}: ParticipantFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventId, setEventId] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [registeredAt, setRegisteredAt] = useState("");
  const [formError, setFormError] = useState("");

  const {
    data: eventsData,
    isLoading: isEventsLoading,
  } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.list(1, 100),
  });

  const handleSubmit = async () => {
    if (
      !name ||
      !email ||
      !phone ||
      !eventId ||
      !type ||
      !status ||
      !registeredAt
    ) {
      setFormError("Please fill in all fields.");
      return;
    }

    setFormError("");

    await onSubmit({
      name,
      email,
      phone,
      event_id: eventId,
      type: type as ParticipantFormValues["type"],
      status: status as ParticipantFormValues["status"],
      registered_at: new Date(registeredAt).toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>

        <Input
          id="name"
          placeholder="Enter participant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          type="email"
          placeholder="Enter participant email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>

        <Input
          id="phone"
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* Event */}
      <div className="space-y-2">
        <Label htmlFor="event">Event</Label>

        <Select
          value={eventId}
          onValueChange={setEventId}
          disabled={isEventsLoading}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                isEventsLoading
                  ? "Loading events..."
                  : "Select an event"
              }
            />
          </SelectTrigger>

          <SelectContent>
            {eventsData?.data.map((event) => (
              <SelectItem
                key={event.id}
                value={String(event.id)}
              >
                {event.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Participant Type</Label>

        <Select
          value={type}
          onValueChange={setType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select participant type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="attendee">
              Attendee
            </SelectItem>

            <SelectItem value="speaker">
              Speaker
            </SelectItem>

            <SelectItem value="vip">
              VIP
            </SelectItem>

            <SelectItem value="staff">
              Staff
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>

        <Select
          value={status}
          onValueChange={setStatus}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="invited">
              Invited
            </SelectItem>

            <SelectItem value="accepted">
              Accepted
            </SelectItem>

            <SelectItem value="declined">
              Declined
            </SelectItem>

            <SelectItem value="checked_in">
              Checked In
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Registered Date */}
      <div className="space-y-2">
        <Label htmlFor="registered_at">
          Registered Date & Time
        </Label>

        <Input
          id="registered_at"
          type="datetime-local"
          value={registeredAt}
          onChange={(e) => setRegisteredAt(e.target.value)}
        />
      </div>

      {/* Validation Error */}
      {formError && (
        <p className="text-sm text-destructive">
          {formError}
        </p>
      )}

      {/* Submit */}
      <Button
        type="button"
        onClick={handleSubmit}
      >
        {submitLabel}
      </Button>
    </div>
  );
}