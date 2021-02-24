import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render as rtlRender } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import { AppContext } from '../../contexts';
import FilterWidget from './FilterWidget';
import {
  APPLY_FILTER_MODIFIERS,
  APPLY_FILTER_WIDGET,
  SET_FILTER_WIDGET,
  UNAPPLY_FILTER_WIDGET,
} from '../../modules/widgets/constants';

const render = (storeState: any = {}, overProps: any = {}) => {
  const widgetId = '@widget/01';
  const props = {
    id: widgetId,
    ...overProps,
  };

  const state = {
    widgets: {
      items: {
        [widgetId]: {
          isActive: true,
          data: {
            propertyList: ['Warsaw', 'Berlin', 'Moscow', 'Beijing'],
            filter: {
              propertyValue: ['Warsaw'],
            },
          },
          widget: {
            id: widgetId,
            settings: {
              targetProperty: 'geo_info.city',
            },
          },
        },
      },
    },
    ...storeState,
  };

  const mockStore = configureStore([]);
  const store = mockStore({ ...state });

  const origDispatch = store.dispatch;
  store.dispatch = jest.fn(origDispatch);

  const wrapper = rtlRender(
    <Provider store={store}>
      <AppContext.Provider
        value={
          {
            modalContainer: '#modal-root',
          } as any
        }
      >
        <FilterWidget {...props} />
      </AppContext.Provider>
    </Provider>
  );

  return {
    props,
    store,
    wrapper,
  };
};

beforeEach(() => {
  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  }
});

test('should render selected target property', () => {
  const widgetId = '@widget/01';

  const state = {
    widgets: {
      items: {
        [widgetId]: {
          isActive: false,
          data: null,
          widget: {
            id: widgetId,
            settings: {
              targetProperty: 'geo_info.city',
            },
          },
        },
      },
    },
  };
  const {
    wrapper: { getByRole },
  } = render({ ...state }, { id: widgetId });

  const heading = getByRole('heading');
  expect(heading.textContent).toEqual('city');
});

test('should render applied properties number', () => {
  const {
    wrapper: { getByTestId },
  } = render();
  const appliedPropertiesNumber = getByTestId('applied-properties-number');
  expect(appliedPropertiesNumber.textContent).toEqual('1');
});

test('should fetch available property values if filter data is empty', () => {
  const widgetId = '@widget/02';
  const state = {
    widgets: {
      items: {
        [widgetId]: {
          isActive: false,
          data: null,
          widget: {
            id: widgetId,
            settings: {
              targetProperty: 'geo_info.city',
            },
          },
        },
      },
    },
  };
  const {
    wrapper: { getByTestId },
    store,
  } = render({ ...state }, { id: widgetId });

  const filterWidget = getByTestId('filter-widget');
  fireEvent.click(filterWidget);
  expect(store.dispatch).toHaveBeenCalledWith({
    payload: { widgetId: widgetId },
    type: SET_FILTER_WIDGET,
  });
});

test('should not fetch property values when property list inside filter is not empty', () => {
  const {
    wrapper: { getByTestId },
    store,
  } = render();

  const filterWidget = getByTestId('filter-widget');
  fireEvent.click(filterWidget);
  expect(store.dispatch).not.toHaveBeenCalled();
});

test('should render property values when property list inside filter is not empty', () => {
  const {
    wrapper: { getByTestId },
  } = render();

  const filterWidget = getByTestId('filter-widget');
  fireEvent.click(filterWidget);
  const scrollWrapper = getByTestId('scroll-wrapper');
  const childElementCount =
    scrollWrapper.children[0].children[0].childElementCount;
  expect(childElementCount).toEqual(4);
});

test('should filter property values correctly', async () => {
  const {
    wrapper: { getByTestId, getByText, findByPlaceholderText },
  } = render();

  const filterWidget = getByTestId('filter-widget');
  fireEvent.click(filterWidget);

  const search = getByText('filter_widget.search_value');
  fireEvent.click(search);

  const searchInput = await findByPlaceholderText('filter_widget.search_value');
  fireEvent.change(searchInput, { target: { value: 'Be' } });

  const scrollWrapper = getByTestId('scroll-wrapper');
  const childElementCount =
    scrollWrapper.children[0].children[0].childElementCount;
  expect(childElementCount).toEqual(2);
});

test('should apply checked values base on applied filter property values', () => {
  const {
    wrapper: { getByTestId, getByText },
    store,
  } = render();
  const filterWidget = getByTestId('filter-widget');
  fireEvent.click(filterWidget);

  const applyBtn = getByText('filter_widget.apply');
  fireEvent.click(applyBtn);
  expect(store.dispatch).toHaveBeenNthCalledWith(1, {
    payload: { filterId: '@widget/01', propertyValue: ['Warsaw'] },
    type: APPLY_FILTER_WIDGET,
  });
  expect(store.dispatch).toHaveBeenNthCalledWith(2, {
    payload: { id: '@widget/01' },
    type: APPLY_FILTER_MODIFIERS,
  });
});

test('should allow to unapply filter widget selected properties', () => {
  const {
    wrapper: { getByTestId, getByText },
    store,
  } = render();
  const filterWidget = getByTestId('filter-widget');
  fireEvent.click(filterWidget);

  const applyBtn = getByText('filter_widget.clear');
  fireEvent.click(applyBtn);
  expect(store.dispatch).toHaveBeenCalledWith({
    payload: { filterId: '@widget/01' },
    type: UNAPPLY_FILTER_WIDGET,
  });
});
