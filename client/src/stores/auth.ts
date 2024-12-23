import { Role } from "@/types";
import { StateCreator } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  tokenExpiration: number | null;
  role: Role | null;
  userId: string | null;
};

export type AuthSlice = {
  auth: AuthState;
  loginUser: (payload: Omit<AuthState, "isAuthenticated">) => void;
  logoutUser: () => void;
  refreshToken: (payload: Pick<AuthState, "tokenExpiration" | "role">) => void;
};

const initialState: AuthState = {
  isAuthenticated: false,
  tokenExpiration: null,
  role: null,
  userId: null,
};

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  auth: initialState,
  loginUser: ({ tokenExpiration, role, userId }) =>
    set(() => ({
      auth: {
        isAuthenticated: true,
        tokenExpiration,
        role,
        userId,
      },
    })),
  logoutUser: () =>
    set(() => ({
      auth: initialState,
    })),
  refreshToken: ({ tokenExpiration, role }) =>
    set((state) => ({
      auth: {
        ...state.auth,
        tokenExpiration,
        role,
      },
    })),
});
