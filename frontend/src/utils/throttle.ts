export const throttle = (
  func: (dx: number, dy: number) => void,
  delay: number
): ((dx: number, dy: number) => void) => {
  let lastCall = 0;
  return (dx: number, dy: number) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(dx, dy);
  };
};
