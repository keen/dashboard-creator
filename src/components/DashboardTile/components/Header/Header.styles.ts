import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  padding: 15px 20px;
  height: 80px;
  display: flex;
  box-sizing: border-box;
`;

export const Heading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
`;

export const Details = styled.div`
  display: flex;
  align-items: center;
`;

export const TagsWrapper = styled.div`
  margin-left: 6px;
  display: flex;
  align-items: center;
`;

export const BadgeContainer = styled.div`
  & + & {
    margin-left: 10px;
  }
`;

export const Title = styled.div`
  font-family: 'Gangster Grotesk Regular', sans-serif;
  font-size: 16px;
  line-height: 19px;
  color: #303e43;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const Excerpt = styled.div`
  font-family: 'Lato Regular', sans-serif;
  font-size: 12px;
  line-height: 15px;
  color: ${transparentize(0.3, colors.black[100])};
  min-width: 70px;
`;

export const ActionsContainer = styled.div`
  min-width: 0;
  margin-left: auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;
