import React from 'react';
import {
  render as rtlRender,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

import FilterQueries from './FilterQueries';

const render = (overProps: any = {}) => {
  const props = {
    tagsPool: ['marketing', 'it'],
    tagsFilters: [],
    showOnlyCachedQueries: false,
    onUpdateCacheFilter: jest.fn(),
    onUpdateTagsFilters: jest.fn(),
    onClearFilters: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<FilterQueries {...props} />);

  return {
    props,
    wrapper,
  };
};

mockAllIsIntersecting(true);

test('allows user to filter queries based on cache criteria', async () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const element = getByText('query_picker.filters.title');
  fireEvent.click(element);

  await waitFor(() => {
    const cacheFilter = getByText(
      'query_picker.filters.show_only_cached_queries'
    );
    fireEvent.click(cacheFilter);

    expect(props.onUpdateCacheFilter).toHaveBeenCalledWith(true);
  });
});

test('allows user to filter queries based on selected tags', async () => {
  const {
    wrapper: { getByText },
    props,
  } = render({
    project: {
      tagsPool: ['marketing', 'it'],
    },
  });

  const element = getByText('query_picker.filters.title');
  fireEvent.click(element);

  await waitFor(() => {
    const tagElement = getByText('marketing');
    fireEvent.click(tagElement);

    expect(props.onUpdateTagsFilters).toHaveBeenCalledWith(['marketing']);
  });
});

test('allows user to clear filters', async () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const element = getByText('query_picker.filters.title');
  fireEvent.click(element);

  await waitFor(() => {
    const element = getByText('query_picker.filters.clear');
    fireEvent.click(element);

    expect(props.onClearFilters).toHaveBeenCalled();
  });
});

test('renders the number of active filters', async () => {
  const {
    wrapper: { getByText },
  } = render({
    tagsFilters: ['marketing'],
    showOnlyCachedQueries: true,
  });

  expect(getByText('query_picker.filters.title (2)')).toBeInTheDocument();
});

test('allows user to search for a specific tag', async () => {
  const {
    wrapper: { getByText, getByPlaceholderText, queryByText },
  } = render({
    project: {
      tagsPool: ['marketing', 'it'],
    },
  });

  const element = getByText('query_picker.filters.title');
  fireEvent.click(element);

  await waitFor(() => {
    const search = getByText('query_picker.filters.search_label');
    fireEvent.click(search);

    const input = getByPlaceholderText(
      'query_picker.filters.search_tags_input_placeholder'
    );
    fireEvent.change(input, { target: { value: 'mar' } });

    expect(getByText('marketing')).toBeInTheDocument();
    expect(queryByText('it')).toBeNull();
  });
});
