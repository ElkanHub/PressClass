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
  userEmail?: string;
}

const PAYSTACK_LINKS: Record<string, string | undefined> = {
  taste: process.env.NEXT_PUBLIC_PAYSTACK_LINK_TASTE,
  starter: process.env.NEXT_PUBLIC_PAYSTACK_LINK_STARTER,
  popular: process.env.NEXT_PUBLIC_PAYSTACK_LINK_POPULAR,
  bulk: process.env.NEXT_PUBLIC_PAYSTACK_LINK_BULK,
};

function formatPrice(amountMinor: number, currency: string): string {
  const amount = amountMinor / 100;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export default function CreditPackages({ packages, currency, userEmail }: Props) {
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
                const link = PAYSTACK_LINKS[pkg.code];
                if (!link) {
                  toast.error("Payment link not configured for this package.");
                  return;
                }

                let targetUrl = link;
                if (userEmail) {
                  try {
                    const url = new URL(link);
                    url.searchParams.set("email", userEmail);
                    targetUrl = url.toString();
                  } catch (e) {
                    const separator = link.includes("?") ? "&" : "?";
                    targetUrl = `${link}${separator}email=${encodeURIComponent(userEmail)}`;
                  }
                }

                toast.info("Redirecting to payment checkout...");
                window.location.href = targetUrl;
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
