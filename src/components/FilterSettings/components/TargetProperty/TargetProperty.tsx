import React, { FC, useState, useEffect, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '@keen.io/react-hooks';
import {
  Dropdown,
  DropableContainer,
  PropertiesTree,
  createTree,
} from '@keen.io/ui-core';

import PropertyPath from '../PropertyPath';
import EmptySearch from '../../../EmptySearch';
import { Container, Message, Property } from './TargetProperty.styles';

import { AppContext } from '../../../../contexts';
import { SchemaPropertiesList } from '../../../../modules/filter';

import { getEventPath } from '../../../../utils';

type Props = {
  /** Disabled state */
  isDisabled: boolean;
  /** Current target property*/
  targetProperty: string | null;
  /** Event stream schema */
  schema: Record<string, string>;
  /** Event stream schema list */
  schemaList: SchemaPropertiesList;
  /** Event stream schema tree */
  schemaTree: Record<string, any>;
  /** Target property change event handler */
  onChange: (targetProperty: string) => void;
  /* Error indicator */
  hasError: boolean;
};

const TargetProperty: FC<Props> = ({
  targetProperty,
  schema,
  schemaList,
  schemaTree,
  onChange,
  isDisabled,
  hasError,
}) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [expandTree, setTreeExpand] = useState(false);

  const [propertiesTree, setPropertiesTree] = useState(null);

  const { modalContainer } = useContext(AppContext);
  const containerRef = useRef(null);

  const { searchHandler, searchPhrase, clearSearchPhrase } = useSearch<{
    path: string;
    type: string;
  }>(
    schemaList,
    (searchResult, phrase) => {
      if (phrase) {
        const searchTree = {};
        searchResult.forEach(({ path, type }) => {
          searchTree[path] = type;
        });
        setPropertiesTree(createTree(searchTree));
        setTreeExpand(true);
      } else {
        setTreeExpand(false);
        setPropertiesTree(null);
      }
    },
    {
      keys: ['path', 'type'],
      threshold: 0.4,
    }
  );

  useEffect(() => {
    if (!isOpen) {
      setTreeExpand(false);
      clearSearchPhrase();
    }
  }, [isOpen]);

  const isEmptySearch =
    searchPhrase && propertiesTree && !Object.keys(propertiesTree).length;

  return (
    <Container ref={containerRef} isDisabled={isDisabled}>
      <DropableContainer
        variant="secondary"
        placeholder={t('filter_settings.target_property_placeholder')}
        onClick={() => {
          if (!isOpen && !isDisabled) {
            setOpen(true);
          }
        }}
        isActive={isOpen}
        value={targetProperty}
        dropIndicator
        searchable
        searchPlaceholder={t(
          'filter_settings.target_property_search_placeholder'
        )}
        onSearch={searchHandler}
        onDefocus={(event) => {
          if (!getEventPath(event)?.includes(containerRef.current)) {
            setPropertiesTree(null);
            setOpen(false);
          }
        }}
      >
        <Property>
          {targetProperty && <PropertyPath path={targetProperty.split('.')} />}
        </Property>
      </DropableContainer>
      <Dropdown isOpen={isOpen}>
        {hasError && (
          <Message>{t('filter_settings.schema_processing_error')}</Message>
        )}
        {isEmptySearch && !hasError && (
          <EmptySearch
            message={t('filter_settings.target_property_empty_search_results')}
          />
        )}
        {!isEmptySearch && !hasError && (
          <PropertiesTree
            modalContainer={modalContainer}
            expanded={expandTree}
            onClick={(_e, property) => {
              setOpen(false);
              onChange(property);
              setPropertiesTree(createTree(schema));
            }}
            activeProperty={targetProperty}
            properties={propertiesTree ? propertiesTree : schemaTree}
          />
        )}
      </Dropdown>
    </Container>
  );
};
export default TargetProperty;
