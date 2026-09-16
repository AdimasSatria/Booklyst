"use client";

import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { useBooks } from "@/context/BookContext";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, MapPin, CreditCard, Banknote, CheckCircle, ShieldCheck, MessageCircle, UserCircle } from "lucide-react";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { listedBooks, buyBook } = useBooks();
  
  const bookId = typeof params.id === "string" ? parseInt(params.id, 10) : -1;
  const book = listedBooks.find(b => b.id === bookId);

  const [step, setStep] = useState<"detail" | "payment" | "location" | "success">("detail");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "transfer" | "cash">("qris");
  const [deliveryLocation, setDeliveryLocation] = useState("GKB 2, Lantai 1");

  const priceFormat = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" });

  if (!book) {
    return (
      <div className="min-h-screen bg-brand-surface flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Buku tidak ditemukan</h1>
        <button onClick={() => router.push("/")} className="px-6 py-2 bg-brand-primary text-brand-base rounded-full">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const handleCheckout = () => {
    buyBook(book, paymentMethod, paymentMethod === "cash" ? "COD" : deliveryLocation);
    setStep("success");
  };

  return (
    <main className="min-h-screen bg-brand-base pt-20 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-sm font-semibold text-brand-text/60 hover:text-brand-text transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Sticky Image */}
          <div className="relative">
            <div className="md:sticky md:top-32 w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-brand-secondary flex items-center justify-center p-8">
              <div className="relative w-full h-full shadow-lg rounded-sm overflow-hidden">
                <Image 
                  src={book.imageUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Right: Steps Flow */}
          <div className="py-4">
            {step === "detail" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-secondary rounded-full text-xs font-bold tracking-wider mb-4 uppercase">
                  {book.faculty}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 leading-tight">
                  {book.title}
                </h1>
                <p className="text-xl text-brand-text/60 mb-8">{book.author}</p>
                
                <div className="flex items-end justify-between border-b border-brand-secondary pb-8 mb-8">
                  <div>
                    <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">Harga</p>
                    <p className="text-3xl font-bold">{priceFormat.format(book.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">Kondisi</p>
                    <p className="text-lg font-bold bg-brand-secondary px-3 py-1 rounded-md inline-block">{book.condition}</p>
                  </div>
                </div>

                {book.seller && (
                  <div className="mb-8 p-4 rounded-2xl border border-neutral-200 bg-[#F7F2EB]/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                        <UserCircle className="w-7 h-7 text-neutral-400" />
                      </div>
                      <div>
                        <p className="font-bold text-[#333333] text-lg leading-tight mb-1">{book.seller.name}</p>
                        <p className="text-xs text-neutral-500 font-medium">{book.seller.prodi} • Angkatan {book.seller.angkatan}</p>
                      </div>
                    </div>
                    <a 
                      href={`https://wa.me/${book.seller.wa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#8B9A6E] flex items-center justify-center hover:bg-[#7a8a5d] transition-colors shrink-0 shadow-sm"
                    >
                      <MessageCircle className="w-5 h-5 text-white" />
                    </a>
                  </div>
                )}

                <div className="mb-10">
                  <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Deskripsi</p>
                  <p className="text-neutral-700 leading-relaxed">{book.description}</p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-brand-surface rounded-xl mb-10">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium text-brand-text/80">Terverifikasi milik mahasiswa aktif UPN Veteran Jatim.</p>
                </div>

                <button 
                  onClick={() => setStep("payment")}
                  className="w-full py-5 bg-brand-primary text-brand-base text-lg font-bold rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20"
                >
                  Beli Sekarang
                </button>
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-3xl font-bold mb-6">Pilih Pembayaran</h2>
                <div className="space-y-4 mb-8">
                  {[
                    { id: "qris", title: "QRIS", icon: CreditCard, desc: "Scan otomatis via aplikasi m-banking/e-wallet." },
                    { id: "transfer", title: "Transfer Bank", icon: Banknote, desc: "Transfer manual ke Virtual Account." },
                    { id: "cash", title: "Bayar Tunai (COD)", icon: MapPin, desc: "Bayar langsung saat bertemu penjual." },
                  ].map((method) => (
                    <label 
                      key={method.id}
                      className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id ? "border-black bg-brand-surface" : "border-brand-secondary hover:border-brand-secondary"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="mt-1 text-brand-text focus:ring-black w-4 h-4"
                      />
                      <div>
                        <p className="font-bold text-lg flex items-center gap-2">
                          <method.icon className="w-5 h-5" /> {method.title}
                        </p>
                        <p className="text-sm text-brand-text/60 mt-1">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep("detail")} className="px-6 py-4 rounded-xl font-bold bg-brand-secondary hover:bg-neutral-200 transition-colors">Batal</button>
                  <button onClick={() => setStep("location")} className="flex-1 py-4 bg-brand-primary text-brand-base text-lg font-bold rounded-xl hover:bg-neutral-800 transition-colors">Lanjut</button>
                </div>
              </motion.div>
            )}

            {step === "location" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-3xl font-bold mb-6">Pilih Lokasi</h2>
                {paymentMethod === "cash" ? (
                  <div className="p-6 bg-brand-surface rounded-2xl border border-brand-secondary mb-8 text-center">
                    <MapPin className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                    <p className="font-bold text-lg">Cash on Delivery (COD)</p>
                    <p className="text-sm text-brand-text/60 mt-1">Anda dapat menyepakati lokasi bertemu dengan penjual melalui chat setelah pesanan dibuat.</p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-8">
                    {[
                      "GKB 2, Lantai 1",
                      "GKB 1, Lobi Utama",
                      "Perpustakaan Pusat",
                      "Gedung FISIP",
                      "Kantin FEB"
                    ].map((loc) => (
                      <label 
                        key={loc}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          deliveryLocation === loc ? "border-black bg-brand-surface" : "border-brand-secondary hover:border-brand-secondary"
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="location"
                          value={loc}
                          checked={deliveryLocation === loc}
                          onChange={(e) => setDeliveryLocation(e.target.value)}
                          className="text-brand-text focus:ring-black w-4 h-4"
                        />
                        <span className="font-bold">{loc}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-4">
                  <button onClick={() => setStep("payment")} className="px-6 py-4 rounded-xl font-bold bg-brand-secondary hover:bg-neutral-200 transition-colors">Kembali</button>
                  <button onClick={handleCheckout} className="flex-1 py-4 bg-brand-primary text-brand-base text-lg font-bold rounded-xl hover:bg-neutral-800 transition-colors">Konfirmasi Pesanan</button>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold mb-3">Pesanan Berhasil!</h2>
                <p className="text-brand-text/60 mb-8 max-w-sm mx-auto">
                  Penjual telah dihubungi. Silakan pantau status pesanan di Dashboard Anda.
                </p>
                <button 
                  onClick={() => router.push("/profile")}
                  className="px-8 py-4 bg-brand-primary text-brand-base text-lg font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-lg"
                >
                  Lihat Dashboard
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
