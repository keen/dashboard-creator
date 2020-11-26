export const previewMotion = {
  transition: { duration: 0.3 },
  animate: { top: 0, opacity: 1 },
  initial: { top: '100%', opacity: 0 },
  exit: { opacity: 0 },
};

export const actionsMotion = {
  transition: { duration: 0.3 },
  animate: { top: 0, opacity: 1 },
  initial: { top: -30, opacity: 0 },
  exit: { opacity: 0 },
};

export const actionsMenuMotion = {
  initial: { opacity: 0, top: 20, left: -10 },
  animate: { opacity: 1, top: 2, left: -10 },
  exit: { opacity: 0, top: 30, left: -10 },
};
