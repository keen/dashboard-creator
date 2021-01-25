import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Input = styled.input`
  flex: 1;
  padding: 11px 14px;
  border-radius: 4px 0 0 4px;
  border: 1px solid ${transparentize(0.5, colors.blue[500])};
  background-color: ${colors.gray[100]};
  color: ${colors.black[100]};

  font-family: 'Lato Regular', sans-serif;
  font-size: 12px;
  line-height: 15px;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  &:focus {
    outline: none;
  }
`;

export const Button = styled.button`
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 0 20px 20px 0;
  border: none;
  background-color: ${colors.blue[500]};
  color: ${colors.white[500]};
  box-shadow: 0 2px 4px 0 rgba(29, 39, 41, 0.15);

  font-family: 'Lato-Bold', sans-serif;
  font-size: 14px;
  line-height: 27px;

  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

export const Group = styled.div`
  display: flex;
`;
