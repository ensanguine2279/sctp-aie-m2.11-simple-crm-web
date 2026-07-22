import { createContext, useContext } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const InteractionsContext = createContext();

import { API_BASE } from "../App";

export function InteractionsProvider({ children, customerId }) {
  const queryClient = useQueryClient();
  const queryKey = ["interactions", customerId];

  // Fetch interactions declaratively
  const {
    data: interactions = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!customerId) return [];
      const res = await fetch(
        `${API_BASE}/interactions?customerId=${customerId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch interactions");
      return res.json();
    },
    enabled: !!customerId, // Only fetch if customerId is present
  });

  // Mutation for deleting an interaction
  const deleteMutation = useMutation({
    mutationFn: async (interactionId) => {
      const res = await fetch(`${API_BASE}/interactions/${interactionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete on server");
      return interactionId;
    },
    onSuccess: (deletedId) => {
      // Instantly update the local cache so the UI reflects the deletion immediately
      queryClient.setQueryData(queryKey, (oldData) =>
        oldData ? oldData.filter((item) => item.id !== deletedId) : [],
      );
    },
    onError: (err) => {
      console.error("Delete error:", err);
      alert("Could not delete interaction.");
    },
  });

  // Mutation for adding an interaction
  const addMutation = useMutation({
    mutationFn: async (newInteractionData) => {
      console.log("Adding interaction for customerId:", customerId);

      const res = await fetch(`${API_BASE}/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newInteractionData,
          customerId: customerId, // Ensure it ties to the current customer
          date: new Date().toISOString(), // Automatically stamp the date
        }),
      });
      if (!res.ok) throw new Error("Failed to add interaction on server");
      return res.json(); // Returns the newly created interaction object with new id
    },
    onSuccess: (createdInteraction) => {
      // Instantly prepend or append the new item into the existing cache
      queryClient.setQueryData(queryKey, (oldData) =>
        oldData ? [createdInteraction, ...oldData] : [createdInteraction],
      );
    },
    onError: (err) => {
      console.error("Add error:", err);
      alert("Could not save interaction.");
    },
  });

  return (
    <InteractionsContext.Provider
      value={{
        customerId,
        interactions,
        loading,
        error: error?.message || null,
        deleteInteraction: deleteMutation.mutate,
        addInteraction: addMutation.mutate,
      }}
    >
      {children}
    </InteractionsContext.Provider>
  );
}

export function useInteractions() {
  return useContext(InteractionsContext);
}
