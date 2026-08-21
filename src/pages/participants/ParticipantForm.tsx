import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const participantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 characters.")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number."),
  event_id: z.string().min(1, "Event is required."),
  type: z.enum(["attendee", "speaker", "vip", "staff"]),
  status: z.enum(["invited", "accepted", "declined", "checked_in"]),
  registered_at: z.string().min(1, "Registered date and time is required."),
});

type ParticipantFormProps = {
  submitLabel: string;
  onSubmit: (values: ParticipantFormValues) => Promise<unknown>;
};

export function ParticipantForm({
  submitLabel,
  onSubmit,
}: ParticipantFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ParticipantFormValues>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      event_id: "",
      type: "attendee",
      status: "invited",
      registered_at: "",
    },
  });

  const {
    data: eventsData,
    isLoading: isEventsLoading,
  } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.list(1, 100),
  });

  const eventId = watch("event_id");
  const type = watch("type");
  const status = watch("status");

  const handleFormSubmit = async (values: ParticipantFormValues) => {
    await onSubmit({
      ...values,
      registered_at: new Date(values.registered_at).toISOString(),
    });
  };

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>

        <Input
          id="name"
          placeholder="Enter participant name"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          type="email"
          placeholder="Enter participant email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>

        <Input
          id="phone"
          type="tel"
          placeholder="Enter phone number"
          {...register("phone")}
        />

        {errors.phone && (
          <p className="text-sm text-destructive">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Event */}
      <div className="space-y-2">
        <Label>Event</Label>

        <Select
          value={eventId}
          onValueChange={(value) => setValue("event_id", value)}
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

        {errors.event_id && (
          <p className="text-sm text-destructive">
            {errors.event_id.message}
          </p>
        )}
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label>Participant Type</Label>

        <Select
          value={type}
          onValueChange={(value) =>
            setValue(
              "type",
              value as ParticipantFormValues["type"]
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select participant type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="attendee">Attendee</SelectItem>
            <SelectItem value="speaker">Speaker</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
          </SelectContent>
        </Select>

        {errors.type && (
          <p className="text-sm text-destructive">
            {errors.type.message}
          </p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label>Status</Label>

        <Select
          value={status}
          onValueChange={(value) =>
            setValue(
              "status",
              value as ParticipantFormValues["status"]
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="invited">Invited</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="checked_in">
              Checked In
            </SelectItem>
          </SelectContent>
        </Select>

        {errors.status && (
          <p className="text-sm text-destructive">
            {errors.status.message}
          </p>
        )}
      </div>

      {/* Registered Date */}
      <div className="space-y-2">
        <Label htmlFor="registered_at">
          Registered Date & Time
        </Label>

        <Input
          id="registered_at"
          type="datetime-local"
          {...register("registered_at")}
        />

        {errors.registered_at && (
          <p className="text-sm text-destructive">
            {errors.registered_at.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}