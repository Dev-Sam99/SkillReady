import React from 'react';
import { Logo } from './Logo';

export const SkillReadyLogo: React.FC<{ className?: string; size?: number }> = (props) => {
  return <Logo {...props} />;
};

