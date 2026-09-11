import { Header } from "@/components/shared/header";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getPreferredCurrency } from "@/lib/geo/currency-server";

export default async function CheckoutPage() {
  const detectedCurrency = await getPreferredCurrency();

  return (
    <div className="min-h-screen notebook-bg flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <CheckoutForm detectedCurrency={detectedCurrency} />
        </div>
      </main>
    </div>
  );
}
