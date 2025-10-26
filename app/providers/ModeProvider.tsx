"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { createContext, useContext, useEffect, ReactNode, useCallback } from "react";

type Mode = "public" | "private" | null;

interface ModeContextType {
  mode: Mode;
  isLoading: boolean;
  activateWorkshop: () => Promise<void>;
}

const ModeContext = createContext<ModeContextType>({
  mode: null,
  isLoading: true,
  activateWorkshop: async () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const user = useQuery(api.users.getCurrentUser);
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const activateWorkshopMutation = useMutation(api.users.activateWorkshop);

  useEffect(() => {
    if (user === undefined) {
      return;
    }
    if (user === null) {
      return;
    }
  }, [user]);


  useEffect(() => {
    const createUser = async () => {
      if (user === null) {
        try {
          await getOrCreateUser();
        } catch (error) {
          console.log("User not authenticated yet");
        }
      }
    };
    createUser();
  }, [user]);

  const activateWorkshop = useCallback(async () => {
    try {
      await activateWorkshopMutation();
    } catch (error) {
      console.error("Failed to activate workshop:", error);
    }
  }, [activateWorkshopMutation]);

  const value: ModeContextType = {
    mode: user?.mode ?? null,
    isLoading: user === undefined,
    activateWorkshop,
  };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be used within ModeProvider");
  }
  return context;
}
