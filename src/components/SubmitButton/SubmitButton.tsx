import React, { FC, ReactNode } from 'react';
import { SuccessButton } from './SubmitButton.styles';

type Props = {
  children: ReactNode;
  onClick: () => void;
};

const SubmitButton: FC<Props> = ({ children, onClick }) => {
  return <SuccessButton onClick={() => onClick()}>{children}</SuccessButton>;
};

export default SubmitButton;
