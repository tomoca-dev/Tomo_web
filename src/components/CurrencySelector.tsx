import { useCurrency } from "@/contexts/CurrencyContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  const currencies: { code: "USD" | "EUR" | "ETB"; label: string; symbol: string }[] = [
    { code: "USD", label: "US Dollar", symbol: "$" },
    { code: "EUR", label: "Euro", symbol: "€" },
    { code: "ETB", label: "Ethiopian Birr", symbol: "Birr" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-foreground h-9 px-3 hover:opacity-80 transition-opacity">
          <Globe className="w-4 h-4" />
          <span className="font-medium text-xs">
            {currency} ({currencies.find(c => c.code === currency)?.symbol})
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border w-40">
        {currencies.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => setCurrency(c.code)}
            className={`cursor-pointer flex items-center justify-between text-[#E78A22] transition-colors ${
              currency === c.code ? "bg-primary/20 font-bold" : "hover:bg-primary/10"
            }`}
          >
            <span>{c.label}</span>
            <span className="text-xs opacity-70 font-mono">{c.symbol}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
