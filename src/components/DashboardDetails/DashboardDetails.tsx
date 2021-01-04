import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Icon } from '@keen.io/icons';
import { Badge } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

import {
  Title,
  Tag,
  Header,
  BackButton,
  BackText,
} from './DashboardDetails.styles';

import { backMotion } from './motion';

type Props = {
  /** Dashboard title */
  title?: string;
  /** Dashboard tags */
  tags: string[];
  /** Back event handler */
  onBack: () => void;
};

const DashboardDetails: FC<Props> = ({ title, tags, onBack }) => {
  const { t } = useTranslation();

  return (
    <div>
      <Header>
        <Title isActive={!!title}>
          {title ? title : t('dashboard_details.untitled_dashboard')}
        </Title>
        {tags.map((tag) => (
          <Tag key={tag}>
            <Badge variant="purple">{tag}</Badge>
          </Tag>
        ))}
      </Header>
      <BackButton
        onClick={onBack}
        whileHover="hover"
        initial="initial"
        animate="initial"
      >
        <motion.div variants={backMotion}>
          <Icon type="button-arrow-left" fill={colors.blue[300]} />
        </motion.div>
        <BackText>{t('dashboard_details.back')}</BackText>
      </BackButton>
    </div>
  );
};

export default DashboardDetails;
