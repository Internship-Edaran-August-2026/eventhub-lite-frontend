# EventHub Lite — Intern Guide

Welcome Interns! This is a sanitized, simplified sandbox of the real EventHub admin app.
It shares the exact same design system, folder conventions, and tech stack as
production — just with the complex bits (3D lucky draw, websockets, seating
charts, multi-step wizards) stripped out so you can focus on learning the
patterns.

## 1. How the UI/UX is structured

```
src/
├── components/
│   ├── ui/          shadcn/ui primitives (button, input, dialog, table...)
│   │                 — do not hand-edit these unless you're fixing a shared
│   │                 style bug that should apply everywhere.
│   ├── layout/       AppLayout, Sidebar, Header, Breadcrumbs
│   │                 — the persistent chrome around every authenticated page.
│   └── shared/       Small reusable pieces that aren't shadcn primitives.
├── contexts/         React Context providers (AuthContext today).
├── routes/           Route table (routes/index.tsx) + route guards.
├── pages/            One folder per feature area (auth, dashboard, events,
│                     participants). Each page composes ui/ + layout/.
├── services/         One file per resource — the ONLY place that calls
│                     apiClient. Pages never call axios directly.
├── api/client.ts      The shared axios instance (auth header injection,
│                     401 redirect-to-login), pointed at VITE_API_URL.
├── mocks/            Legacy in-memory MSW mock server (handlers/ + fixtures/).
│                     No longer wired up by default — see "Data persistence"
│                     below — kept for reference/rollback only.
└── types/            Shared TypeScript interfaces. events/participants mirror
                      the real Laravel API shapes; auth's AuthRecord mirrors
                      db.json's json-server table instead.
```

**Design system**: `index.css` defines every color as a CSS variable
(`--brand-blue`, `--brand-gold`, etc.) mapped into Tailwind tokens via
`@theme inline`. Always reach for a token class (`bg-brand-blue`,
`text-muted-foreground`) — never hardcode a hex value in a component.

**Auth model**: `AuthContext` exposes `user`, `isAuthenticated`, `login()`,
`logout()`. It's a simplified version of the real app's context — no
permission-string checks here, just "logged in or not."

## 2. Standard way to build a new page

Every page in this app follows the same recipe:

1. **Add the route** in `src/routes/index.tsx`, nested under the
   `RequireAuth` + `AppLayout` route if it needs the sidebar/header chrome.
2. **Add a service function** in `src/services/` if the page needs data —
   never call `apiClient` or `fetch` directly from a page component.
3. **Fetch with TanStack Query** inside the page component:
   ```tsx
   const { data, isLoading } = useQuery({
     queryKey: ["events"],
     queryFn: () => eventService.list(),
   });
   ```
4. **Compose the page from `components/ui/*`** — `Card`, `Table`, `Badge`,
   `Button`, `Skeleton` for loading states. Don't write raw `<table>` or
   `<button>` markup; the primitives already carry the correct spacing,
   radius, and color tokens.
5. **Mutations** (create/update/delete) use `useMutation`, and on success call
   `queryClient.invalidateQueries({ queryKey: [...] })` so lists refresh, plus
   a `toast.success(...)` / `toast.error(...)` from `sonner` for feedback.
6. **New API resource?** Add a top-level array to `db.json` (e.g. `"venues": []`)
   — json-server automatically exposes full CRUD at `/venues` and
   `/venues/:id`, no handler code needed. Add the matching type to
   `src/types/` and a service file in `src/services/` the same way
   `eventService.ts` wraps `/events`.

Look at `src/pages/events/EventsListPage.tsx` and `EventDetailPage.tsx` as the
reference implementation of this pattern end-to-end.

