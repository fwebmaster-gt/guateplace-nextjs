import { create } from "zustand";

interface AppState {
  showLoginToContinue: { value: boolean; block: boolean };
  setLoginToContinue: (data: { value: boolean; block: boolean }) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  showLoginToContinue: { value: false, block: false },
  setLoginToContinue: (value) => {
    return set(() => ({ showLoginToContinue: value }));
  },
}));
