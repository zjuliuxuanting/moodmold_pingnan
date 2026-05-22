let globalShow: ((msg: string) => void) | null = null;

export function registerToastShow(fn: (msg: string) => void) {
  globalShow = fn;
  return () => { globalShow = null; };
}

export function toast(msg: string): void {
  if (globalShow) globalShow(msg);
}
