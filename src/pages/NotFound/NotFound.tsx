import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button';

import Style from './style.module.scss';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={Style.Layout}>
      <div className={Style.Emoji}>🙅🏻</div>
      <div className={Style.Notice}>
        <div className={Style.Title}>잘못된 접근</div>
        <div className={Style.Desc}>메인으로 돌아가주세요!</div>
      </div>
      <Button color="default" onClick={() => void navigate('/')}>
        메인으로 가기
      </Button>
    </div>
  );
};
export default NotFound;
