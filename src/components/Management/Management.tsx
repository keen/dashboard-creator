import React, { FC, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';

import {
  Navigation,
  Filters,
  EmptySearch,
  Search,
  Content,
} from './Management.styles';

import CreateFirstDashboard from '../CreateFirstDashboard';
import DashboardsList from '../DashboardsList';
import DashboardsPlaceholder from '../DashboardsPlaceholder';
import ManagementNavigation from '../ManagementNavigation';
import SearchInput from '../SearchInput';
import DashboardDeleteConfirmation from '../DashboardDeleteConfirmation';
import DashboardListOrder from '../DashboardListOrder';

import {
  createDashboard,
  viewDashboard,
  getDashboardsMetadata,
  getDashboardsLoadState,
  showDashboardSettingsModal,
  getDashbaordListOrder,
} from '../../modules/dashboards';

type Props = {};

const Management: FC<Props> = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const dashboards = useSelector(getDashboardsMetadata);
  const dashboardsLoaded = useSelector(getDashboardsLoadState);
  const dashboardListOrder = useSelector(getDashbaordListOrder);

  const [searchPhrase, setSearchPhrase] = useState('');

  const createDashbord = useCallback(() => {
    const dashboardId = uuid();
    dispatch(createDashboard(dashboardId));
  }, []);

  const filteredDashboards = useMemo(() => {
    let dashboardsList = dashboards;

    if (searchPhrase) {
      const phrase = searchPhrase.toLowerCase();
      dashboardsList = dashboardsList.filter(
        ({ title }) => title && title.toLowerCase().includes(phrase)
      );
    }

    return dashboardsList;
  }, [searchPhrase, dashboards, dashboardListOrder]);

  const isEmptyProject = dashboardsLoaded && dashboards.length === 0;
  const isEmptySearch = dashboardsLoaded && filteredDashboards.length === 0;
  const showPlaceholders = isEmptyProject || isEmptySearch || !dashboardsLoaded;

  return (
    <div>
      <Navigation>
        <ManagementNavigation
          attractNewDashboardButton={isEmptyProject}
          onCreateDashboard={createDashbord}
        />
        <Filters>
          <Search>
            <SearchInput
              searchPhrase={searchPhrase}
              placeholder={t('dashboard_management.search_input_placeholder')}
              onChangePhrase={(phrase) => setSearchPhrase(phrase)}
              onClearSearch={() => setSearchPhrase('')}
            />
          </Search>
          <DashboardListOrder />
        </Filters>
      </Navigation>
      <Content>
        {showPlaceholders ? (
          <DashboardsPlaceholder />
        ) : (
          <DashboardsList
            onPreviewDashboard={(id) => dispatch(viewDashboard(id))}
            onShowDashboardSettings={(id) => {
              dispatch(showDashboardSettingsModal(id));
            }}
            dashboards={filteredDashboards}
          />
        )}
        {isEmptySearch && (
          <EmptySearch>
            {t('dashboard_management.empty_search_results')}
          </EmptySearch>
        )}
        <DashboardDeleteConfirmation />
        <CreateFirstDashboard
          onClick={createDashbord}
          isVisible={isEmptyProject}
        />
      </Content>
    </div>
  );
};

export default Management;
