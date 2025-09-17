import type { ReactNode } from 'react';

import { useABTest } from '../../hooks/useABTest';

interface Props {
  testName: string;
  proportionB: number;
  variantA: ReactNode;
  variantB: ReactNode;
}

const ABTestContainer = ({
  testName,
  proportionB,
  variantA,
  variantB,
}: Props) => {
  const group = useABTest({ testName, proportionB });

  return <>{group === 'A' ? variantA : variantB}</>;
};

export default ABTestContainer;
