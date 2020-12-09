import React, { FC } from 'react';
import { Button } from '@keen.io/ui-core';
import { Container } from './SubmitButton.styles';

type Props = {
  text: string;
  styles: object;
  onClick: () => void;
};

const SubmitButton: FC<Props> = ({ text, styles, onClick }) => {
  return (
    <Container styles={styles}>
      <Button variant="success" htmlType="button" onClick={() => onClick()}>
        {text}
      </Button>
    </Container>
  );
};

export default SubmitButton;
