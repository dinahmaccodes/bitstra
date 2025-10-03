import { Button } from "@/components/ui/button";

interface DataPlanCardProps {
  data: string;
  duration: string;
  price: string;
  selected?: boolean;
  onClick: () => void;
}

const DataPlanCard = ({
  data,
  duration,
  price,
  selected = false,
  onClick,
}: DataPlanCardProps) => {
  return (
    <Button
      variant={selected ? "topup-selected" : "topup"}
      onClick={onClick}
      className="h-auto p-4 flex flex-col items-center gap-1 min-w-[120px]"
    >
      <div className="text-lg font-bold">{data}</div>
      <div className="text-sm text-muted-foreground">{duration}</div>
      <div className="text-sm font-semibold">{price}</div>
    </Button>
  );
};

export default DataPlanCard;
