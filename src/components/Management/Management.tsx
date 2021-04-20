import React, { FC, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';

import {
  Filters,
  EmptySearch,
  Search,
  Content,
  SearchInputContainer,
  Container,
} from './Management.styles';

import CreateFirstDashboard from '../CreateFirstDashboard';
import DashboardsList from '../DashboardsList';
import DashboardsPlaceholder from '../DashboardsPlaceholder';
import ManagementNavigation from '../ManagementNavigation';
import SearchInput from '../SearchInput';
import DashboardDeleteConfirmation from '../DashboardDeleteConfirmation';
import FilterDashboards from '../FilterDashboards';
import DashboardListOrder from '../DashboardListOrder';

import {
  createDashboard,
  viewDashboard,
  getDashboardsMetadata,
  getDashboardsLoadState,
  showDashboardSettingsModal,
  getDashboardListOrder,
  getTagsFilter,
} from '../../modules/dashboards';
import { getUser } from '../../modules/app';

type Props = {};

const Management: FC<Props> = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const dashboards = useSelector(getDashboardsMetadata);
  const dashboardsLoaded = useSelector(getDashboardsLoadState);
  const dashboardListOrder = useSelector(getDashboardListOrder);
  const { editPrivileges } = useSelector(getUser);
  const dashboardsFilters = useSelector(getTagsFilter);

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

    if (dashboardsFilters.showOnlyPublicDashboards) {
      dashboardsList = dashboardsList.filter(({ isPublic }) => isPublic);
    }

    if (dashboardsFilters.tags.length) {
      dashboardsList = dashboardsList.filter(({ tags }) =>
        tags.some((tag) => dashboardsFilters.tags.includes(tag))
      );
    }

    return dashboardsList;
  }, [searchPhrase, dashboards, dashboardListOrder, dashboardsFilters]);

  const isEmptyProject = dashboardsLoaded && dashboards.length === 0;
  const isEmptySearch = dashboardsLoaded && filteredDashboards.length === 0;
  const showPlaceholders = isEmptyProject || isEmptySearch || !dashboardsLoaded;

  return (
    <Container>
      <div>
        <ManagementNavigation
          attractCreateDashboardButton={isEmptyProject}
          showCreateDashboardButton={editPrivileges && dashboardsLoaded}
          onCreateDashboard={createDashbord}
        />
        <Filters>
          <Search>
            <SearchInputContainer>
              <SearchInput
                searchPhrase={searchPhrase}
                placeholder={t('dashboard_management.search_input_placeholder')}
                onChangePhrase={(phrase) => setSearchPhrase(phrase)}
                onClearSearch={() => setSearchPhrase('')}
              />
            </SearchInputContainer>
            {dashboardsLoaded && <FilterDashboards />}
          </Search>
          <DashboardListOrder />
        </Filters>
      </div>
      <Content>
        {showPlaceholders ? (
          <DashboardsPlaceholder />
        ) : (
          <DashboardsList
            editPrivileges={editPrivileges}
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
        {editPrivileges && (
          <>
            <DashboardDeleteConfirmation />
            <CreateFirstDashboard
              onClick={createDashbord}
              isVisible={isEmptyProject}
            />
          </>
        )}
      </Content>
    </Container>
  );
};

export default Management;
