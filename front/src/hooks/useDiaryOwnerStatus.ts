import { useEffect, useState } from 'react';

import { getCookie, setCookie } from '@/util/cookie-helper';

/**
 * 답장을 볼 수 있는 권한 확인 및 쿠키/로컬 스토리지 동기화
 * @param {string} currentDiaryAddress 현재 보고 있는 다이어리의 고유 주소(params)
 * @returns {boolean} 현재 보고 있는 다이어리의 사용자가 다이어리 생성자인지 여부
 */

const useDiaryOwnerStatus = (currentDiaryAddress: string): boolean => {
  const diaryAddress = getCookie('diaryAddress');
  const diaryUser = getCookie('diaryUser');

  const localDiaryAddress = localStorage.getItem('diaryAddress');
  const localDiaryUser = localStorage.getItem('diaryUser');

  const [isDiaryOwner, setIsDiaryOwner] = useState(false);

  useEffect(() => {
    if (diaryAddress || diaryUser) {
      localStorage.setItem('diaryAddress', diaryAddress ?? '');
      localStorage.setItem('diaryUser', diaryUser ?? '');
    } else if (localDiaryAddress || localDiaryUser) {
      setCookie('diaryAddress', localDiaryAddress ?? '');
      setCookie('diaryUser', localDiaryUser ?? '');
    }
  }, [diaryAddress, diaryUser, localDiaryAddress, localDiaryUser]);

  useEffect(() => {
    if (diaryAddress && diaryAddress === currentDiaryAddress) {
      setIsDiaryOwner(true);
    } else {
      setIsDiaryOwner(false);
    }
  }, [currentDiaryAddress, diaryAddress]);

  return isDiaryOwner;
};

export default useDiaryOwnerStatus;
