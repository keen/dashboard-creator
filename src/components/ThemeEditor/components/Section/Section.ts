import styled from 'styled-components';

const Section = styled.section`
  display: flex;
  column-gap: 30px;
`;

const SectionRow = styled.div`
  display: flex;
  align-items: center;
  column-gap: 15px;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export { SectionRow };
export default Section;
