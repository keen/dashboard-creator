import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import WidgetItem from './WidgetItem';

const render = (overProps: any = {}) => {
  const props = {
    text: 'simple Text',
    ...overProps,
  };

  const wrapper = rtlRender(<WidgetItem {...props} />);

  return {
    props,
    wrapper,
  };
};

describe('WidgetItem', () => {
  describe('correct icon type', () => {
    test('renders the component', () => {
      const {
        wrapper: { getByText },
      } = render({ icon: 'arrow-up', text: 'Arrow Up' });

      expect(getByText('Arrow Up')).toBeInTheDocument();
    });
  });

  describe('no icon type', () => {
    test('renders the component', () => {
      const {
        wrapper: { getByText },
      } = render();

      expect(getByText('simple Text')).toBeInTheDocument();
    });
  });

  describe('not supported icon type', () => {
    test('does not render the component', () => {
      expect(() => {
        render({ icon: 'incorrect-type', text: 'Arrow Up' });
      }).toThrowError();
    });
  });
});
