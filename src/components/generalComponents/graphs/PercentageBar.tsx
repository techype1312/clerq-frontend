import React, { useState } from 'react';

function PercentageBar({ max = 100, percentage = 0 }) {
  const [progress, setProgress] = useState(0);

  const progressStyle = {
    width: `${percentage}%`, // Calculate width based on remaining progress
};

  const progressBarContainerStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: 'transparent',
  };

  return (
    <span className='relative' style={progressBarContainerStyle}>
      <span className='bg-custom-gradient h-2 block absolute right-0 rounded-full' style={progressStyle}></span>
    </span>
  );
}

export default PercentageBar;
