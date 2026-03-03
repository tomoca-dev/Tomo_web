import { useBeanDensity } from "@/contexts/BeanDensityContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Coffee, AlertTriangle } from "lucide-react";

const densityOptions = [
  { value: "default", label: "Default", description: "Balanced animation" },
  { value: "plus25", label: "+25%", description: "Slightly more beans" },
  { value: "plus50", label: "+50%", description: "Enhanced density" },
  { value: "plus200", label: "+200%", description: "Maximum density (⚠️ performance)" },
] as const;

export function BeanDensityControl() {
  const { density, setDensity } = useBeanDensity();

  // Check for low device memory
  const getDeviceMemory = (): number => {
    // @ts-ignore - deviceMemory is not in all browsers
    return navigator.deviceMemory || 4;
  };

  const isLowMemory = getDeviceMemory() < 4;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Coffee className="h-4 w-4" />
              {density !== "default" && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              )}
              <span className="sr-only">Bean density control</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Background bean density</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          Bean Density
        </div>
        {densityOptions.map((option) => {
          const isHighDensity = option.value === "plus200";
          const shouldWarn = isHighDensity && isLowMemory;

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setDensity(option.value)}
              className={density === option.value ? "bg-secondary" : ""}
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  <span className="font-medium">{option.label}</span>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                {shouldWarn && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertTriangle className="h-4 w-4 text-amber-500 ml-2" />
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-[200px]">
                      <p className="text-xs">
                        Your device has limited memory. High density may cause
                        performance issues.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {density === option.value && (
                  <span className="text-primary">✓</span>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
