import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Coffee, AlertTriangle } from "lucide-react";

type DensityLevel = "default" | "plus25" | "plus50" | "plus200";

const densityOptions: { value: DensityLevel; label: string; description: string }[] = [
  { value: "default", label: "Default", description: "Standard animation density" },
  { value: "plus25", label: "+25%", description: "Slightly more background beans" },
  { value: "plus50", label: "+50%", description: "Enhanced visual density" },
  { value: "plus200", label: "+200%", description: "Maximum density (may impact performance)" },
];

export function BeanDensityAdmin() {
  const [globalDensity, setGlobalDensity] = useState<DensityLevel>("default");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSetting();
  }, []);

  const fetchSetting = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "bean_density")
      .maybeSingle();

    if (data?.value) {
      const setting = data.value as { level: DensityLevel };
      setGlobalDensity(setting.level);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        value: { level: globalDensity, multiplier: getMultiplier(globalDensity) },
      })
      .eq("key", "bean_density");

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Settings saved", description: "Global bean density updated" });
    }
    setSaving(false);
  };

  const getMultiplier = (level: DensityLevel) => {
    const multipliers = { default: 1.0, plus25: 1.25, plus50: 1.5, plus200: 3.0 };
    return multipliers[level];
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-display text-xl mb-1">Global Bean Density</h2>
        <p className="text-sm text-muted-foreground">
          Set the default background animation density for all visitors. Users can override this locally.
        </p>
      </div>

      <div className="bg-card/30 border border-border rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg">
          <Coffee className="w-5 h-5 shrink-0" />
          <p>
            Background beans are decorative coffee particles that float across the page.
            They respect <code className="text-xs bg-secondary px-1 py-0.5 rounded">prefers-reduced-motion</code> and 
            are automatically capped based on device capability.
          </p>
        </div>

        <RadioGroup
          value={globalDensity}
          onValueChange={(v) => setGlobalDensity(v as DensityLevel)}
          className="space-y-3"
        >
          {densityOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                globalDensity === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <RadioGroupItem value={option.value} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{option.label}</span>
                  {option.value === "plus200" && (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </label>
          ))}
        </RadioGroup>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Setting"}
          </Button>
        </div>
      </div>

      <div className="bg-card/30 border border-border rounded-xl p-6">
        <h3 className="font-medium mb-2">Device Caps</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The system automatically adjusts bean count based on device type to maintain performance:
        </p>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="bg-secondary/30 p-3 rounded-lg">
            <p className="text-muted-foreground">Desktop</p>
            <p className="font-display text-lg">8–48</p>
          </div>
          <div className="bg-secondary/30 p-3 rounded-lg">
            <p className="text-muted-foreground">Tablet</p>
            <p className="font-display text-lg">6–28</p>
          </div>
          <div className="bg-secondary/30 p-3 rounded-lg">
            <p className="text-muted-foreground">Mobile</p>
            <p className="font-display text-lg">4–16</p>
          </div>
        </div>
      </div>
    </div>
  );
}
