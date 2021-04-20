import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div<{ isOpen: boolean }>`
  position: relative;
  cursor: pointer;

  ${({ isOpen }) =>
    isOpen &&
    css`
      box-shadow: 0 2px 4px 0 ${transparentize(0.85, colors.black[500])};
    `};
`;

export const Filter = styled.div`
  border-radius: 4px;
  background: ${colors.white[500]};
  padding: 10px 14px;
`;

export const DropdownContent = styled.div`
  padding: 10px 0;
  width: 200px;
  box-sizing: border-box;
`;

export const TagsContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

export const ClearFilters = styled.div`
  padding: 10px 14px;
  border-top: solid 1px ${colors.gray[300]};
  cursor: pointer;
`;

export const EmptySearch = styled.div`
  padding: 10px 14px;
  text-align: center;
`;
