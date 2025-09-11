import classNames from 'classnames';
import React from 'react';
import { DropdownMenuSeparatorProps } from './types';

const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({ className }) => {
  const separatorClasses = classNames(
    '-mx-1 my-1 h-px bg-gray-200',
    className
  );

  return <div className={separatorClasses} role="separator" />;
};

export default DropdownMenuSeparator;