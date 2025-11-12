import React, { useState, useEffect } from 'react';

interface CountdownProps {
  date: string;
}

const Countdown: React.FC<CountdownProps> = ({ date }) => {
  const calculateTimeLeft = () => {
    const [day, month, year] = date.split('/');
    // Sorteio (e encerramento das inscrições) é sempre às 13h do dia do jogo.
    const targetDate = new Date(`${year}-${month}-${day}T13:00:00`);

    const difference = +targetDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  // Fix: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  const timerComponents: React.ReactElement[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval as keyof typeof timeLeft] && interval !== 'seconds' && interval !== 'minutes' && interval !== 'hours') {
      return;
    }
    
    if (timeLeft['days' as keyof typeof timeLeft] > 0 && (interval === 'minutes' || interval === 'seconds')){
        return;
    }

    timerComponents.push(
      <div key={interval} className="flex flex-col items-center">
        <span className="font-bold text-lg text-brand-blue dark:text-brand-blue-light">
          {String(timeLeft[interval as keyof typeof timeLeft]).padStart(2, '0')}
        </span>
        <span className="text-xs uppercase text-gray-500 dark:text-gray-400">
          {interval === 'days' ? 'd' : interval[0]}
        </span>
      </div>
    );
  });

  return (
    <div className="flex justify-center space-x-2 p-2 bg-brand-gray dark:bg-gray-700 rounded-lg">
      {timerComponents.length ? timerComponents : <span className="text-red-500 font-bold">Encerrado</span>}
    </div>
  );
};

export default Countdown;