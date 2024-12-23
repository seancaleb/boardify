import { createSelectors } from "@/lib/zustand";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { AuthSlice, createAuthSlice } from "./auth";

type RootState = AuthSlice;

const useAppStoreBase = create<RootState>()(
  immer(
    devtools(
      persist(
        (...a) => ({
          ...createAuthSlice(...a),
        }),
        {
          name: "kanban-app",
        }
      )
    )
  )
);

export const useAppStore = createSelectors(useAppStoreBase);
