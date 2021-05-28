import styled from 'styled-components';
import { flexbox, FlexboxProps } from 'styled-system';

const Section = styled.section`
  display: flex;
  column-gap: 30px;
`;

const SectionRow = styled.div<FlexboxProps>`
  display: flex;
  align-items: center;
  column-gap: 15px;
  margin-bottom: 10px;

  ${flexbox};

  &:last-child {
    margin-bottom: 0;
  }
`;

const TextWrapper = styled.div`
  flex-basis: 120px;
  flex-shrink: 0;
`;

export { SectionRow, TextWrapper };
export default Section;
