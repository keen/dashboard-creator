import React from 'react';
import { render } from '@testing-library/react';

import Placeholder from './Placeholder';

test('renders Placeholder', () => {
  const { container } = render(<Placeholder />);
  expect(container).toMatchSnapshot();
});
