import { ReactNode } from "react";

interface FormCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const FormCard = ({ title, children, className = "" }: FormCardProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className={`w-full max-w-md bg-surface rounded-2xl shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <div className="text-sm text-muted-foreground">
            100,000 satoshis ≈ ₦1,630.48
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default FormCard;