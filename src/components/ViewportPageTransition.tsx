import React from 'react';

interface ViewportPageTransitionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export const ViewportPageTransition: React.FC<ViewportPageTransitionProps> = ({
  children,
  id,
  className = '',
}) => {
  return (
    <div id={id} className={`w-full ${className}`} style={{ contain: 'layout style', isolation: 'isolate' }}>
      {children}
    </div>
  );
};

export default ViewportPageTransition;

