import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, ModalHeader } from '@keen.io/ui-core';

import FilterSettings from '../FilterSettings';
import { filterActions, filterSelectors } from '../../modules/filter';

const FilterModal: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { isEditorOpen } = useSelector(filterSelectors.getFilterSettings);

  return (
    <Modal
      isOpen={isEditorOpen}
      onClose={() => dispatch(filterActions.closeEditor())}
    >
      {(_, closeHandler) => (
        <>
          <ModalHeader onClose={closeHandler}>
            {t('filter_settings.title')}
          </ModalHeader>
          <FilterSettings onCancel={closeHandler} />
        </>
      )}
    </Modal>
  );
};

export default FilterModal;
