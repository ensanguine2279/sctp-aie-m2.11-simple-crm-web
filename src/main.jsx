import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CustomerProvider } from "./contexts/CustomerContext.jsx";

import App from "./App.jsx";
import "./index.css";

const queryClient = new QueryClient();

// Check if redirected from the 404.html hack
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const redirectedPath = urlParams.get("p");

console.log("in main: ", queryString, urlParams, redirectedPath);
console.log("window.location.pathname: ", window.location.pathname);

if (redirectedPath) {
  window.history.replaceState(
    null,
    null,
    window.location.pathname + redirectedPath + window.location.hash,
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CustomerProvider>
          <App />
        </CustomerProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
