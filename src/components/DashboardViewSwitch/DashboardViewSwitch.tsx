import React, {
  FC,
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { useInView } from 'react-intersection-observer';
import { Icon } from '@keen.io/icons';
import { Dropdown, Button, EmptySearch } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import SearchInput from '../SearchInput';
import PermissionGate from '../PermissionGate';

import {
  getDashboardsMetadata,
  sortDashboards,
  viewDashboard,
  createDashboard as createDashboardAction,
} from '../../modules/dashboards';

import { ListItem } from './components';

import {
  Container,
  Title,
  DropdownContainer,
  DropIndicator,
  TitleWrapper,
  OverflowContainer,
  List,
  DropdownFooter,
  AllDashboards,
  Search,
} from './DashboardViewSwitch.styles';

import { ROUTES } from '../../constants';
import { appActions, appSelectors, Scopes } from '../../modules/app';

type Props = {
  /** Dashboard title */
  title?: string;
};

const DashboardViewSwitch: FC<Props> = ({ title }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const dashboardId = useSelector(appSelectors.getActiveDashboard);
  const dashboards = useSelector(getDashboardsMetadata);

  const [isOpen, setOpen] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [selected, setSelected] = useState(dashboardId);
  const [offsetTop, setOffsetTop] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  const [inViewRefTop, inViewTop] = useInView();
  const [inViewRefBottom, inViewBottom] = useInView();

  const filteredDashboards = useMemo(() => {
    let dashboardsList = sortDashboards([...dashboards], 'az');

    if (searchPhrase) {
      const phrase = searchPhrase.toLowerCase();
      dashboardsList = dashboardsList.filter(
        ({ title }) => title && title.toLowerCase().includes(phrase)
      );
    }

    return dashboardsList;
  }, [searchPhrase, dashboards]);

  const createDashboard = useCallback(() => {
    const dashboardId = uuid();
    dispatch(createDashboardAction(dashboardId));
  }, []);

  const containerRef = useRef(null);
  const listRef = useRef(null);

  const outsideClick = useCallback(
    (e) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    },
    [isOpen, containerRef]
  );

  useEffect(() => {
    document.addEventListener('click', outsideClick);
    return () => document.removeEventListener('click', outsideClick);
  }, [isOpen, containerRef]);

  useEffect(() => {
    setSelected(dashboardId);
    setSearchPhrase('');
  }, [isOpen]);

  useEffect(() => {
    if (listRef.current) {
      setOffsetTop(listRef.current.offsetTop);
      setDropdownWidth(listRef.current.clientWidth);
    }
  }, [isOpen, listRef]);

  return (
    <div ref={containerRef}>
      <Container>
        <TitleWrapper isActive={isOpen} onClick={() => setOpen(!isOpen)}>
          <Title isActive={!!title}>
            {title ? title : t('dashboard_details.untitled_dashboard')}
          </Title>
          <DropIndicator>
            <Icon
              type="caret-down"
              fill={colors.blue[500]}
              width={15}
              height={15}
            />
          </DropIndicator>
        </TitleWrapper>
        <DropdownContainer>
          <Dropdown isOpen={isOpen}>
            <Search>
              <SearchInput
                searchPhrase={searchPhrase}
                placeholder={t('dashboard_management.search_input_placeholder')}
                onChangePhrase={(phrase) => setSearchPhrase(phrase)}
                onClearSearch={() => setSearchPhrase('')}
              />
            </Search>
            <OverflowContainer
              overflowTop={!inViewTop}
              overflowBottom={!inViewBottom}
            >
              <div ref={inViewRefTop}></div>
              <List ref={listRef}>
                {filteredDashboards.length ? (
                  filteredDashboards.map(({ title, id }) => (
                    <ListItem
                      key={id}
                      isActive={id === selected}
                      offsetTop={offsetTop}
                      dropdownWidth={dropdownWidth}
                      onClick={() => {
                        dispatch(viewDashboard(id));
                        setOpen(false);
                      }}
                      onMouseEnter={() => {
                        setSelected(id);
                      }}
                      isUntitled={!!title}
                    >
                      {title
                        ? title
                        : t('dashboard_details.untitled_dashboard')}
                    </ListItem>
                  ))
                ) : (
                  <EmptySearch message={t('dashboard_details.empty_search')} />
                )}
              </List>
              <div ref={inViewRefBottom}></div>
            </OverflowContainer>
            <DropdownFooter>
              <PermissionGate scopes={[Scopes.EDIT_DASHBOARD]}>
                <Button variant="secondary" onClick={createDashboard}>
                  {t('dashboard_details.new_dashboard')}
                </Button>
              </PermissionGate>
              <AllDashboards
                onClick={() => {
                  dispatch(appActions.setActiveDashboard(null));
                  dispatch(push(ROUTES.MANAGEMENT));
                }}
              >
                <BodyText
                  variant="body2"
                  fontWeight="bold"
                  color={colors.blue[500]}
                >
                  {t('dashboard_details.all_dashboards')}
                </BodyText>
              </AllDashboards>
            </DropdownFooter>
          </Dropdown>
        </DropdownContainer>
      </Container>
    </div>
  );
};

export default DashboardViewSwitch;
