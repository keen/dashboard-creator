import React, {
  FC,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dropdown,
  DropableContainer,
  DropableContainerVariant as Variant,
  DropdownList,
  DropdownListContainer,
  EmptySearch,
} from '@keen.io/ui-core';
import { useSearch } from '@keen.io/react-hooks';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import { Container } from './FontSelector.styles';

import { FONTS } from '../../../../modules/theme';
import { KEYBOARD_KEYS } from '../../constants';

type Props = {
  /** List of fonts to display identifer */
  font: string;
  /** Container variant */
  variant?: Variant;
  /** Error */
  hasError?: boolean;
  /** Font change event handler */
  onChange: (font: string) => void;
  /** Reset event handler */
  onReset?: () => void;
};

const FontSelector: FC<Props> = ({
  font,
  onChange,
  onReset,
  variant = 'secondary',
  hasError = false,
}) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [selectionIndex, setIndex] = useState<number>(null);

  const options = useMemo(
    () =>
      FONTS.map(({ name }) => ({
        label: name,
        value: name,
      })),
    [FONTS]
  );

  const [collectionsList, setCollectionsList] = useState(options);

  const collectionListRef = useRef(collectionsList);
  const selectionIndexRef = useRef(selectionIndex);

  selectionIndexRef.current = selectionIndex;
  collectionListRef.current = collectionsList;

  const keyboardHandler = useCallback(
    (e: KeyboardEvent) => {
      const { current: optionsList } = collectionListRef;
      switch (e.keyCode) {
        case KEYBOARD_KEYS.ENTER:
          if (optionsList && optionsList.length) {
            const { value } = optionsList[selectionIndexRef.current];
            onChange(value);
          }
          setOpen(false);
          break;
        case KEYBOARD_KEYS.UP:
          if (selectionIndexRef.current === null) {
            setIndex(0);
          } else if (selectionIndexRef.current > 0) {
            setIndex(selectionIndexRef.current - 1);
          }
          break;
        case KEYBOARD_KEYS.DOWN:
          if (selectionIndexRef.current === null) {
            setIndex(0);
          } else if (selectionIndexRef.current < optionsList.length - 1) {
            setIndex(selectionIndexRef.current + 1);
          }
          break;
        case KEYBOARD_KEYS.ESCAPE:
          setOpen(false);
          break;
      }
    },
    [collectionsList]
  );

  const { searchHandler, searchPhrase, clearSearchPhrase } = useSearch<{
    label: string;
    value: string;
  }>(options, (searchResult, phrase) => {
    setIndex(null);
    if (phrase) {
      setCollectionsList(searchResult);
    } else {
      setCollectionsList(options);
    }
  });

  useEffect(() => {
    if (isOpen) {
      const index = options.findIndex(({ value }) => value === font);
      setIndex(index);
      document.addEventListener('keydown', keyboardHandler);
    } else {
      setCollectionsList(options);
      clearSearchPhrase();
    }

    return () => {
      document.removeEventListener('keydown', keyboardHandler);
    };
  }, [isOpen]);

  useEffect(() => {
    setCollectionsList(options);
  }, [options]);

  useEffect(() => {
    return () => {
      if (onReset) onReset();
    };
  }, []);

  return (
    <Container>
      <DropableContainer
        variant={variant}
        hasError={hasError}
        searchPlaceholder={t(
          'query_creator_event_collection.search_placeholder'
        )}
        placeholder={t('query_creator_event_collection.placeholder')}
        onClick={() => !isOpen && setOpen(true)}
        isActive={isOpen}
        value={FONTS[0].name}
        searchable
        dropIndicator
        onSearch={searchHandler}
        onDefocus={() => {
          setOpen(false);
        }}
      >
        <BodyText variant="body2" color={colors.blue[500]} enableTextEllipsis>
          {font}
        </BodyText>
      </DropableContainer>
      <Dropdown isOpen={isOpen}>
        {searchPhrase && !collectionsList.length ? (
          <EmptySearch message={t('theme_editor.empty_search_results')} />
        ) : (
          <DropdownListContainer scrollToActive maxHeight={240}>
            {(activeItemRef) => (
              <DropdownList
                ref={activeItemRef}
                items={collectionsList}
                setActiveItem={(_item, idx) => selectionIndex === idx}
                onClick={(_e, { value }) => {
                  if (font !== value) {
                    onChange(value);
                  }
                  setCollectionsList(options);
                }}
              />
            )}
          </DropdownListContainer>
        )}
      </Dropdown>
    </Container>
  );
};

export default FontSelector;
