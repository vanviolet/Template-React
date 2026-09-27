import { UserDTO } from '@/services/api-generated';
import { z } from 'zod';
import { userFormSchema } from './schema';

export type UserFormValues = z.infer<typeof userFormSchema>;

export type DialogMode = 'create' | 'edit' | 'detail' | 'delete' | null;

export interface PenggunaStoreState {
  dialogMode: DialogMode;
  selectedUser: UserDTO | null;
  openDialog: (mode: DialogMode, user?: UserDTO | null) => void;
  closeDialog: () => void;
}
