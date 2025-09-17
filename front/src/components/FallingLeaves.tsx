import { useEffect, useState } from 'react';

import Style from './FallingLeaves.module.scss';

interface ILeaf {
  id: number;
  emoji: string;
  left: number;
  animationDuration: number;
  animationDelay: number;
}

const FallingLeaves = () => {
  const [leaves, setLeaves] = useState<ILeaf[]>([]);

  useEffect(() => {
    const leafEmojis = ['🍂', '🍁'];
    const numberOfLeaves = 15;

    const newLeaves: ILeaf[] = Array.from(
      { length: numberOfLeaves },
      (_, i) => ({
        id: i,
        emoji: leafEmojis[Math.floor(Math.random() * leafEmojis.length)],
        left: Math.random() * 100,
        animationDuration: Math.random() * 3 + 4,
        animationDelay: Math.random() * 2,
      }),
    );

    setLeaves(newLeaves);
  }, []);

  return (
    <div className={Style.FallingLeaves}>
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className={Style.Leaf}
          style={{
            left: `${leaf.left}%`,
            animationDuration: `${leaf.animationDuration}s`,
            animationDelay: `${leaf.animationDelay}s`,
          }}
        >
          {leaf.emoji}
        </div>
      ))}
    </div>
  );
};

export default FallingLeaves;
