"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useBooks } from "@/context/BookContext";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, MapPin, CreditCard, Loader2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import SafeImage from "@/components/SafeImage";

const COD_LOCATIONS = [
  "GKB 2, Lantai 1",
  "GKB 1, Lobi Utama",
  "Perpustakaan Pusat",
  "Gedung FISIP",
  "Kantin FEB",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { addOrderFromCheckout } = useBooks();
  const { isLoggedIn } = useAuth();

  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [deliveryLocation, setDeliveryLocation] = useState(COD_LOCATIONS[0]);
  const [orderId, setOrderId] = useState<string>("");

  // Route guard: redirect anonymous users to /login.
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (authChecked && !isLoggedIn) {
      router.replace("/login");
    }
  }, [authChecked, isLoggedIn, router]);

  // Hold render until the auth state hydrates, to avoid a protected UI flash.
  if (!authChecked || !isLoggedIn) return null;

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => {
      const id = `ORD-${Date.now()}`;
      addOrderFromCheckout(items, "QRIS", deliveryLocation);
      clearCart();
      setOrderId(id);
      setStep("success");
    }, 1500);
  };

  // Render priority: success → processing → empty → form.
  // clearCart() above must not hide the success/loading screens.
  if (step === "success") {
    return (
      <main className="min-h-screen bg-brand-surface flex items-center justify-center px-6 pt-20 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-neutral-100 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
          >
            <CheckCircle className="w-10 h-10" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Pembayaran Berhasil!</h2>
          <p className="text-neutral-500 mb-2 leading-relaxed">
            Pesanan kamu sedang diverifikasi oleh penjual.
          </p>
          <p className="text-xs font-mono text-neutral-400 mb-8">Order ID: {orderId}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/profile")}
              className="flex-1 py-4 bg-[#8B9A6E] text-white font-bold rounded-full hover:bg-[#7a8a5d] transition-colors shadow-lg shadow-black/5"
            >
              Cek Status Pesanan
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 py-4 bg-neutral-100 text-neutral-900 font-bold rounded-full hover:bg-neutral-200 transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  if (step === "processing") {
    return (
      <main className="min-h-screen bg-brand-surface flex items-center justify-center px-6 pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#8B9A6E] animate-spin" />
          <p className="font-bold text-lg">Memproses pembayaran...</p>
          <p className="text-sm text-neutral-500">Mohon tunggu, jangan tutup halaman ini.</p>
        </div>
      </main>
    );
  }

  if (totalItems === 0) {
    return (
      <main className="min-h-screen bg-brand-surface flex items-center justify-center px-6 pt-20 pb-24">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-100 shadow-sm">
            <ShoppingBag className="w-7 h-7 text-neutral-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">Keranjang kamu kosong</h2>
          <p className="text-neutral-500 text-sm mb-6">Pilih buku dulu sebelum checkout.</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-[#8B9A6E] text-white font-bold rounded-full hover:bg-[#7a8a5d] transition-colors"
          >
            Lihat Katalog
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-surface pt-24 pb-32 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-sm font-semibold text-brand-text/60 hover:text-brand-text transition-colors mb-6"
        >
          ← Kembali
        </button>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Location */}
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="w-5 h-5 text-[#8B9A6E]" />
                <h2 className="text-lg font-bold">Pilih Lokasi COD</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COD_LOCATIONS.map((loc) => (
                  <label
                    key={loc}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${deliveryLocation === loc
                      ? "border-[#8B9A6E] bg-[#8B9A6E]/5"
                      : "border-neutral-100 hover:border-neutral-200"
                      }`}
                  >
                    <input
                      type="radio"
                      name="location"
                      value={loc}
                      checked={deliveryLocation === loc}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="text-[#8B9A6E] focus:ring-[#8B9A6E] w-4 h-4"
                    />
                    <span className="font-medium text-sm">{loc}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Payment */}
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="w-5 h-5 text-[#8B9A6E]" />
                <h2 className="text-lg font-bold">Metode Pembayaran</h2>
              </div>
              <label className="flex items-center gap-4 p-5 rounded-2xl border-2 border-[#8B9A6E] bg-[#8B9A6E]/5 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked
                  readOnly
                  className="text-[#8B9A6E] focus:ring-[#8B9A6E] w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-bold flex items-center gap-2">QRIS</p>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    Scan otomatis via aplikasi m-banking / e-wallet apa pun.
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-[#8B9A6E]/15 text-[#6b7a52] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Aktif
                </span>
              </label>
              <p className="text-xs text-neutral-400 mt-4">
                Pembayaran tunai (COD) dilunasi langsung saat bertemu penjual di lokasi yang dipilih.
              </p>
            </section>
          </div>

          {/* Right: summary */}
          <div className="lg:col-span-1">
            <section className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm lg:sticky lg:top-28">
              <h2 className="text-lg font-bold mb-5">Ringkasan Pesanan</h2>

              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-12 h-16 rounded-md overflow-hidden bg-neutral-100 shrink-0">
                      <SafeImage
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-neutral-500">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="font-bold text-sm shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 py-4 border-t border-neutral-100 text-sm">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal ({totalItems} item)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Ongkos kirim</span>
                  <span className="font-medium text-green-600">Gratis (COD)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-100">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button
                onClick={handlePay}
                className="w-full py-4 mt-2 bg-[#8B9A6E] text-white font-bold rounded-2xl hover:bg-[#7a8a5d] transition-colors shadow-lg shadow-black/5 flex items-center justify-center gap-2"
              >
                Bayar Sekarang
              </button>
              <p className="text-[11px] text-neutral-400 text-center mt-3">
                Dengan checkout, kamu menyetujui S&K Booklyst.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
