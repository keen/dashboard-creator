import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  position: relative;
`;

export const DropdownContent = styled.div`
  padding: 10px 0 0 0;
  width: 200px;
  box-sizing: border-box;
`;

export const TagsContainer = styled.div<{
  overflowTop: boolean;
  overflowBottom: boolean;
}>`
  max-height: 280px;
  overflow-y: auto;

  ${({ overflowTop, overflowBottom }) => {
    let boxShadow = ``;
    if (overflowTop)
      boxShadow += `inset 0px 6px 4px -4px ${transparentize(
        0.85,
        colors.black[500]
      )}`;
    if (overflowTop && overflowBottom) boxShadow += ',';
    if (overflowBottom)
      boxShadow += `inset 0 -6px 4px -4px ${transparentize(
        0.85,
        colors.black[500]
      )}`;
    return css`
      box-shadow: ${boxShadow};
    `;
  }};
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

export const Filter = styled.div`
  border-radius: 4px;
  background: ${transparentize(0.85, colors.blue['100'])}};
  padding: 11px 14px;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  width: 70px;
`;
