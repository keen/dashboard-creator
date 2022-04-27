import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Icon } from '@keen.io/icons';
import { Badge } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import DashboardViewSwitch from '../DashboardViewSwitch';

import {
  Meta,
  Title,
  Header,
  BackButton,
  BackText,
  Container,
} from './DashboardDetails.styles';

import { backMotion } from './motion';

type Props = {
  /** Dashboard title */
  title?: string;
  /** Dashboard tags */
  tags?: string[];
  /** Dashboard is public identifier */
  isPublic?: boolean;
  /** Dashboard switcher available */
  useDashboardSwitcher?: boolean;
  /** Back event handler */
  onBack?: () => void;
};

const DashboardDetails: FC<Props> = ({
  title,
  tags = [],
  isPublic = false,
  useDashboardSwitcher = true,
  onBack,
}) => {
  const { t } = useTranslation();

  return (
    <Container>
      <Header>
        {useDashboardSwitcher ? (
          <DashboardViewSwitch title={title} />
        ) : (
          <Title data-testid="public-title">{title}</Title>
        )}
        <Meta>
          {isPublic && (
            <Badge variant="green" truncate>
              {t('dashboard_details.public')}
            </Badge>
          )}
          {tags.map((tag) => (
            <Badge key={tag} variant="purple" truncate>
              {tag}
            </Badge>
          ))}
        </Meta>
      </Header>
      {onBack && (
        <BackButton
          onClick={onBack}
          whileHover="hover"
          initial="initial"
          animate="initial"
        >
          <motion.div variants={backMotion}>
            <Icon type="button-arrow-left" fill={colors.blue[300]} />
          </motion.div>
          <BackText>
            <BodyText variant="body2" color={colors.blue[200]}>
              {t('dashboard_details.back')}
            </BodyText>
          </BackText>
        </BackButton>
      )}
    </Container>
  );
};

export default DashboardDetails;
