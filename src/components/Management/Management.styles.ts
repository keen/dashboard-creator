import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Content = styled.div`
  position: relative;
`;

export const Filters = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const SearchInputContainer = styled.div`
  width: 300px;
  margin-right: 20px;
`;

export const Search = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const EmptySearch = styled.div`
  position: absolute;
  top: 60px;
  width: 100%;
  text-align: center;

  font-family: 'Lato Regular', sans-serif;
  font-size: 16px;
  color: ${colors.blue[500]};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 30px;
`;
