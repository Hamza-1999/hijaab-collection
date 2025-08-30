import { create } from "zustand";

interface PaginationFilterState {
  offset: number;
  page: number;
  limit: number;

  setOffset: (value: number) => void;
  setPage: (value: number) => void;
  setLimit: (value: number) => void;
}

export const usePaginationStore = create<PaginationFilterState>((set) => ({
  offset: 0,
  page: 1,
  limit: 10,

  setOffset: (value) => set({ offset: value }),
  setPage: (value) => set({ page: value }),
  setLimit: (value) => set({ limit: value }),
}));
