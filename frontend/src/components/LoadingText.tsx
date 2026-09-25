import { useEffect, useState } from 'react';

type LoadinTextProps = {
  text?: string;
};

export default function LoadingText({ text = 'Loading' }: LoadinTextProps) {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <span>
      {text}
      <span className={'inline-block text-left'} style={{ width: '1.5em' }}>
        {'.'.repeat(dots)}
      </span>
    </span>
  );
}
