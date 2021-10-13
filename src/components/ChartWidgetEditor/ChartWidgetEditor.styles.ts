import styled from 'styled-components';
import { DEFAULT_BACKGROUND_COLOR } from '../../constants';

export const Container = styled.div`
  width: 80vw;
  max-width: 1200px;
`;

export const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
  background-color: ${DEFAULT_BACKGROUND_COLOR};
`;
