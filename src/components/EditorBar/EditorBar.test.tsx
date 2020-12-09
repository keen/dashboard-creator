import React from 'react';
import moment from 'moment';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import EditorBar from './EditorBar';

const render = (overProps: any = {}) => {
  const props = {
    onFinishEdit: () => ({}),
    lastSaveTime: null,
    isSaving: false,
    ...overProps,
  };

  const wrapper = rtlRender(
    <EditorBar {...props}>
      <div>Children Element</div>
    </EditorBar>
  );

  return {
    props,
    wrapper,
  };
};

describe('EditorBar', () => {
  describe('lastSaveTime is set correctly', () => {
    test('it renders the component with children elements', () => {
      const timestamp = 1607525787826;
      const text = moment(timestamp).fromNow();
      const {
        wrapper: { getByText },
      } = render({ lastSaveTime: timestamp });

      expect(getByText('Children Element')).toBeInTheDocument();
      expect(getByText(`editor_bar.saved ${text}`)).toBeInTheDocument();
    });
  });

  describe('isSaving set to true', () => {
    test('it renders "Is saving..." text', () => {
      const {
        wrapper: { getByText },
      } = render({ isSaving: true });

      expect(getByText('Children Element')).toBeInTheDocument();
      expect(getByText('Is saving...')).toBeInTheDocument();
    });
  });

  describe('finish edition function', () => {
    test('it triggers correctly', () => {
      let result = 1;
      const {
        wrapper: { getByText },
      } = render({ onFinishEdit: () => (result = 10) });

      const finishButton = getByText(`editor_bar.finish_edition`);
      fireEvent.click(finishButton);
      expect(result).toBe(10);
    });
  });
});
