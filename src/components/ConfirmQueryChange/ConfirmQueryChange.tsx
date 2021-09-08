import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { transparentize } from 'polished';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';
import {
  Anchor,
  Modal,
  Button,
  ModalHeader,
  ModalFooter,
  FadeLoader,
} from '@keen.io/ui-core';

import {
  Container,
  Content,
  Back,
  Footer,
  NoDashboardConnection,
  List,
  ListItem,
  Loader,
  Error,
} from './ConfirmQueryChange.styles';

import { chartEditorActions } from '../../modules/chartEditor';
import { dashboardsSelectors } from '../../modules/dashboards';

type Props = {
  /** Chart editor open indicator */
  isOpen: boolean;
};

const ConfirmQueryChange: FC<Props> = ({ isOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      dispatch(chartEditorActions.queryUpdateConfirmationMounted());
    }
  }, [isOpen]);

  const [inViewRef, inView] = useInView();

  const connectedDashboards = useSelector(
    dashboardsSelectors.getConnectedDashboards
  );
  const isConnectedDashboardsError = useSelector(
    dashboardsSelectors.getConnectedDashboardsError
  );
  const isConnectedDashboardsLoading = useSelector(
    dashboardsSelectors.getConnectedDashboardsLoading
  );

  return (
    <Modal
      isOpen={isOpen}
      adjustPositionToScroll={false}
      onClose={() => dispatch(chartEditorActions.hideQueryUpdateConfirmation())}
    >
      {(_, closeHandler) => (
        <Container id="confirm-query-update">
          <ModalHeader onClose={closeHandler}>
            {t('confirm_query_change.title')}
          </ModalHeader>
          <Content isOverflow={!inView}>
            {isConnectedDashboardsError && (
              <Error>
                <BodyText variant="body1" color={colors.red[500]}>
                  {t('confirm_query_change.dashboard_connection_error')}
                </BodyText>
              </Error>
            )}
            {isConnectedDashboardsLoading && (
              <Loader>
                <FadeLoader color={colors.blue[500]} height={40} width={40} />
              </Loader>
            )}
            {!isConnectedDashboardsError && !isConnectedDashboardsLoading && (
              <>
                <BodyText variant="body1" color={colors.black[300]}>
                  {!!connectedDashboards.length
                    ? t('confirm_query_change.update_with_dashboards_connected')
                    : t('confirm_query_change.update_no_dashboards_connected')}
                </BodyText>
                {!connectedDashboards.length && (
                  <NoDashboardConnection>
                    <BodyText
                      variant="body1"
                      color={transparentize(0.5, colors.black[300])}
                    >
                      {t('confirm_query_change.not_connected_saved_query')}
                    </BodyText>
                  </NoDashboardConnection>
                )}
                {!!connectedDashboards.length && (
                  <List>
                    {connectedDashboards.map(({ id, title }) => (
                      <ListItem key={id}>
                        <BodyText variant="body1" color={colors.black[300]}>
                          {title ||
                            t('confirm_query_change.untitled_dashboard')}
                        </BodyText>
                      </ListItem>
                    ))}
                    <div ref={inViewRef}></div>
                  </List>
                )}
              </>
            )}
          </Content>
          <ModalFooter>
            <Footer>
              <Button
                variant="secondary"
                onClick={() =>
                  dispatch(chartEditorActions.confirmSaveQueryUpdate())
                }
              >
                {t('confirm_query_change.update_save_query')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => dispatch(chartEditorActions.useQueryForWidget())}
              >
                {t('confirm_query_change.update_ad_hoc_query')}
              </Button>
              <Back>
                <Anchor onClick={closeHandler}>
                  {t('confirm_query_change.cancel')}
                </Anchor>
              </Back>
            </Footer>
          </ModalFooter>
        </Container>
      )}
    </Modal>
  );
};

export default ConfirmQueryChange;
