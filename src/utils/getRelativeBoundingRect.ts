/**
 * Creates basic settings for heading widget section.
 *
 * @param parent - relative HTML element
 * @param child - target HTML element
 * @return DOM rectangle position calculated relative to parent
 *
 */
export const getRelativeBoundingRect = (
  parent: HTMLElement,
  child: HTMLElement
): Partial<DOMRect> => {
  const parentRect = parent.getBoundingClientRect();
  const { top, left, right, bottom } = child.getBoundingClientRect();

  return {
    top: top - parentRect.top,
    left: left - parentRect.left,
    right: right - parentRect.right,
    bottom: bottom - parentRect.bottom,
  };
};
