import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

const excerptWidth = '10ch';

export const Container = styled.div`
  padding: 10px 20px;
  height: 90px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 5px;
  height: 20px;

  position: relative;
  box-sizing: border-box;
`;

export const Title = styled.div`
  font-family: 'Gangster Grotesk Regular', sans-serif;
  font-size: 16px;
  line-height: 19px;
  color: ${colors.black[400]};

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const TitlePlaceholder = styled(Title)`
  color: ${transparentize(0.5, colors.black[400])};
`;

export const Excerpt = styled.div`
  font-family: 'Lato Regular', sans-serif;
  font-size: 12px;
  line-height: 15px;
  color: ${transparentize(0.3, colors.black[100])};
  width: ${excerptWidth};
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const ActionsContainer = styled.div`
  min-width: 0;
  margin-left: auto;
  flex-shrink: 0;
  display: flex;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

export const TagsContainer = styled.div`
  width: calc(100% - ${excerptWidth});

  display: flex;
  align-items: center;
  height: 20px;

  position: relative;
  box-sizing: border-box;
`;
