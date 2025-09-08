import React, { type ForwardedRef, forwardRef } from 'react';

import Styles from './style.module.scss';

interface Props {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  maxLength?: number;
  className?: string;
}

const Input = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLInputElement>) => {
    const { value, onChange, onKeyUp, placeholder, maxLength, className } =
      props;

    return (
      <input
        className={`${Styles.Input} ${className ?? ''}`}
        value={value}
        onChange={onChange}
        onKeyUp={onKeyUp}
        placeholder={placeholder}
        ref={ref}
        maxLength={maxLength}
      />
    );
  },
);

export default Input;
