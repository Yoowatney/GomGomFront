import { useEffect, useState } from 'react';

import { getCookie, setCookie } from '../util/cookie-helper';
import { EventTrigger } from '../util/ga-helper';

interface IABTestConfig {
  testName: string;
  proportionB: number; 
}

export const useABTest = ({ testName, proportionB }: IABTestConfig) => {
  const [group, setGroup] = useState<'A' | 'B'>('A');

  useEffect(() => {
    const cookieName = `_ab_group_${testName}`;
    const existingGroup = getCookie(cookieName) as 'A' | 'B' | undefined;

    if (existingGroup) {
      setGroup(existingGroup);
    } else {
      const randomValue = Math.random() * 100;
      const assignedGroup = randomValue < proportionB ? 'B' : 'A';

      setGroup(assignedGroup);
      setCookie(cookieName, assignedGroup);

      // GA 이벤트 전송
      EventTrigger({
        action: 'ab_test_assignment',
        category: 'experiment',
        label: `${testName}_${assignedGroup}`,
        value: 1,
      });
    }
  }, [testName, proportionB]);

  return group;
};
