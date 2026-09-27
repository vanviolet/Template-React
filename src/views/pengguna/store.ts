import { create } from 'zustand';
import { DialogMode } from './types';
import { UserDTO } from '@/services/api-generated';

interface PenggunaDialogState {
  dialogMode: DialogMode;
  selectedUser: UserDTO | null;
  openDialog: (mode: DialogMode, user?: UserDTO | null) => void;
  closeDialog: () => void;
}

export const usePenggunaDialogStore = create<PenggunaDialogState>((set) => ({
  dialogMode: null,
  selectedUser: null,
  openDialog: (mode: DialogMode, user: UserDTO | null = null) =>
    set({ dialogMode: mode, selectedUser: user }),
  closeDialog: () => set({ dialogMode: null, selectedUser: null }),
}));
