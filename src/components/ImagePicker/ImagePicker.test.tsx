import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import ImagePicker from './ImagePicker';

const render = (overProps: any = {}) => {
  const props = {
    ...overProps,
  };

  const mockStore = configureStore([]);
  const store = mockStore({});

  const wrapper = rtlRender(
    <Provider store={store}>
      <ImagePicker {...props} />
    </Provider>
  );

  return {
    props,
    store,
    wrapper,
  };
};

test('renders message about incorrect resource url', () => {
  const {
    wrapper: { getByText, container },
  } = render();

  const input = container.querySelector('input');
  fireEvent.change(input, { target: { value: 'image-url' } });

  const button = getByText('image_picker.insert_button');
  fireEvent.click(button);

  expect(getByText('image_picker.error')).toBeInTheDocument();
});

test('allows user to edit image url', () => {
  const {
    store,
    wrapper: { getByText, container },
  } = render();

  const input = container.querySelector('input');
  fireEvent.change(input, {
    target: { value: 'http://keen.io/placeholder.png' },
  });

  const button = getByText('image_picker.insert_button');
  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "link": "http://keen.io/placeholder.png",
        },
        "type": "@widgets/SAVE_IMAGE",
      },
    ]
  `);
});

test('allows user to cancel image edit', () => {
  const {
    store,
    wrapper: { getByText },
  } = render();

  const button = getByText('image_picker.cancel_button');
  fireEvent.click(button);
  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "app/hideImagePicker",
      },
    ]
  `);
});
