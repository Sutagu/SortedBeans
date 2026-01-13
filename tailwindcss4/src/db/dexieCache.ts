import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { TaskFormData } from '../utils/types';

export interface PendingWrite<T = unknown> {
  id?: number;
  table: string;
  action: string;
  payload: T;
}

export class AppCache extends Dexie {
  tasks!: Table<TaskFormData, number>;
  pendingWrites!: Table<PendingWrite, number>;

  constructor() {
    super('AppCache');
    this.version(1).stores({
      tasks: '++id',
      pendingWrites: '++id',
    });
  }
}

export const appCache = new AppCache();
