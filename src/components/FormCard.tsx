import { ReactNode } from "react";

interface FormCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const FormCard = ({ title, children, className = "" }: FormCardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-lg bg-surface rounded-3xl shadow-2xl border border-border/50 p-8 backdrop-blur-sm ${className}`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {title}
          </h1>
          <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            Lightning Network
          </div>
        </div>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default FormCard;
