import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const QORPY_EINVOICE_URL = "https://qorpy.vercel.app/";

export default function EInvoicePage() {
  useEffect(() => {
    window.location.href = QORPY_EINVOICE_URL;
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Redirecting to E-Invoice portal...</p>
    </div>
  );
}
