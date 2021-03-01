import { findBiggestYPositionOfWidgets } from './findBiggestYPositionOfWidgets';

describe('finds biggest Y position of all of the dashboard widgets', () => {
  test('Scenario 1: Should return the biggest Y position of all the widgets if they exist', () => {
    const dashboardWidgets = [
      {
        widget: {
          position: {
            y: 10,
          },
        },
      },
      {
        widget: {
          position: {
            y: 14,
          },
        },
      },
      {
        widget: {
          position: {
            y: 9,
          },
        },
      },
    ];
    const biggestYPosition = findBiggestYPositionOfWidgets(dashboardWidgets);
    expect(biggestYPosition).toBe(14);
  });

  test('Scenario 2: Should return 0 if dashboard has no widgets', () => {
    const dashboardWidgets = [];
    const biggestYPosition = findBiggestYPositionOfWidgets(dashboardWidgets);
    expect(biggestYPosition).toBe(0);
  });
});
