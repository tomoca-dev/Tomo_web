import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Variant {
  id: string;
  name: string;
  sku: string | null;
  price_adjustment: number;
  weight_grams: number | null;
  grind_type: string | null;
  is_available: boolean;
}

interface ProductVariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onSelect: (variant: Variant) => void;
  basePrice: number;
}

export function ProductVariantSelector({
  variants,
  selectedVariant,
  onSelect,
  basePrice,
}: ProductVariantSelectorProps) {
  // Group variants by grind type
  const grindTypes = [...new Set(variants.map((v) => v.grind_type).filter(Boolean))];
  const weightOptions = [...new Set(variants.map((v) => v.weight_grams).filter(Boolean))];

  const [selectedGrind, setSelectedGrind] = useState<string | null>(
    selectedVariant?.grind_type || grindTypes[0] || null
  );
  const [selectedWeight, setSelectedWeight] = useState<number | null>(
    selectedVariant?.weight_grams || weightOptions[0] || null
  );

  const handleSelect = (grind: string | null, weight: number | null) => {
    const variant = variants.find(
      (v) => v.grind_type === grind && v.weight_grams === weight
    );
    if (variant) {
      onSelect(variant);
    }
  };

  const getVariantPrice = (variant: Variant) => {
    return basePrice + (variant.price_adjustment || 0);
  };

  if (variants.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Grind Type Selection */}
      {grindTypes.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-3">Grind Type</label>
          <div className="flex flex-wrap gap-2">
            {grindTypes.map((grind) => {
              const isSelected = selectedGrind === grind;
              const variant = variants.find(
                (v) => v.grind_type === grind && v.weight_grams === selectedWeight
              );
              const isAvailable = variant?.is_available !== false;

              return (
                <motion.button
                  key={grind}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedGrind(grind);
                    handleSelect(grind, selectedWeight);
                  }}
                  disabled={!isAvailable}
                  className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isSelected && <Check className="w-4 h-4" />}
                  <span className="capitalize">
                    {grind?.replace("_", " ")}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Weight Selection */}
      {weightOptions.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-3">Size</label>
          <div className="flex flex-wrap gap-2">
            {weightOptions.sort((a, b) => (a || 0) - (b || 0)).map((weight) => {
              const isSelected = selectedWeight === weight;
              const variant = variants.find(
                (v) => v.grind_type === selectedGrind && v.weight_grams === weight
              );
              const isAvailable = variant?.is_available !== false;

              return (
                <motion.button
                  key={weight}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedWeight(weight);
                    handleSelect(selectedGrind, weight);
                  }}
                  disabled={!isAvailable}
                  className={`px-4 py-3 rounded-lg border transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  } ${!isAvailable ? "opacity-50 cursor-not-allowed line-through" : ""}`}
                >
                  <div className="font-medium">{weight}g</div>
                  {variant && (
                    <div className="text-sm text-muted-foreground">
                      ${getVariantPrice(variant).toFixed(2)}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Simple variant list for products without grind/weight grouping */}
      {grindTypes.length === 0 && weightOptions.length === 0 && (
        <div>
          <label className="block text-sm font-medium mb-3">Options</label>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <motion.button
                key={variant.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(variant)}
                disabled={!variant.is_available}
                className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                  selectedVariant?.id === variant.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                } ${!variant.is_available ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {selectedVariant?.id === variant.id && <Check className="w-4 h-4" />}
                <span>{variant.name}</span>
                {variant.price_adjustment !== 0 && (
                  <span className="text-sm text-muted-foreground">
                    {variant.price_adjustment > 0 ? "+" : ""}$
                    {variant.price_adjustment.toFixed(2)}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
