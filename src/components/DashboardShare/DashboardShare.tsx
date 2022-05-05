/* eslint-disable @typescript-eslint/naming-convention */
import React, {
  FC,
  useEffect,
  useContext,
  useCallback,
  useState,
  useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { ModalHeader, Toggle, Tooltip, Tabs, Alert } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import { APIContext } from '../../contexts';

import { EmbedCode, ModalContent, PublicLink } from './components';
import {
  Label,
  TooltipWrapper,
  TooltipContainer,
  TooltipContent,
  ToggleWrapper,
  Text,
  ModalWrapper,
  TabsContainer,
  Divider,
} from './DashboardShare.styles';

import { TOOLTIP_MOTION } from '../../constants';
import {
  MODAL_VIEWS,
  PUBLIC_LINK_VIEW_ID,
  EMBED_HTML_VIEW_ID,
  ACCESS_KEY_ERROR,
} from './constants';

import { RootState } from '../../rootReducer';
import { createPublicDashboardKeyName } from '../../modules/dashboards/utils';
import {
  dashboardsActions,
  dashboardsSelectors,
} from '../../modules/dashboards';

type Props = {
  /** Dashboard identifier */
  dashboardId: string;
};

const DashboardShare: FC<Props> = ({ dashboardId }) => {
  const dispatch = useDispatch();
  const { keenAnalysis } = useContext(APIContext);
  const { t } = useTranslation();

  const { isPublic, publicAccessKey } = useSelector((state: RootState) => {
    if (dashboardId)
      return dashboardsSelectors.getDashboardMeta(state, dashboardId);
    return {
      isPublic: false,
      publicAccessKey: null,
    };
  });

  const [labelTooltip, setLabelTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState(MODAL_VIEWS[0].id);
  const [accessKeyError, setAccessKeyError] = useState(null);

  const tabs = useMemo(
    () => MODAL_VIEWS.map((view) => ({ ...view, label: t(view.label) })),
    []
  );

  useEffect(() => {
    const keyName = createPublicDashboardKeyName(dashboardId);
    const accessKey = keenAnalysis
      .get(keenAnalysis.url('projectId', `keys?name=${keyName}`))
      .auth(keenAnalysis.masterKey())
      .send();

    accessKey
      .then((res) => {
        if (!res.length && isPublic) {
          setAccessKeyError(t(ACCESS_KEY_ERROR.NOT_EXIST));
          dispatch(
            dashboardsActions.setDashboardPublicAccess({
              dashboardId,
              isPublic: false,
              accessKey: null,
            })
          );
        }
        if (res.length) {
          const { is_active, key } = res[0];
          if (key !== publicAccessKey)
            dispatch(
              dashboardsActions.setDashboardPublicAccess({
                dashboardId,
                isPublic,
                accessKey: key,
              })
            );
          if (isPublic && !is_active)
            setAccessKeyError(ACCESS_KEY_ERROR.REVOKE_ERROR);
        }
      })
      .catch(() => {
        setAccessKeyError(t(ACCESS_KEY_ERROR.API_ERROR));
      });
  }, []);

  useEffect(() => {
    if (isPublic && publicAccessKey) setAccessKeyError(null);
  }, [publicAccessKey]);

  const closeHandler = useCallback(() => {
    dispatch(dashboardsActions.hideDashboardShareModal());
  }, []);

  const handleToggleChange = useCallback(() => {
    dispatch(
      dashboardsActions.setDashboardPublicAccess({
        dashboardId,
        isPublic: !isPublic,
        accessKey: publicAccessKey,
      })
    );
  }, [dashboardId, isPublic, publicAccessKey]);

  return (
    <ModalWrapper>
      <ModalHeader onClose={closeHandler}>
        {t('dashboard_share.modal_title')}
      </ModalHeader>
      <ModalContent paddingTop="10px" paddingBottom="0">
        <TabsContainer>
          <Tabs
            activeTab={activeTab}
            onClick={(id) => setActiveTab(id)}
            tabs={tabs}
          />
        </TabsContainer>
      </ModalContent>
      <ModalContent>
        {accessKeyError && <Alert type="error">{accessKeyError}</Alert>}
        <ToggleWrapper>
          <Toggle isOn={isPublic} onChange={handleToggleChange} />
          <Label>
            <Text onClick={handleToggleChange}>
              {t('dashboard_share.make_public')}
            </Text>
            <TooltipWrapper
              marginLeft="5px"
              onMouseEnter={() => setLabelTooltip(true)}
              onMouseLeave={() => setLabelTooltip(false)}
            >
              <Icon
                type="info"
                width={15}
                height={15}
                fill={colors.black[100]}
              />
              <AnimatePresence>
                {labelTooltip && (
                  <TooltipContainer {...TOOLTIP_MOTION}>
                    <Tooltip mode="light" hasArrow={false}>
                      <TooltipContent>
                        {t('dashboard_share.make_public_tooltip')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipContainer>
                )}
              </AnimatePresence>
            </TooltipWrapper>
          </Label>
        </ToggleWrapper>
      </ModalContent>
      <Divider />
      {activeTab === PUBLIC_LINK_VIEW_ID && (
        <PublicLink dashboardId={dashboardId} isPublic={isPublic} />
      )}
      {activeTab === EMBED_HTML_VIEW_ID && (
        <EmbedCode
          dashboardId={dashboardId}
          isPublic={isPublic}
          publicAccessKey={publicAccessKey}
        />
      )}
    </ModalWrapper>
  );
};

export default DashboardShare;
