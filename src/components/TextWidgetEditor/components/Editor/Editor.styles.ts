import styled from 'styled-components';
import { colors } from '@keen.io/colors';
import { DEFAULT_BACKGROUND_COLOR } from '../../../../constants';

export const Header = styled.div`
  padding: 10px 20px;
  background: ${colors.white[300]};
  display: flex;
  align-items: flex-start;
`;

export const Description = styled.div`
  margin-bottom: 10px;
`;

export const Footer = styled.div`
  display: flex;
  padding: 8px 20px;
  background: ${colors.white[500]};
  border-top: solid 1px ${colors.gray[400]};
`;

export const CancelButton = styled.div`
  margin-left: 10px;
`;

export const EditorContainer = styled.div`
  padding: 10px 20px;
  background: ${DEFAULT_BACKGROUND_COLOR};

  min-height: 200px;
`;

export const IconContainer = styled.div`
  padding-left: 14px;
  margin-left: auto;
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
`;
