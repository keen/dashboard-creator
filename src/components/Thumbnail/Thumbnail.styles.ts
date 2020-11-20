import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 380px;
  height: 170px;
  position: relative;
  background: #ccc;
`;

export const Gradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(
    180deg,
    rgba(241, 245, 248, 0.7) 0%,
    rgba(255, 255, 255, 0) 100%
  );
`;
