import React from 'react';
import { render } from '@testing-library/react';
import { PickerWidgets } from '@keen.io/widget-picker';
import { KeenDataviz } from '@keen.io/dataviz';

import DataViz from './Dataviz';
import { WidgetSettings } from '@keen.io/widgets';

const renderMock = jest.fn();
const errorMock = jest.fn();

jest.mock('@keen.io/dataviz', () => {
  return {
    KeenDataviz: jest.fn().mockImplementation(() => {
      return { render: renderMock, error: errorMock };
    }),
  };
});

const initialProps = {
  visualization: 'bar' as Exclude<PickerWidgets, 'json'>,
  analysisResults: {
    query: {},
    result: 20,
  },
  chartSettings: {
    gridX: {
      enabled: true,
    },
  },
  widgetSettings: {
    card: {
      enabled: false,
    },
  } as WidgetSettings,
  dashboardSettings: {
    tiles: {
      background: 'transparent',
      borderColor: 'transparent',
      borderRadius: 0,
      borderWidth: 0,
      padding: 0,
      hasShadow: false,
    },
  },
  presentationTimezone: 60,
};

beforeEach(() => {
  (KeenDataviz as any).mockClear();
  renderMock.mockClear();
});

test('creates KeenDataviz instance', () => {
  render(<DataViz {...initialProps} />);
  expect(KeenDataviz).toHaveBeenCalledTimes(1);
});

test('creates KeenDataviz instance with theme settings', () => {
  render(<DataViz {...initialProps} />);

  expect(KeenDataviz).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'bar',
      settings: {
        gridX: {
          enabled: true,
        },
      },
      widget: {
        card: {
          enabled: false,
        },
        tags: [],
      },
    })
  );
});

test('calls KeenDataviz render method with analysis results', () => {
  render(<DataViz {...initialProps} />);
  expect(renderMock).toHaveBeenCalledWith(initialProps.analysisResults);
});

test('calls KeenDataviz render method with presentation timezone', () => {
  render(<DataViz {...initialProps} />);
  expect(KeenDataviz).toHaveBeenCalledWith(
    expect.objectContaining({
      presentationTimezone: initialProps.presentationTimezone,
    })
  );
});
