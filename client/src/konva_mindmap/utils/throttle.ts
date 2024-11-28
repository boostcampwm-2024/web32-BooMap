let timer = null;
export function throttle(fn: any, delay: number) {
  if (timer) return;
  timer = setTimeout(() => {
    fn();
    timer = null;
  }, delay);
}
