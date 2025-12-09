import { appCache } from '../db/dexieCache';

export async function queueWrite(url: string, method: string, body?: unknown) {
  await appCache.pendingWrites.add({ url, method, body });
  console.log('Queued write: ', { url, method, body });
}

export async function syncQueuedWrites() {
  const pending = await appCache.pendingWrites.toArray();

  for (const item of pending) {
    try {
      await fetch(item.url, {
        method: item.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.body),
      });
      await appCache.pendingWrites.delete(item.id!);
    } catch (err) {
      console.log('Failed to sync cache' + err);
      return;
    }
  }

  console.log('All queued writes synced');
}
