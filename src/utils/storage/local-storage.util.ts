import { filter, forEach, isNaN, keys } from 'lodash';

let storage: Storage;

const appIdentifier = 'otto-';

function remove(key: string) {
  return storage.removeItem(appIdentifier + key);
}

function getItem(key: string) {
  const item = storage.getItem(key);
  const result = item ? JSON.parse(item) : item;
  if (!result) return {};
  const { val, expiresAt } = result;
  const now = Date.now();
  return {
    val,
    isExpired: expiresAt ? new Date(expiresAt).getTime() < now : false,
  };
}

function reset() {
  const idcKeys = filter<string>(keys(storage), (key) =>
    key.includes(appIdentifier)
  );
  forEach(idcKeys, storage.removeItem);
}

function initializeStorage() {
  try {
    window.localStorage.setItem('test', 'test');
    window.localStorage.removeItem('test');
    storage = window.localStorage;
    // storageEnabled = true;
  } catch (exception) {
    storage = {
      setItem: (k: string, v: any) => {
        storage[k] = v;
      },
      removeItem: (k: string) => delete storage[k],
      getItem: (k: string) => storage[k],
    } as unknown as Storage;
  }
}

function removeExpired() {
  const idcKeys = filter<string>(keys(storage), (key) =>
    key.includes(appIdentifier)
  );
  forEach(idcKeys, (k: string) => {
    const { isExpired } = getItem(k);
    if (isExpired) storage.removeItem(k);
  });
}

function set(key: string, val: any) {
  storage.setItem(appIdentifier + key, JSON.stringify({ val }));
}

function setWithExpiration(key: string, val: any, mins: number) {
  const expireTime = isNaN(mins) ? 8 : mins;
  const expiresAt = new Date(Date.now() + expireTime * 1000 * 60);
  const wrapper = {
    val,
    expiresAt,
  };
  storage.setItem(appIdentifier + key, JSON.stringify(wrapper));
}

function get(key: string) {
  return getItem(appIdentifier + key);
}

initializeStorage();
removeExpired();

const localStorage =  {
  appIdentifier,
  set,
  get,
  remove,
  reset,
  getItem,
  initializeStorage,
  removeExpired,
  setWithExpiration
}

export default localStorage;