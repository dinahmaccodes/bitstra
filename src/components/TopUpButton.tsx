import { Button } from "@/components/ui/button";

interface TopUpButtonProps {
  amount: number;
  cashback: string;
  selected?: boolean;
  onClick: () => void;
}

const TopUpButton = ({ amount, cashback, selected = false, onClick }: TopUpButtonProps) => {
  return (
    <Button
      variant={selected ? "topup-selected" : "topup"}
      onClick={onClick}
      className="h-auto p-3 flex flex-col items-center gap-1 min-w-[80px]"
    >
      <div className="text-xs text-success font-medium">{cashback}</div>
      <div className="text-base font-bold">{amount.toLocaleString()}</div>
    </Button>
  );
};

export default TopUpButton;