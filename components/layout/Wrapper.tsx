import { ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
  className?: string;
}

export default function Wrapper({ children, className = "" }: WrapperProps) {
  return (
    <div className={`w-full max-w-6xl mx-auto px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
}
