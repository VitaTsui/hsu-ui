/**
 * Calculate the modal position, taking edge detection into account
 * @param left Target left offset
 * @param top Target top offset
 * @param modalWidth Modal width
 * @param modalHeight Modal height
 * @param edgeDetection Whether edge detection is enabled
 * @returns The calculated position
 */
export function calculatePosition(
  left: number,
  top: number,
  modalWidth: number,
  modalHeight: number,
  edgeDetection: boolean
): { left: number; top: number } {
  if (!edgeDetection) {
    return { left, top };
  }

  let newLeft = left < 0 ? 0 : left;
  let newTop = top < 0 ? 0 : top;

  if (newLeft + modalWidth > window.innerWidth) {
    newLeft = window.innerWidth - modalWidth;
  }

  if (newTop + modalHeight > window.innerHeight) {
    newTop = window.innerHeight - modalHeight;
  }

  return { left: newLeft, top: newTop };
}

