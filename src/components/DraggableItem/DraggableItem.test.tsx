import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import DraggableItem from './DraggableItem';

const render = (overProps: any = {}) => {
  const props = {
    text: 'Draggable item',
    type: 'text',
    onClick: jest.fn(),
    dragStartHandler: jest.fn(),
    dragEndHandler: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<DraggableItem {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders text based on property', () => {
  const {
    wrapper: { getByText },
  } = render({ icon: 'arrow-up', text: 'Arrow Up' });

  expect(getByText('Arrow Up')).toBeInTheDocument();
});

test('calls "onClick" event handler ', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const item = getByText(props.text);
  fireEvent.click(item);

  expect(props.onClick).toHaveBeenCalled();
});

test('handles drag events correctly', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const item = getByText(props.text);
  fireEvent.dragStart(item);
  expect(props.dragStartHandler).toHaveBeenCalled();

  fireEvent.dragEnd(item);
  expect(props.dragEndHandler).toHaveBeenCalled();
});
