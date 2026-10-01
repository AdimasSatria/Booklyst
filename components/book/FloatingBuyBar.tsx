"use client";

import { ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Book } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function FloatingBuyBar({ book }: { book: Book }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const add = () => {
    addToCart({
      id: String(book.id),
      title: book.title,
      author: book.author,
      price: book.price,
      condition: book.condition as any,
      coverImage: book.imageUrl,
      seller: book.seller,
    });
  };

  // "Tambah ke Keranjang" ONLY adds — no routing.
  const handleAddToCart = () => add();

  // "Beli Sekarang" adds AND pushes to /checkout immediately.
  const handleBuyNow = () => {
    add();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/90 backdrop-blur-lg
                    md:bottom-6 md:left-auto md:right-6 md:inset-x-auto md:w-auto
                    md:border md:border-neutral-200/80 md:rounded-full md:shadow-2xl md:shadow-black/10">
      <div className="flex items-center gap-3 p-3 md:px-4 md:py-2.5">
        {/* Price — hidden on mobile to keep the bar compact */}
        <div className="hidden md:flex flex-col shrink-0 pl-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Harga</span>
          <span className="font-bold leading-none">{formatPrice(book.price)}</span>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 py-3.5 md:py-3 md:px-5
                     rounded-2xl md:rounded-full font-bold text-sm bg-neutral-100 text-neutral-900
                     hover:bg-neutral-200 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="md:hidden">Tambah ke Keranjang</span>
          <span className="hidden md:inline">Keranjang</span>
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 py-3.5 md:py-3 md:px-6
                     rounded-2xl md:rounded-full font-bold text-sm bg-[#8B9A6E] text-white
                     hover:bg-[#7a8a5d] transition-colors shadow-lg shadow-black/10"
        >
          <Zap className="w-4 h-4" />
          Beli Sekarang
        </button>
      </div>
    </div>
  );
}
