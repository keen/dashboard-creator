import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import DraggableItem from './DraggableItem';

const render = (overProps: any = {}) => {
  const props = {
    text: 'simple Text',
    type: 'text',
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

describe('DraggableItem', () => {
  describe('correct type & icon type', () => {
    test('renders the component', () => {
      const {
        wrapper: { getByText },
      } = render({ icon: 'arrow-up', text: 'Arrow Up' });

      expect(getByText('Arrow Up')).toBeInTheDocument();
    });
  });

  describe('drag events function', () => {
    test('it triggers correctly', () => {
      const {
        wrapper: { getByText },
        props,
      } = render();

      const finishButton = getByText('simple Text');
      fireEvent.dragStart(finishButton);
      expect(props.dragStartHandler).toHaveBeenCalled();

      fireEvent.dragEnd(finishButton);
      expect(props.dragEndHandler).toHaveBeenCalled();
    });
  });
});
