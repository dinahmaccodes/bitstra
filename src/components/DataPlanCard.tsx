import { Button } from "@/components/ui/button";

interface DataPlanCardProps {
  data: string;
  duration: string;
  price: string;
  cashback: string;
  selected?: boolean;
  onClick: () => void;
}

const DataPlanCard = ({ data, duration, price, cashback, selected = false, onClick }: DataPlanCardProps) => {
  return (
    <Button
      variant={selected ? "topup-selected" : "topup"}
      onClick={onClick}
      className="h-auto p-4 flex flex-col items-center gap-1 min-w-[120px]"
    >
      <div className="text-lg font-bold">{data}</div>
      <div className="text-sm text-muted-foreground">{duration}</div>
      <div className="text-sm font-semibold">{price}</div>
      <div className="text-xs text-success font-medium">{cashback}</div>
    </Button>
  );
};

export default DataPlanCard;