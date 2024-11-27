import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { createEmptyGrid } from "../utils";

const EMPTY_GRID = createEmptyGrid();

type GeneratorStore = {
  grid: string[][];
  setGrid: (newGrid: string[][]) => void;
  code: number | null;
  setCode: (newNumber: number | null) => void;
  isLive: boolean;
  setIsLive: (newValue: boolean) => void;
  isConnected: boolean;
  setIsConnected: (newValue: boolean) => void;
  sessionID: string | null;
  setSessionID: (newSessionID: string) => void;
};

export const useGeneratorStore = create<GeneratorStore>()(
  persist(
    (set) => ({
      grid: EMPTY_GRID,
      setGrid: (newGrid: string[][]) => {
        set({ grid: newGrid });
      },
      code: null,
      setCode: (newCode: number | null) => {
        set({ code: newCode });
      },
      isLive: false,
      setIsLive: (newValue: boolean) => {
        set({ isLive: newValue });
      },
      isConnected: false,
      setIsConnected: (newValue: boolean) => {
        set({ isConnected: newValue });
      },
      sessionID: null,
      setSessionID: (newSessionID: string) => {
        set({ sessionID: newSessionID });
      },
    }),
    {
      name: "generator-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
