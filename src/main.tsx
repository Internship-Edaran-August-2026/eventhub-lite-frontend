import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";

// The in-memory MSW mock server has been replaced by a file-backed
// json-server instance (see docs/INTERN_GUIDE.md — `npm run mock-api`).
// The block below is kept, commented out, in case you need to roll back
// to in-memory mocking for offline work.
//
// async function enableMocking() {
//   const { worker } = await import("./mocks/browser");
//   try {
//     await worker.start({ onUnhandledRequest: "bypass" });
//   } catch (error) {
//     console.error("[MSW] Mock server failed to start; API calls will not be intercepted.", error);
//   }
// }
//
// enableMocking().then(() => {
//   createRoot(document.getElementById("root")!).render(
//     <StrictMode>
//       <App />
//     </StrictMode>
//   );
// });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
