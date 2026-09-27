import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function TopProgressBar() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(30);

    const timer1 = setTimeout(() => setProgress(70), 100);
    const timer2 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    }, 250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [location.pathname, location.search]);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_8px_rgba(0,0,0,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
