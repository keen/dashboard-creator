import React from 'react';
import moment from 'moment';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import EditorBar from './EditorBar';

const render = (overProps: any = {}, overStore: any = {}) => {
  const props = {
    onFinishEdit: jest.fn(),
    lastSaveTime: null,
    isSaving: false,
    ...overProps,
  };

  const mockStore = configureStore([]);
  const store = mockStore({
    app: {
      user: {
        permissions: [],
      },
    },
    ...overStore,
  });

  const wrapper = rtlRender(
    <Provider store={store}>
      <EditorBar {...props}>
        <div>Children Element</div>
      </EditorBar>
    </Provider>
  );

  return {
    props,
    wrapper,
  };
};

test('renders information about last save time', () => {
  const timestamp = 1607525787826;
  const timeAgo = moment(timestamp).fromNow();
  const {
    wrapper: { getByText },
  } = render({ lastSaveTime: timestamp });

  expect(getByText(`editor_bar.saved ${timeAgo}`)).toBeInTheDocument();
});

test('renders children nodes', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(getByText('Children Element')).toBeInTheDocument();
});

test('renders saving indicator', () => {
  const {
    wrapper: { getByText },
  } = render({ isSaving: true });

  expect(getByText('editor_bar.is_saving')).toBeInTheDocument();
});

test('allows user to finish dashboard edition', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const finishButton = getByText(`editor_bar.finish_edition`);
  fireEvent.click(finishButton);

  expect(props.onFinishEdit).toHaveBeenCalled();
});

test('theming button is not visible when permissions are not granted', () => {
  const {
    wrapper: { queryByText },
  } = render();

  expect(queryByText('editor_bar.theming')).toBeNull();
});

test('theming button is visible when permissions are granted', () => {
  const {
    wrapper: { getByText },
  } = render(
    {},
    {
      app: {
        user: { permissions: ['edit-dashboard', 'edit-dashboard-theme'] },
      },
    }
  );

  expect(getByText('editor_bar.theming')).toBeInTheDocument();
});
