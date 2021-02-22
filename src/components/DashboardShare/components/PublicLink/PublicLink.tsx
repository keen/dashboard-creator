import React, { FC, useContext, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { Tooltip } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import { ModalContent } from '../ModalContent';
import { InputGroup } from '../InputGroup';

import {
  TitleWrapper,
  Title,
  TooltipWrapper,
  TooltipContainer,
  TooltipContent,
  Link,
  Message,
  Container,
} from './PublicLink.styles';

import { TOOLTIP_MOTION } from '../../../../constants';

import {
  getDashboardMeta,
  regenerateAccessKey,
} from '../../../../modules/dashboards';
import { AppContext } from '../../../../contexts';
import { RootState } from '../../../../rootReducer';

type Props = {
  dashboardId: string;
  isPublic?: boolean;
};

const PublicLink: FC<Props> = ({ dashboardId, isPublic = true }) => {
  const { t } = useTranslation();
  const [tooltip, setTooltip] = useState(false);
  const { createSharedDashboardUrl } = useContext(AppContext);
  const { publicAccessKey } = useSelector((state: RootState) =>
    getDashboardMeta(state, dashboardId)
  );
  const dispatch = useDispatch();

  const publicDashboardShareUrl = useMemo(
    () => createSharedDashboardUrl(publicAccessKey, dashboardId),
    [dashboardId, publicAccessKey]
  );

  return (
    <Container isActive={isPublic && !!publicAccessKey}>
      <ModalContent paddingTop="40px">
        <TitleWrapper>
          <Title>{t('dashboard_share.public_dashboard_link')}</Title>
          <TooltipWrapper
            marginLeft="auto"
            marginRight="5px"
            onMouseEnter={() => setTooltip(true)}
            onMouseLeave={() => setTooltip(false)}
          >
            <Icon type="info" width={15} height={15} fill={colors.black[100]} />
            <AnimatePresence>
              {tooltip && (
                <TooltipContainer {...TOOLTIP_MOTION}>
                  <Tooltip mode="light" hasArrow={false}>
                    <TooltipContent>
                      {t('dashboard_share.regenerate_link_tooltip')}
                    </TooltipContent>
                  </Tooltip>
                </TooltipContainer>
              )}
            </AnimatePresence>
          </TooltipWrapper>
          <Link onClick={() => dispatch(regenerateAccessKey(dashboardId))}>
            {t('dashboard_share.regenerate_link')}
          </Link>
        </TitleWrapper>
        <Message>{t('dashboard_share.message')}</Message>
        <InputGroup value={publicDashboardShareUrl} />
      </ModalContent>
    </Container>
  );
};

export default PublicLink;
