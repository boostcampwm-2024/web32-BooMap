export function throttle(fn: any, delay: number) {
  let timer = null;
  return (function () {
    if (timer) return;
    timer = setTimeout(() => {
      fn();
      timer = null;
    }, delay);
  })();
}
