const cacheManager = require('cache-manager');
const fsStore = require('cache-manager-fs-binary');
const cacheDir = './cache';
let cache:any =false;
const TTL = 30 * 24 * 60 * 60; // 1 month in seconds

export const cache_set = async(key, value): Promise<any> => {
  await new Promise(resolve => {cache.set(key, value, { ttl: TTL }, resolve)});
}

export const cache_get = async(key): Promise<any> => {
  await cache_init();
  return await new Promise(resolve => {cache.get(key, (err, result) => {resolve(result)})});
}

export const cache_init = async () => {
  if (!cache) {
    await new Promise(resolve => {
      cache = cacheManager.caching({
        store: fsStore,
        options: {
          path: cacheDir,
          ttl: TTL,
          preventfill: false,
          fillcallback: resolve
        }
      });
    });
  }
  return cache;
};

