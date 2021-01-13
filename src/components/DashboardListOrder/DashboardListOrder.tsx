import React, { useState, useRef, useCallback, useEffect } from 'react';
import { transparentize } from 'polished';
import { useDispatch, useSelector } from 'react-redux';

import { Dropdown, UI_LAYERS } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';
import { Icon } from '@keen.io/icons';

import {
  Container,
  Order,
  DropIndicator,
  List,
  ListItem,
} from './DashboardListOrder.styles';

import {
  setDashboardListOrder,
  getDashbaordListOrder,
} from '../../modules/dashboards';

import { SORT_DASHBOARDS } from './constants';

const DashboardListOrder = () => {
  const dispatch = useDispatch();
  const dashboardListOrder = useSelector(getDashbaordListOrder);

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState(dashboardListOrder);

  const containerRef = useRef(null);
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
    setSelected(dashboardListOrder);
  }, [isOpen]);

  return (
    <Container ref={containerRef}>
      <Order data-testid="dropable-container" onClick={() => setOpen(true)}>
        {SORT_DASHBOARDS[dashboardListOrder]}
        <DropIndicator>
          <Icon
            type="caret-down"
            fill={transparentize(0.3, colors.blue[500])}
            width={10}
            height={10}
          />
        </DropIndicator>
      </Order>
      <div style={{ zIndex: UI_LAYERS.dropdown }}>
        <Dropdown isOpen={isOpen}>
          <List>
            {Object.keys(SORT_DASHBOARDS).map((order) => (
              <ListItem
                isActive={order === selected}
                key={order}
                onClick={() => {
                  setOpen(false);
                  dispatch(setDashboardListOrder(order));
                }}
                onMouseEnter={() => {
                  setSelected(order);
                }}
              >
                {SORT_DASHBOARDS[order]}
              </ListItem>
            ))}
          </List>
        </Dropdown>
      </div>
    </Container>
  );
};

export default DashboardListOrder;
