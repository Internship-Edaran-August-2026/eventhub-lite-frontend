import { useQuery } from "@tanstack/react-query";
import { participantService } from "@/services/participantService";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  checked_in: "default",
  accepted: "secondary",
  invited: "outline",
  declined: "destructive",
};

export function ParticipantsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["participants"],
    queryFn: () => participantService.list(1, 20),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Participants</h1>
        <p className="text-muted-foreground">All participants registered across events.</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {data?.data.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell className="font-medium">{participant.name}</TableCell>
                <TableCell>{participant.email}</TableCell>
                <TableCell>{participant.event_title}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[participant.status] ?? "outline"}>
                    {participant.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {participant.registered_at
                    ? new Date(participant.registered_at).toLocaleDateString()
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
