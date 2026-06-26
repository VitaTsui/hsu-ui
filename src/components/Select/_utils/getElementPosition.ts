/**
 * 获取元素相对于视口的顶部位置。
 * 下拉框为 position: fixed（相对视口定位），故此处必须返回视口坐标，
 * 不能叠加 document.scrollTop——否则当文档本身可滚动时（如文档站长页面），
 * 下拉框会被定位到 scrollTop 像素之外而“消失”。
 * 在固定布局（document 不滚动，scrollTop=0）下与原行为一致。
 */
export function getElementTop(element: HTMLDivElement): number {
  return element.getBoundingClientRect().top;
}

/**
 * 获取元素相对于视口的左侧位置（同上，配合 position: fixed）。
 */
export function getElementLeft(element: HTMLDivElement): number {
  return element.getBoundingClientRect().left;
}

