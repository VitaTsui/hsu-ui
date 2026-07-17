/**
 * Get the element's top position relative to the viewport.
 * The dropdown uses position: fixed (positioned relative to the viewport), so this must
 * return viewport coordinates and must NOT add document.scrollTop — otherwise, when the
 * document itself is scrollable (e.g. docs-site long pages), the dropdown would be
 * positioned scrollTop pixels away and "disappear".
 * In fixed layouts (document does not scroll, scrollTop=0) this matches the original behavior.
 */
export function getElementTop(element: HTMLDivElement): number {
  return element.getBoundingClientRect().top;
}

/**
 * Get the element's left position relative to the viewport (same as above, for position: fixed).
 */
export function getElementLeft(element: HTMLDivElement): number {
  return element.getBoundingClientRect().left;
}

