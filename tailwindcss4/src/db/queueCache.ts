import { appCache } from '../db/dexieCache';
import { useTaskStore } from '../hooks/taskStoreHook';
export async function queueWrite(url: string, method: string, body?: unknown) {
  await appCache.pendingWrites.add({ url, method, body });
  console.log('Queued write: ', { url, method, body });
}
export async function syncQueuedWrites() {
  const pending = await appCache.pendingWrites.toArray();

  for (const item of pending) {
    try {
      if (item.method === 'POST') {
        const response = await fetch(item.url, {
          method: item.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.body),
        });
        const { id, client_id } = await response.json();
        useTaskStore.getState().syncTaskId(id, client_id);
      } else {
        await fetch(item.url, {
          method: item.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.body),
        });
      }
      await appCache.pendingWrites.delete(item.id!);
    } catch (err) {
      console.log('Failed to sync cache' + err);
      return;
    }
  }

  console.log('All queued writes synced');
}
