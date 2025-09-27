import type { ReactElement } from 'react';
import { createPortal } from 'react-dom';

import Style from './style.module.scss';  

interface Props {
  children: ReactElement;
  onClose?: () => void;
}

const ModalPortal = (props: Props) => {
  const { children, onClose } = props;

  const modal = document.getElementById('modal')!;
  return createPortal(
    <div className={Style.Backdrop} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modal,
  );
};

export default ModalPortal;
