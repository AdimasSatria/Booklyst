"use client";

import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { useBooks } from "@/context/BookContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, MessageCircle, UserCircle, ShoppingCart, Zap } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import FloatingBuyBar from "@/components/book/FloatingBuyBar";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { listedBooks } = useBooks();
  const { addToCart } = useCart();

  const bookId = typeof params.id === "string" ? parseInt(params.id, 10) : -1;

  const foundBook = listedBooks.find((b) => b.id === bookId);

  // Jika buku benar-benar tidak ada di awal (bukan karena baru dibeli)
  if (!foundBook) {
    return (
      <div className="min-h-screen bg-brand-surface flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Buku tidak ditemukan</h1>
        <button onClick={() => router.push("/")} className="px-6 py-2 bg-brand-primary text-brand-base rounded-full">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const add = () => {
    addToCart({
      id: String(foundBook.id),
      title: foundBook.title,
      author: foundBook.author,
      price: foundBook.price,
      condition: foundBook.condition as any,
      coverImage: foundBook.imageUrl,
      seller: foundBook.seller,
    });
  };

  const handleAddToCart = () => add();
  const handleBuyNow = () => {
    add();
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-brand-base pt-20 pb-28 md:pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-brand-text/60 hover:text-brand-text transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Sticky Image */}
          <div className="relative">
            <div className="md:sticky md:top-32 w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-brand-secondary flex items-center justify-center p-8">
              <div className="relative w-full h-full shadow-lg rounded-sm overflow-hidden">
                <Image
                  src={foundBook.imageUrl}
                  alt={foundBook.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Right: Detail */}
          <div className="py-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-secondary rounded-full text-xs font-bold tracking-wider mb-4 uppercase">
                {foundBook.faculty}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 leading-tight">
                {foundBook.title}
              </h1>
              <p className="text-xl text-brand-text/60 mb-8">{foundBook.author}</p>

              <div className="flex items-end justify-between border-b border-brand-secondary pb-8 mb-8">
                <div>
                  <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">Harga</p>
                  <p className="text-3xl font-bold">{formatPrice(foundBook.price)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">Kondisi</p>
                  <p className="text-lg font-bold bg-brand-secondary px-3 py-1 rounded-md inline-block">{foundBook.condition}</p>
                </div>
              </div>

              {foundBook.seller && (
                <div className="mb-8 p-4 rounded-2xl border border-neutral-200 bg-[#F7F2EB]/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                      <UserCircle className="w-7 h-7 text-neutral-400" />
                    </div>
                    <div>
                      <p className="font-bold text-[#333333] text-lg leading-tight mb-1">{foundBook.seller.name}</p>
                      <p className="text-xs text-neutral-500 font-medium">{foundBook.seller.prodi} • Angkatan {foundBook.seller.angkatan}</p>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${foundBook.seller.wa}`}
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
                <p className="text-neutral-700 leading-relaxed">{foundBook.description}</p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-brand-surface rounded-xl mb-10">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium text-brand-text/80">Terverifikasi milik mahasiswa aktif UPN Veteran Jatim.</p>
              </div>

              {/* Desktop action buttons (mobile uses FloatingBuyBar) */}
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-brand-secondary text-brand-text font-bold rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Tambah ke Keranjang
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 bg-brand-primary text-white font-bold rounded-2xl hover:bg-[#7a8a5d] transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10"
                >
                  <Zap className="w-5 h-5" />
                  Beli Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <FloatingBuyBar book={foundBook} />
    </main>
  );
}
