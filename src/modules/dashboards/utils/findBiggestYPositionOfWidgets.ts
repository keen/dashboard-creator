export const findBiggestYPositionOfWidgets = (widgets) => {
  const widgetYPositions = widgets.map((widget) => widget.widget.position.y);
  return widgetYPositions.length > 0 ? Math.max(...widgetYPositions) : 0;
};
