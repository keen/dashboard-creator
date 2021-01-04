import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Anchor, Modal, ModalHeader, ModalFooter } from '@keen.io/ui-core';

import { Container, Cancel } from './ConfirmQueryChange.styles';

import {
  hideQueryUpdateConfirmation,
  confirmSaveQueryUpdate,
  useQueryForWidget,
} from '../../modules/chartEditor';

type Props = {
  /** Chart editor open indicator */
  isOpen: boolean;
};

const ConfirmQueryChange: FC<Props> = ({ isOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(hideQueryUpdateConfirmation())}
    >
      {(_, closeHandler) => (
        <Container>
          <ModalHeader onClose={closeHandler}>
            {t('confirm_query_change.title')}
          </ModalHeader>
          <div>
            <div onClick={() => dispatch(confirmSaveQueryUpdate())}>
              Update Saved Query and Add to Dashboard
            </div>
            <div onClick={() => dispatch(useQueryForWidget())}>
              Save only for this widget
            </div>
          </div>
          <ModalFooter>
            <Cancel>
              <Anchor onClick={closeHandler}>
                {t('confirm_query_change.cancel')}
              </Anchor>
            </Cancel>
          </ModalFooter>
        </Container>
      )}
    </Modal>
  );
};

export default ConfirmQueryChange;
