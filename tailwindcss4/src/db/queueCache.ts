import { appCache } from '../db/dexieCache';
import { UseSupabaseTaskStore } from '../supabaseStore/taskApi';
import { supabase } from '../utils/supabase';
import type { Task, EditPayload } from '../utils/types';
export async function queueWrite(
  table: string,
  action: string,
  payload?: unknown
) {
  await appCache.pendingWrites.add({
    table: table,
    action: action,
    payload: payload,
  });
  console.log('Queued write: ', {
    table: table,
    action: action,
    payload: payload,
  });
}
export async function syncQueuedWrites() {
  const pending = await appCache.pendingWrites.toArray();

  for (const item of pending) {
    try {
      switch (item.action) {
        case 'insert': {
          const { data, error } = await supabase
            .from(item.table)
            .insert(item.payload)
            .select()
            .single();
          if (error || !data) {
            console.error(error);
            return;
          }
          const { id, client_id } = data;
          UseSupabaseTaskStore.getState().syncTaskId(id, client_id);
          break;
        }
        case 'update': {
          const { id, ...stripData } = item.payload as Task;
          const { error } = await supabase
            .from('tasks')
            .update(stripData)
            .eq('id', id);

          if (error) {
            console.error(error);
            return;
          }
          break;
        }
        case 'edit': {
          const { id, field, value } = item.payload as EditPayload;
          const { error } = await supabase
            .from('tasks')
            .update({ [field]: value })
            .eq('id', id);
          if (error) {
            console.error(error);
            return;
          }
          break;
        }
        case 'delete': {
          const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', item.payload);
          if (error) {
            console.error(error);
            return;
          }
          break;
        }
      }
      await appCache.pendingWrites.delete(item.id!);
    } catch (err) {
      console.log('Failed to sync cache' + err);
      return;
    }
  }

  console.log('All queued writes synced');
}
