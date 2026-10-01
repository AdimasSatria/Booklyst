"use client";

import { motion } from "motion/react";
import { ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Book } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import SafeImage from "@/components/SafeImage";
import { useState } from "react";

export default function BookCard({ book, priority = false }: { book: Book; priority?: boolean }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: String(book.id),
      title: book.title,
      author: book.author,
      price: book.price,
      condition: book.condition as any,
      coverImage: book.imageUrl,
      seller: book.seller,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: String(book.id),
      title: book.title,
      author: book.author,
      price: book.price,
      condition: book.condition as any,
      coverImage: book.imageUrl,
      seller: book.seller,
    });
    router.push("/checkout");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer flex flex-col bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm
                 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
      onClick={() => router.push(`/book/${book.id}`)}
    >
      <div className="relative aspect-[3/4] w-full bg-brand-secondary overflow-hidden">
        <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out">
          <SafeImage
            src={book.imageUrl}
            alt={book.title}
            fill
            className="object-cover"
            priority={priority}
          />
        </div>

        {/* Condition badge */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-neutral-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm z-10">
          {book.condition}
        </span>

        {/* Faculty badge */}
        <span className="absolute top-3 right-3 bg-[#8B9A6E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm z-10">
          {book.faculty}
        </span>

        {/* Hover action bar (mobile tap-through, desktop hover) */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/95 text-neutral-900 py-2 rounded-full font-bold text-xs hover:bg-white transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {justAdded ? "Ditambahkan" : "Tambah"}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-1.5 bg-[#8B9A6E] text-white py-2 px-4 rounded-full font-bold text-xs hover:bg-[#7a8a5d] transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Beli
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-base leading-tight mb-1 line-clamp-2 group-hover:text-neutral-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-brand-text/60 text-xs mb-3 line-clamp-1">{book.author}</p>

        <div className="mt-auto flex items-end justify-between">
          <span className="font-bold text-lg">{formatPrice(book.price)}</span>
          {book.seller && (
            <span className="text-[10px] font-medium text-brand-text/50 line-clamp-1 max-w-[50%]">
              {book.seller.name}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
