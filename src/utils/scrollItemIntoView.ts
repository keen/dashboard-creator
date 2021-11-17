export const scrollItemIntoView = (id: string): void => {
  const element = document.getElementById(id);
  if (element)
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
};
