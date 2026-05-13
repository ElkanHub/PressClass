"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Price { currency: string; amount_minor: number; }
interface Package {
  id: string;
  code: string;
  name: string;
  credits: number;
  bonus_credits: number;
  credit_package_prices: Price[];
}

interface Props {
  packages: Package[];
  currency: string;
}

function formatPrice(amountMinor: number, currency: string): string {
  const amount = amountMinor / 100;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export default function CreditPackages({ packages, currency }: Props) {
  if (!packages.length) {
    return <div className="text-muted-foreground">No packages available yet.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {packages.map((pkg) => {
        const price =
          pkg.credit_package_prices.find((p) => p.currency === currency) ??
          pkg.credit_package_prices.find((p) => p.currency === "USD");
        const total = pkg.credits + pkg.bonus_credits;
        const featured = pkg.code === "popular";

        return (
          <Card key={pkg.id} className={`p-6 ${featured ? "border-primary ring-2 ring-primary/20" : ""}`}>
            {featured && (
              <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" /> Most popular
              </div>
            )}
            <h3 className="text-lg font-semibold">{pkg.name}</h3>
            <div className="mt-2 text-3xl font-bold">{total}</div>
            <div className="text-sm text-muted-foreground">
              credits{pkg.bonus_credits ? ` (${pkg.credits} + ${pkg.bonus_credits} bonus)` : ""}
            </div>
            <div className="mt-4 text-2xl font-semibold">
              {price ? formatPrice(price.amount_minor, price.currency) : "—"}
            </div>
            <Button
              className="mt-4 w-full"
              onClick={() => {
                toast.info("Payment gateway coming online soon — credit purchases will activate in the next deploy.");
              }}
            >
              Buy now
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
