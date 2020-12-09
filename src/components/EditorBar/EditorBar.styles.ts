import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  height: 47px;
  width: 100%;
  background-color: ${colors.white[500]};
  box-shadow: 0 10px 24px 0 rgba(29, 39, 41, 0.15);
  div.right {
    display: inline-block;
    float: right;
  }
  div.timeAgo {
    display: inline-block;
    margin-right: 20px;
    margin-top: 16px;
    margin-bottom: 16px;
    color: #4f5b5f;
    font-family: 'Lato Medium';
    font-size: 12px;
    opacity: 0.5;
    line-height: 15px;
  }
`;

export const ConfirmButton = styled.div`
  display: inline-block;
`;

export const ChildrenWrapper = styled.div`
  display: inline-block;
  margin: 5px 0 5px 10px;
`;
