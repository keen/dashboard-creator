import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import DashboardTile from './DashboardTile';

const render = (overProps: any = {}) => {
  const props = {
    id: 'id',
    lastModificationDate: '1/1/2021',
    queriesCount: 10,
    title: 'Title',
    useDefaultThumbnail: true,
    onPreview: jest.fn(),
    onShowSettings: jest.fn(),
    editPrivileges: true,
    ...overProps,
  };

  const wrapper = rtlRender(<DashboardTile {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders Dashboard title', () => {
  const {
    wrapper: { getByText },
    props: { title },
  } = render();
  expect(getByText(title)).toBeInTheDocument();
});

test('renders last modification date', () => {
  const {
    wrapper: { getByText },
    props: { lastModificationDate },
  } = render();
  expect(getByText(lastModificationDate)).toBeInTheDocument();
});

test('renders "Public" label', () => {
  const {
    wrapper: { getByText },
  } = render({ isPublic: true });
  expect(getByText('dashboard_tile.public'));
});

test('renders Dashboard tags', () => {
  const tags = ['label1', 'label2', 'label3'];
  const {
    wrapper: { getByText },
  } = render({ tags });

  tags.forEach((tag) => expect(getByText(tag)).toBeInTheDocument());
});

test('renders queries count', () => {
  const {
    wrapper: { getByText, container },
    props: { queriesCount },
  } = render();

  fireEvent.mouseEnter(container.querySelector('article'));
  expect(
    getByText(`dashboard_tile.queries ${queriesCount}`)
  ).toBeInTheDocument();
});

test('renders actions buttons for user with edit privileges', () => {
  const {
    wrapper: { getByTestId, container },
  } = render();
  fireEvent.mouseEnter(container.querySelector('article'));

  expect(getByTestId('dashboard-actions')).toBeInTheDocument();
});

test('do not renders actions buttons for user without edit privileges', () => {
  const {
    wrapper: { queryByTestId, container },
  } = render({
    editPrivileges: false,
  });
  fireEvent.mouseEnter(container.querySelector('article'));

  expect(queryByTestId('dashboard-actions')).not.toBeInTheDocument();
});

test('should call onShowSettings when settings button is clicked', () => {
  const {
    wrapper: { getByTestId, container },
    props: { onShowSettings },
  } = render();
  fireEvent.mouseEnter(container.querySelector('article'));

  const button = getByTestId('dashboard-actions').querySelector('button');
  fireEvent.click(button);

  expect(onShowSettings).toHaveBeenCalled();
});

test('renders preview button on hover', () => {
  const {
    wrapper: { getByText, container },
  } = render();
  fireEvent.mouseEnter(container.querySelector('article'));

  expect(getByText('dashboard_tile.preview_dashboard')).toBeInTheDocument();
});

test('should call onPreview when preview button is clicked', () => {
  const {
    wrapper: { getByText, container },
    props: { onPreview },
  } = render();
  fireEvent.mouseEnter(container.querySelector('article'));

  const button = getByText('dashboard_tile.preview_dashboard');
  fireEvent.click(button);

  expect(onPreview).toHaveBeenCalled();
});
