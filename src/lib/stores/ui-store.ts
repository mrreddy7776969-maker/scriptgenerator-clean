"use client";

import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  paywallOpen: boolean;
  folderSetupOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setPaywallOpen: (open: boolean) => void;
  setFolderSetupOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  paywallOpen: false,
  folderSetupOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setPaywallOpen: (open) => set({ paywallOpen: open }),
  setFolderSetupOpen: (open) => set({ folderSetupOpen: open }),
}));
