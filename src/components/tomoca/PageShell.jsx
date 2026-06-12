import React from 'react';
import TomocaHeader from './TomocaHeader';
import TomocaFooter from './TomocaFooter';

export default function PageShell({ children, dark = false }) {
  return (
    <div className={dark ? 'min-h-screen bg-foreground text-background' : 'min-h-screen bg-background text-foreground'}>
      <TomocaHeader />
      {children}
      <TomocaFooter />
    </div>
  );
}