import type { Pet, StatusUpdate } from '../types';

const PETS_KEY = 'moodmold:pets';
const UPDATES_KEY_PREFIX = 'moodmold:updates:';

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write to localStorage key "${key}":`, e);
  }
}

export function getPets(): Pet[] {
  return safeGet<Pet[]>(PETS_KEY, []);
}

export function savePets(pets: Pet[]): void {
  safeSet(PETS_KEY, pets);
}

export function getPetByTagId(tagId: string): Pet | undefined {
  const pets = getPets();
  return pets.find((p) => p.tagId === tagId);
}

export function savePet(pet: Pet): void {
  const pets = getPets();
  const index = pets.findIndex((p) => p.tagId === pet.tagId);
  if (index >= 0) {
    pets[index] = pet;
  } else {
    pets.push(pet);
  }
  savePets(pets);
}

export function removePet(tagId: string): void {
  const pets = getPets().filter((p) => p.tagId !== tagId);
  savePets(pets);
}

export function getUpdates(tagId: string): StatusUpdate[] {
  return safeGet<StatusUpdate[]>(`${UPDATES_KEY_PREFIX}${tagId}`, []);
}

export function saveUpdates(tagId: string, updates: StatusUpdate[]): void {
  safeSet(`${UPDATES_KEY_PREFIX}${tagId}`, updates);
}

export function addUpdate(update: StatusUpdate): void {
  const updates = getUpdates(update.petTagId);
  updates.push(update);
  saveUpdates(update.petTagId, updates);
}

export function removeUpdates(tagId: string): void {
  try {
    localStorage.removeItem(`${UPDATES_KEY_PREFIX}${tagId}`);
  } catch (e) {
    console.error(`Failed to remove updates for tagId "${tagId}":`, e);
  }
}
