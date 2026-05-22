import type { Pet, StatusUpdate } from '../types';
import {
  getPets,
  savePets,
  getPetByTagId,
  savePet,
  removePet,
  getUpdates,
  saveUpdates,
  addUpdate,
  removeUpdates,
} from './storage';

interface TestResult {
  name: string;
  passed: boolean;
  detail: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, detail: string): void {
  results.push({ name, passed: condition, detail });
  if (!condition) {
    console.error(`FAIL  [${name}] ${detail}`);
  } else {
    console.log(`PASS  [${name}]`);
  }
}

function makeTestPet(overrides?: Partial<Pet>): Pet {
  return {
    tagId: '__test_dog_001',
    name: '测试狗',
    photo: 'data:image/png;base64,test',
    checkinDate: '2026-05-22T10:00:00.000Z',
    status: 'active',
    ...overrides,
  };
}

function makeTestUpdate(overrides?: Partial<StatusUpdate>): StatusUpdate {
  return {
    id: '__test_update_001',
    petTagId: '__test_dog_001',
    timestamp: '2026-05-22T12:00:00.000Z',
    text: '吃得很香',
    photo: 'data:image/png;base64,test_update',
    ...overrides,
  };
}

function cleanup(): void {
  removePet('__test_dog_001');
  removePet('__test_cat_002');
  removeUpdates('__test_dog_001');
  removeUpdates('__test_cat_002');
}

export function runStorageTest(): TestResult[] {
  results.length = 0;
  cleanup();

  console.group('Storage 自测');

  // ── 测试 1：空读不报错 ──
  const empty = getPets();
  assert(Array.isArray(empty) && empty.length === 0, '空读 getPets', '初始无数据时应返回空数组');

  const emptyUpdates = getUpdates('__test_dog_001');
  assert(
    Array.isArray(emptyUpdates) && emptyUpdates.length === 0,
    '空读 getUpdates',
    '初始无更新时应返回空数组',
  );

  // ── 测试 2：写入并读取 Pet[] ──
  const pet1 = makeTestPet();
  savePets([pet1]);
  const loaded = getPets();
  assert(loaded.length === 1, '写入一只宠物', `期望 1 只，实际 ${loaded.length} 只`);
  assert(loaded[0].tagId === '__test_dog_001', '读取 tagId', `期望 __test_dog_001，实际 ${loaded[0].tagId}`);

  // ── 测试 3：savePet 追加 ──
  const pet2 = makeTestPet({ tagId: '__test_cat_002', name: '测试猫' });
  savePet(pet2);
  const allPets = getPets();
  assert(allPets.length === 2, 'savePet 追加', `期望 2 只，实际 ${allPets.length} 只`);

  // ── 测试 4：savePet 覆盖更新 ──
  const pet1Updated = makeTestPet({ name: '测试狗(已改名)' });
  savePet(pet1Updated);
  const reloaded = getPets();
  assert(reloaded.length === 2, 'savePet 覆盖后数量不变', `期望 2 只，实际 ${reloaded.length} 只`);
  assert(
    reloaded.find((p) => p.tagId === '__test_dog_001')?.name === '测试狗(已改名)',
    'savePet 覆盖字段',
    'name 应已更新为 测试狗(已改名)',
  );

  // ── 测试 5：getPetByTagId ──
  const found = getPetByTagId('__test_dog_001');
  assert(found !== undefined, 'getPetByTagId 命中', `name = ${found?.name}`);
  const notFound = getPetByTagId('__nonexistent');
  assert(notFound === undefined, 'getPetByTagId 未命中', '应返回 undefined');

  // ── 测试 6：removePet ──
  removePet('__test_dog_001');
  const afterRemove = getPets();
  assert(afterRemove.length === 1, 'removePet', `期望 1 只，实际 ${afterRemove.length} 只`);
  assert(
    afterRemove[0].tagId === '__test_cat_002',
    'removePet 剩余正确',
    `剩余 tagId = ${afterRemove[0].tagId}`,
  );

  // ── 测试 7：写入并读取 StatusUpdate[] ──
  const update1 = makeTestUpdate();
  saveUpdates('__test_dog_001', [update1]);
  const loadedUpdates = getUpdates('__test_dog_001');
  assert(loadedUpdates.length === 1, '写入 StatusUpdate', `期望 1 条，实际 ${loadedUpdates.length} 条`);
  assert(loadedUpdates[0].text === '吃得很香', '读取 StatusUpdate 字段', `text = ${loadedUpdates[0].text}`);

  // ── 测试 8：addUpdate 追加 ──
  const update2 = makeTestUpdate({
    id: '__test_update_002',
    timestamp: '2026-05-22T14:00:00.000Z',
    text: '散步开心',
    overlaidPhoto: 'data:image/png;base64,overlaid',
    heritageStyle: '莫兰迪',
  });
  addUpdate(update2);
  const allUpdates = getUpdates('__test_dog_001');
  assert(allUpdates.length === 2, 'addUpdate 追加', `期望 2 条，实际 ${allUpdates.length} 条`);
  assert(
    allUpdates[1].overlaidPhoto === 'data:image/png;base64,overlaid',
    'addUpdate 可选字段',
    `overlaidPhoto = ${allUpdates[1].overlaidPhoto}`,
  );

  // ── 测试 9：removeUpdates ──
  removeUpdates('__test_dog_001');
  const afterRemoveUpdates = getUpdates('__test_dog_001');
  assert(
    afterRemoveUpdates.length === 0,
    'removeUpdates',
    `期望 0 条，实际 ${afterRemoveUpdates.length} 条`,
  );

  // ── 测试 10：跨 tagId 隔离 ──
  const updateCat = makeTestUpdate({ id: '__test_cat_update', petTagId: '__test_cat_002', text: '猫粮' });
  saveUpdates('__test_cat_002', [updateCat]);
  const catUpdates = getUpdates('__test_cat_002');
  const dogUpdates = getUpdates('__test_dog_001');
  assert(catUpdates.length === 1, '跨 tagId 隔离 - 猫', `猫有 ${catUpdates.length} 条`);
  assert(dogUpdates.length === 0, '跨 tagId 隔离 - 狗', `狗有 ${dogUpdates.length} 条`);

  // ── 测试 11：刷新不丢失（同一 session 内模拟） ──
  const preRefresh = getPets();
  savePets(preRefresh);
  const postRefresh = getPets();
  assert(
    postRefresh.length === preRefresh.length,
    '刷新不丢失',
    `刷新前 ${preRefresh.length}，刷新后 ${postRefresh.length}`,
  );

  // 清理
  cleanup();

  const passCount = results.filter((r) => r.passed).length;
  console.log(`---`);
  console.log(`自测完成: ${passCount}/${results.length} 通过`);
  console.groupEnd();

  return results;
}
