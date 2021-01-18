export const settingsMotion = {
  transition: { duration: 0.3 },
  animate: { top: 0, opacity: 1 },
  initial: { top: '100%', opacity: 0 },
  exit: { opacity: 0, top: '100%' },
};

export const removeMotion = {
  transition: { duration: 0.3 },
  animate: { top: 0, opacity: 1 },
  initial: { top: '-100%', opacity: 0 },
  exit: { opacity: 0, top: '-100%' },
};
