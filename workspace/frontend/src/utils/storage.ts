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

/**
 * Demo 兜底宠物 — 当 tagId 未绑定真实数据时使用。
 * 用于宠主端展示页（PassPage / PetPage / DiaryListPage / DiaryDetailPage /
 * CollectionPage / CardPage / CheckinPage / FootprintPage），保证扫任何挂牌
 * 都能看到完整的豆豆 demo 体验。绑定流程（BindPage / Host*）不走这个兜底。
 */
const DEMO_PET_BASE: Omit<Pet, 'tagId'> = {
  name: '豆豆',
  photo: '/assets/doudou/doudou.png',
  checkinDate: '2026-05-25T08:30:00.000Z',
  status: 'active',
};

export function getPetByTagIdOrDemo(tagId: string | undefined): Pet {
  if (!tagId) return { tagId: 'doudou', ...DEMO_PET_BASE };
  const found = getPets().find((p) => p.tagId === tagId);
  if (found && found.photo) return found;
  // 用扫到的真实 tagId（保持挂牌号显示一致）+ 豆豆其余信息（保证有照片）
  return { tagId, ...DEMO_PET_BASE, name: found?.name || DEMO_PET_BASE.name };
}

/**
 * 民宿主端展示用 —— 保证显示固定的 demo 寄养清单（豆豆 + 小花），
 * 不受用户在 HostRegister 里手滑录入的脏数据影响。
 */
export function getDemoHostPets(): Pet[] {
  return [
    {
      tagId: 'doudou',
      name: '豆豆',
      photo: '/assets/doudou/doudou.png',
      checkinDate: '2026-05-25T08:30:00.000Z',
      status: 'active',
    },
    {
      tagId: 'xiaohua',
      name: '小花',
      photo: '/assets/xiaohua/xiaohua.png',
      checkinDate: '2026-05-27T11:00:00.000Z',
      status: 'active',
    },
  ];
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
