import { authHandlers } from "./auth";
import { dashboardHandlers } from "./dashboard";
import { eventHandlers } from "./events";
import { participantHandlers } from "./participants";

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...eventHandlers,
  ...participantHandlers,
];
