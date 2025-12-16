import { syncQueuedWrites } from '../db/queueCache';

export function enableOfflineSync() {
  window.addEventListener('online', async () => {
    console.log('Back online — syncing...');
    syncQueuedWrites();
  });
}
