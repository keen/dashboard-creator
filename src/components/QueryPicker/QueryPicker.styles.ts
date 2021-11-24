import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

export const CreateNewQuery = styled.div`
  display: flex;
  padding: 20px;
  border-bottom: solid 1px ${colors.white[300]};
`;

export const NewQueryButton = styled.div`
  flex-shrink: 0;
`;

export const AlertContainer = styled.div`
  padding: 20px;
`;

export const QueriesContainer = styled.div<{
  overflowTop: boolean;
  overflowBottom: boolean;
}>`
  padding: 0 0 20px 0;
  max-height: 370px;
  overflow-y: scroll;

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

export const Message = styled.div`
  padding: 0 20px 20px 20px;
  font-size: 14px;
  font-family: 'Lato Regular', sans-serif;
  color: ${colors.blue[500]};
`;

export const Description = styled.div`
  margin-left: 20px;

  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: ${transparentize(0.3, colors.black[100])};
`;

export const FiltersContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px 20px 15px 20px;
`;

export const SearchContainer = styled.div`
  width: 100%;
  margin-right: 10px;
`;
