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

test('renders count for many queries', () => {
  const {
    wrapper: { getByText, getByRole },
    props: { queriesCount },
  } = render();

  const element = getByRole('article');
  fireEvent.mouseEnter(element);

  expect(
    getByText(`${queriesCount} dashboard_tile.queries`)
  ).toBeInTheDocument();
});

test('renders count for one query', () => {
  const {
    wrapper: { getByRole, getByText },
  } = render({ queriesCount: 1 });
  const element = getByRole('article');
  fireEvent.mouseEnter(element);

  expect(getByText(/1 dashboard_tile.query/i)).toBeInTheDocument();
});

test('renders count for no query', () => {
  const {
    wrapper: { getByRole, getByText },
  } = render({ queriesCount: 0 });
  const element = getByRole('article');
  fireEvent.mouseEnter(element);

  expect(getByText(/dashboard_tile.no_queries/i)).toBeInTheDocument();
});

test('renders actions buttons for user with edit privileges', () => {
  const {
    wrapper: { getByTestId, getByRole },
  } = render();
  const element = getByRole('article');
  fireEvent.mouseEnter(element);

  expect(getByTestId('dashboard-actions')).toBeInTheDocument();
});

test('do not renders actions buttons for user without edit privileges', () => {
  const {
    wrapper: { queryByTestId, getByRole },
  } = render({
    editPrivileges: false,
  });
  const element = getByRole('article');
  fireEvent.mouseEnter(element);

  expect(queryByTestId('dashboard-actions')).not.toBeInTheDocument();
});

test('should call onShowSettings when settings button is clicked', () => {
  const {
    wrapper: { getByTestId, getByRole },
    props: { onShowSettings },
  } = render();
  const element = getByRole('article');
  fireEvent.mouseEnter(element);

  const button = getByTestId('dashboard-actions').querySelector('button');
  fireEvent.click(button);

  expect(onShowSettings).toHaveBeenCalled();
});

test('renders preview button on hover', () => {
  const {
    wrapper: { getByText, getByRole },
  } = render();
  const element = getByRole('article');
  fireEvent.mouseEnter(element);

  expect(getByText('dashboard_tile.preview_dashboard')).toBeInTheDocument();
});

test('should call onPreview when preview button is clicked', () => {
  const {
    wrapper: { getByText, getByRole },
    props: { onPreview },
  } = render();
  const element = getByRole('article');
  fireEvent.mouseEnter(element);

  const button = getByText('dashboard_tile.preview_dashboard');
  fireEvent.click(button);

  expect(onPreview).toHaveBeenCalled();
});
