import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  position: relative;
`;

export const Title = styled.div<{
  isActive: boolean;
}>`
  font-family: 'Lato Bold', sans-serif;
  font-size: 20px;
  color: ${(props) =>
    props.isActive ? colors.blue[500] : transparentize(0.5, colors.black[300])};
`;

export const TitleWrapper = styled.div<{
  isActive: boolean;
}>`
  display: flex;
  flex-direction: row;
  padding: 5px 10px;

  &:hover {
    background: ${colors.white[500]};
    border-radius: 4px;
  }

  ${(props) =>
    props.isActive &&
    css`
      background: ${colors.white[500]};
      border-radius: 4px;
    `}
`;

export const DropIndicator = styled.div`
  display: flex;
  align-items: center;
  padding: 3px 0 0 8px;
  cursor: pointer;
`;

export const DropdownContainer = styled.div`
  background: ${colors.white[500]};
  position: absolute;
  bottom: 0;
  left: 0;
  width: 300px;
`;

export const Search = styled.div`
  padding: 10px 20px;
`;

export const OverflowContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border-top: 1px solid ${colors.gray[300]};
  border-bottom: 1px solid ${colors.gray[300]};
`;

export const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  font-size: 16px;
  font-family: Lato Medium, sans-serif;
`;

export const DropdownFooter = styled.div`
  display: fix;
  flex-direction: row;
  padding: 10px;
  align-items: center;
  box-shadow: 0 -10px 24px ${transparentize(0.95, colors.black[500])};
`;

export const NewDashboard = styled.div`
  width: 60%;
`;

export const AllDashboards = styled.div`
  font-family: Lato Bold, sans-serif;
  color: ${colors.blue[500]};
  cursor: pointer;
  font-size: 14px;
`;
