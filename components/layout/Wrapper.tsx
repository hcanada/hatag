import { ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
  className?: string;
}

export default function Wrapper({ children, className = "" }: WrapperProps) {
  return (
    <div className={`w-full max-w-5xl mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
}
