import styled from 'styled-components';

export const Container = styled.div<{ styles: any }>`
  button {
    border-radius: ${(props) => props.styles.radius || '0px'}!important;
    height: ${(props) => props.styles.height || '45px'}!important;
    font-size: ${(props) => props.styles.fontSize || '14px'}!important;
    line-height: ${(props) => props.styles.lineHeight || '17px'}!important;
  }
`;
