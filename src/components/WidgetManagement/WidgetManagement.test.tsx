import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import WidgetManagement from './WidgetManagement';

const render = (overProps: any = {}) => {
  const props = {
    widgetId: '@widget/01',
    isHoverActive: true,
    editButtonLabel: 'editButtonLabel',
    onCloneWidget: jest.fn(),
    onEditWidget: jest.fn(),
    onRemoveWidget: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<WidgetManagement {...props} />);

  return {
    props,
    wrapper,
  };
};

test('allows user to remove widget', () => {
  const {
    props,
    wrapper: { container, getByText },
  } = render();

  const button = container.querySelector(
    '[data-testid="delete-widget"] button'
  );
  fireEvent.click(button);

  const confirmButton = getByText('widget.remove_confirm_button');
  fireEvent.click(confirmButton);

  expect(props.onRemoveWidget).toHaveBeenCalled();
});

test('allows user to edit widget', () => {
  const {
    props,
    wrapper: { getByText },
  } = render();

  const editButton = getByText(props.editButtonLabel);
  fireEvent.click(editButton);

  expect(props.onEditWidget).toHaveBeenCalled();
});

test('allows user to clone widget', () => {
  const {
    props,
    wrapper: { container },
  } = render();

  const button = container.querySelector('[data-testid="clone-widget"] button');
  fireEvent.click(button);

  expect(props.onCloneWidget).toHaveBeenCalled();
});

test('do not allows user to clone widget', () => {
  const {
    wrapper: { queryByTestId },
  } = render({
    cloneAllowed: false,
  });

  expect(queryByTestId('clone-widget')).not.toBeInTheDocument();
});

test('do not allows user to edit widget', () => {
  const {
    wrapper: { queryByTestId },
  } = render({
    editAllowed: false,
  });

  expect(queryByTestId('edit-widget')).not.toBeInTheDocument();
});
