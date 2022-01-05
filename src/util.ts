/**
 * Timed loop function.
 *
 * @param fn - The function to run.
 * @param timestep - The time between each run.
 * @param n - If specified, the function will run n times.
 * @returns If n is specified, a promise that resolves when the loop is complete.
 */
export function loop(fn: () => void, timestep: number, n?: number) {
  if (n) {
    return new Promise<void>((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        fn();
        i += 1;
        if (i === n) {
          clearInterval(interval);
          resolve();
        }
      }, timestep);
    });
  }
  return setInterval(fn, timestep);
}

export default {};
