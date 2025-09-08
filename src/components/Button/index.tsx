import type { ReactElement, ReactNode } from 'react';

import { getClassListString } from '@/util/style-helper';

import Style from './style.module.scss';

interface ButtonProps {
  className?: string;
  children: ReactNode;
  onClick: () => void;
  color?: 'default' | 'white' | 'grey';
}

const Button = ({
  className = '',
  children,
  onClick,
  color = 'default',
}: ButtonProps): ReactElement => {
  const buttonClassName = getClassListString(
    className,
    Style.clickEffect,
    Style.Button,
    Style[color],
  );

  return (
    <button type="button" className={buttonClassName} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
