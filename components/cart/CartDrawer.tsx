"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import SafeImage from "@/components/SafeImage";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const isMobile = useIsMobile();

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur overlay — sits BELOW the drawer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
          />

          {/* Mobile: bottom sheet (slides on Y) | Desktop: right drawer (slides on X) */}
          <motion.div
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-3xl z-[100] flex flex-col shadow-2xl
                       md:inset-y-0 md:left-auto md:right-0 md:w-96 md:max-h-none md:rounded-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span className="font-bold text-lg">Keranjang</span>
                {totalItems > 0 && (
                  <span className="bg-[#8B9A6E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Tutup keranjang"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-7 h-7 text-neutral-400" />
                </div>
                <p className="font-bold text-lg mb-1">Keranjang kosong</p>
                <p className="text-sm text-neutral-500 mb-6">Tambahkan buku untuk mulai belanja.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#8B9A6E] text-white rounded-full font-bold text-sm hover:bg-[#7a8a5d] transition-colors"
                >
                  Lihat Katalog
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 rounded-2xl border border-neutral-100 bg-neutral-50/50">
                      <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                        <SafeImage src={item.coverImage} alt={item.title} fill className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm leading-tight line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-neutral-500 line-clamp-1 mb-2">{item.author}</p>
                        <p className="font-bold text-sm text-[#8B9A6E]">{formatPrice(item.price)}</p>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label="Hapus item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-full p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors"
                            aria-label="Kurangi jumlah"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors"
                            aria-label="Tambah jumlah"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="shrink-0 px-6 py-5 border-t border-neutral-100 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Total ({totalItems} item)</span>
                    <span className="font-bold text-lg">{formatPrice(totalPrice)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 bg-[#8B9A6E] text-white font-bold rounded-2xl hover:bg-[#7a8a5d] transition-colors shadow-lg shadow-black/5"
                  >
                    Lanjut Pembayaran
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
