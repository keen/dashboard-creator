import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div<{ isOpen?: boolean }>`
  height: 100%;
  display: flex;

  ${(props) =>
    props.isOpen &&
    css`
      box-shadow: ${transparentize(0.85, colors.black[500])} 0 0 3px 1px;
    `}
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  cursor: pointer;
`;

export const Title = styled.div`
  margin: 2px 0 0 10px;
  font-size: 14px;
  font-family: 'Lato Bold', sans-serif;
  color: ${colors.blue[500]};
`;

export const Bar = styled.div`
  padding: 10px 20px;
  border-top: solid 1px ${colors.white[300]};
  background-color: ${colors.white[500]};
  display: flex;
  align-items: center;

  a {
    margin-left: 10px;
    cursor: pointer;
  }
`;

export const SettingsContainer = styled.div`
  padding: 20px;
  border-top: solid 1px ${colors.white[300]};
  border-bottom: solid 1px ${colors.white[300]};
`;

export const Label = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colors.white[500]};
`;

export const Timeframe = styled.div`
  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.blue[500]};
`;

export const Separator = styled.div`
  font-family: 'Lato Regular', sans-serif;
  font-size: 13px;
  line-height: 17px;
  color: ${colors.blue[100]};
`;

export const ErrorContainer = styled.div`
  padding: 15px 10px;
`;
