import type { ReactElement, ReactNode } from 'react';

import Button from '@/components/Button';

import ModalPortal from '../ModalPortal';
import Style from './style.module.scss';

interface Props {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  children?: ReactNode;
  confirmTitle?: string;
  cancelTitle?: string;
  verticalButtons?: boolean;
}

const CustomModal = (props: Props): ReactElement => {
  const {
    title,
    description,
    onConfirm,
    onCancel,
    children,
    confirmTitle,
    cancelTitle,
    verticalButtons,
  } = props;

  const handleConfirmClick = () => {
    onConfirm();
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <ModalPortal onClose={onCancel || onConfirm}>
      <div className={Style.Layout}>
        <div className={Style.Title}>{title}</div>
        {description && <div className={Style.Desc}>{description}</div>}
        {children}
        <div className={`${Style.Buttons} ${verticalButtons ? Style.VerticalButtons : ''}`}>
          <Button className={Style.ConfirmButton} onClick={handleConfirmClick}>
            {confirmTitle ?? '확인'}
          </Button>
          {onCancel && (
            <Button
              className={Style.CancelButton}
              color="white"
              onClick={handleCancelClick}
            >
              {cancelTitle ?? '취소'}
            </Button>
          )}
        </div>
      </div>
    </ModalPortal>
  );
};

export default CustomModal;
