import React, { FC } from 'react';
import { Input } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import { ClearPhrase } from './SearchInput.styles';

type Props = {
  /** Search phrase */
  searchPhrase: string;
  /** Input placeholder */
  placeholder: string;
  /** Change phrase event handler */
  onChangePhrase: (phrase: string) => void;
  /** Clear search phrase */
  onClearSearch: () => void;
};

const SearchInput: FC<Props> = ({
  searchPhrase,
  onChangePhrase,
  onClearSearch,
  placeholder,
}) => (
  <Input
    variant="solid"
    type="text"
    value={searchPhrase}
    placeholder={placeholder}
    onChange={(e) => onChangePhrase(e.currentTarget.value)}
    renderPrefix={() => (
      <Icon type="search" width={15} height={15} fill={colors.blue[500]} />
    )}
    renderSuffix={() =>
      searchPhrase ? (
        <ClearPhrase
          role="button"
          onClick={onClearSearch}
          data-testid="clear-search"
        >
          <Icon type="close" width={10} height={10} fill={colors.gray[500]} />
        </ClearPhrase>
      ) : null
    }
  />
);

export default SearchInput;
