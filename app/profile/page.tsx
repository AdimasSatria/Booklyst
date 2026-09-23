"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useBooks } from "@/context/BookContext";
import Image from "next/image";
import { BookMarked, Wallet, Store, User, X, Clock, Plus, Package, HelpCircle } from "lucide-react";
import { Book } from "@/types";

// Komponen pembungkus gambar agar otomatis menampilkan ikon "?" jika gambar gagal dimuat/tidak valid
function SafeImage({ src, alt, ...props }: { src: string; alt: string;[key: string]: any }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 text-black/40">
        <HelpCircle className="w-10 h-10 mb-1 stroke-[1.5]" />
        <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
    />
  );
}

export default function ProfilePage() {
  const { ownedBooks, listedBooks, activeOrders, resellBook, uploadNewBook } = useBooks();

  // Dashboard states
  const [activeTab, setActiveTab] = useState<"owned" | "listed" | "orders">("owned");
  const [resellModalData, setResellModalData] = useState<Book | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // State lokal untuk melacak pesanan agar statusnya bisa berubah otomatis setelah 1 menit
  const [ordersWithStatus, setOrdersWithStatus] = useState<any[]>([]);

  // Sinkronisasi activeOrders dari context dan inisialisasi waktu pesanan jika belum ada
  useEffect(() => {
    const initialized = activeOrders.map((order: any) => ({
      ...order,
      timestamp: order.timestamp || new Date(order.date).getTime() || Date.now(),
      currentStatus: (order.timestamp && Date.now() - order.timestamp > 60000) ? "Selesai" : (order.status || "Diproses")
    }));
    setOrdersWithStatus(initialized);
  }, [activeOrders]);

  // Timer untuk mengecek perubahan status otomatis setiap 1 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setOrdersWithStatus((prevOrders) =>
        prevOrders.map((order) => {
          if (order.currentStatus === "Selesai") return order;
          const elapsed = Date.now() - order.timestamp;
          if (elapsed > 60000) {
            return { ...order, currentStatus: "Selesai" };
          }
          return order;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const priceFormat = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" });

  const user = {
    name: "Adimas Satria",
    npm: "25081010266",
    faculty: "Fakultas Ilmu Komputer (Fasilkom)",
    major: "Informatika"
  };

  const userListedBooks = listedBooks.filter(b => b.seller?.name === user.name || b.ownerName === user.name).length;
  const booksSold = 0;

  const metrics = [
    { label: "Buku Dibeli", value: ownedBooks.length, icon: BookMarked },
    { label: "Buku Terjual", value: booksSold, icon: Wallet },
    { label: "Iklan Aktif", value: userListedBooks, icon: Store },
  ];

  const handleResellSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resellModalData) return;
    const formData = new FormData(e.currentTarget);
    resellBook(
      resellModalData.id,
      Number(formData.get("price")),
      formData.get("description") as string,
      formData.get("condition") as string
    );
    setResellModalData(null);
    setActiveTab("listed");
  };

  const handleUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    uploadNewBook({
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      faculty: formData.get("faculty") as string,
      price: Number(formData.get("price")),
      condition: formData.get("condition") as string,
      description: formData.get("description") as string,
      imageUrl: (formData.get("imageUrl") as string) || "https://placehold.co/400x600/8E44AD/FFFFFF/png?text=Book",
      seller: { name: user.name, prodi: user.major, angkatan: "2025", wa: "628000000000" }
    });
    setShowUploadModal(false);
    setActiveTab("listed");
  };

  const renderEmpty = (message: string) => (
    <div className="py-24 text-center bg-white rounded-[2rem] border border-neutral-200 shadow-sm">
      <Store className="w-12 h-12 text-black/30 mx-auto mb-4" />
      <p className="text-xl text-black/50 font-medium">{message}</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-neutral-50 pt-24 px-4 sm:px-6 pb-24">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Profil & Dashboard</h1>
          <p className="text-black/50 font-medium text-sm md:text-base">Informasi akun dan aktivitas sirkular Anda.</p>
        </header>

        {/* --- Profile & Metrics Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 bg-white rounded-[2rem] p-6 md:p-8 border border-neutral-200 shadow-sm flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-neutral-100/50 rounded-full flex items-center justify-center mb-6">
              <User className="w-8 h-8 md:w-10 md:h-10 text-black/60" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-1">{user.name}</h2>
            <p className="text-black/50 font-bold mb-6 font-mono text-xs md:text-sm tracking-widest">{user.npm}</p>

            <div className="w-full h-px bg-neutral-100 mb-6" />

            <div className="space-y-4 md:space-y-6 w-full">
              <div>
                <p className="text-[10px] md:text-[11px] text-black/40 font-bold uppercase tracking-widest mb-1.5">Fakultas</p>
                <p className="text-xs md:text-sm font-semibold">{user.faculty}</p>
              </div>
              <div>
                <p className="text-[10px] md:text-[11px] text-black/40 font-bold uppercase tracking-widest mb-1.5">Program Studi</p>
                <p className="text-xs md:text-sm font-semibold">{user.major}</p>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-4 md:gap-6">
            {metrics.map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border border-neutral-200 shadow-sm flex flex-col justify-between ${idx === 2 ? "col-span-2" : ""}`}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-neutral-100/30 flex items-center justify-center mb-4 md:mb-8">
                  <metric.icon className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-3xl md:text-5xl font-bold mb-1 md:mb-2">{metric.value}</h3>
                  <p className="text-black/50 font-bold uppercase tracking-wider text-[10px] md:text-xs">{metric.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- Dashboard Activity Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex bg-neutral-200/50 p-1.5 rounded-full w-full max-w-md relative overflow-hidden">
            {["owned", "listed", "orders"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className="flex-1 relative z-10 py-2.5 text-xs sm:text-sm font-bold rounded-full transition-colors"
              >
                <span className={activeTab === tab ? "text-black" : "text-black/50 hover:text-black"}>
                  {tab === "owned" ? "Koleksi" : tab === "listed" ? "Dijual" : "Pesanan"}
                </span>
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabProfile"
                    className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#8B9A6E] text-white rounded-full font-bold shadow-lg shadow-black/10 hover:bg-[#7a8a5d] transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            Jual Buku Baru
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "owned" && (
              ownedBooks.length === 0 ? renderEmpty("Kamu belum memiliki buku.") : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {ownedBooks.map((book) => (
                    <div key={book.id} className="bg-white rounded-3xl p-5 border border-neutral-200 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-4 shadow-inner bg-neutral-100">
                        <SafeImage src={book.imageUrl} alt={book.title} fill className="object-cover" />
                      </div>
                      <h3 className="font-bold text-base leading-tight mb-1 line-clamp-2">{book.title}</h3>
                      <p className="text-black/50 text-xs mb-4">{book.author}</p>
                      <button
                        onClick={() => setResellModalData(book)}
                        className="mt-auto w-full py-2.5 bg-neutral-100 text-black text-sm font-bold rounded-xl hover:bg-neutral-200 transition-colors"
                      >
                        Jual Kembali
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === "listed" && (
              listedBooks.filter(b => b.seller?.name === user.name || b.ownerName === user.name).length === 0 ? renderEmpty("Belum ada iklan aktif.") : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {listedBooks.filter(b => b.seller?.name === user.name || b.ownerName === user.name).map((book) => (
                    <div key={book.id} className="bg-white rounded-3xl p-5 border border-neutral-200 flex flex-col shadow-sm">
                      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-4 shadow-inner bg-neutral-100">
                        <SafeImage src={book.imageUrl} alt={book.title} fill className="object-cover" />
                      </div>
                      <h3 className="font-bold text-base leading-tight mb-1 line-clamp-2">{book.title}</h3>
                      <p className="text-black/50 text-xs mb-3">{book.author}</p>
                      <div className="mt-auto flex items-end justify-between">
                        <p className="font-bold text-black">{priceFormat.format(book.price)}</p>
                        <div className="inline-flex items-center gap-1 text-black text-[10px] font-bold bg-[#8B9A6E]/20 px-2 py-1 rounded-md">
                          <Clock className="w-3 h-3" /> Publik
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === "orders" && (
              ordersWithStatus.length === 0 ? renderEmpty("Tidak ada pesanan aktif.") : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ordersWithStatus.map((order) => {
                    const isDone = order.currentStatus === "Selesai";
                    return (
                      <div key={order.id} className="bg-white rounded-3xl p-5 border border-neutral-200 flex flex-row items-center gap-4 sm:gap-6 shadow-sm">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 ${isDone ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                          <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] sm:text-xs font-bold text-black/50 mb-1">{order.id} • {new Date(order.date).toLocaleDateString("id-ID")}</p>
                          <h3 className="font-bold text-sm sm:text-base line-clamp-1">{order.book.title}</h3>
                          <p className="text-xs font-medium mt-1 text-black/70">Via {order.paymentMethod.toUpperCase()}</p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-full font-bold text-[10px] sm:text-xs shrink-0 text-center transition-colors ${isDone ? "bg-emerald-100 text-emerald-700" : "bg-amber-50 text-amber-600"
                          }`}>
                          {order.currentStatus}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- Modals --- */}
      <AnimatePresence>
        {resellModalData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-[2rem] p-6 sm:p-8 border border-neutral-200 shadow-2xl relative"
            >
              <button onClick={() => setResellModalData(null)} className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </button>
              <h2 className="text-xl sm:text-2xl font-bold mb-6">Jual Kembali</h2>
              <form onSubmit={handleResellSubmit} className="flex flex-col gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-2">Harga Baru (Rp)</label>
                  <input name="price" type="number" required min={0} defaultValue={resellModalData.price} className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-black focus:outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-2">Kondisi Saat Ini</label>
                  <select name="condition" required defaultValue={resellModalData.condition} className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-black focus:outline-none transition-all appearance-none text-sm">
                    <option value="Seperti Baru">Seperti Baru</option>
                    <option value="Bagus">Bagus</option>
                    <option value="Layak Pakai">Layak Pakai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-2">Deskripsi Kondisi</label>
                  <textarea name="description" required rows={3} defaultValue={resellModalData.description} className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-black focus:outline-none transition-all resize-none text-sm" />
                </div>
                <button type="submit" className="w-full py-3.5 mt-2 bg-[#8B9A6E] text-white rounded-xl font-bold hover:bg-[#7a8a5d] transition-colors text-sm sm:text-base">Terbitkan Iklan</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm py-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] p-6 sm:p-8 border border-neutral-200 shadow-2xl relative hide-scrollbar"
            >
              <button onClick={() => setShowUploadModal(false)} className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </button>
              <h2 className="text-xl sm:text-2xl font-bold mb-6">Jual Buku Baru</h2>
              <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-2">Judul Buku</label>
                  <input name="title" required className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-black focus:outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-2">Penulis</label>
                  <input name="author" required className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-black focus:outline-none transition-all text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-2">Fakultas</label>
                    <select name="faculty" required className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-black focus:outline-none transition-all appearance-none text-sm">
                      <option value="Fasilkom">Fasilkom</option>
                      <option value="FEB">FEB</option>
                      <option value="Hukum">Hukum</option>
                      <option value="FISIP">FISIP</option>
                      <option value="FAD">FAD</option>
                      <option value="Faperta">Faperta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold mb-2">Kondisi</label>
                    <select name="condition" required className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-black focus:outline-none transition-all appearance-none text-sm">
                      <option value="Seperti Baru">Seperti Baru</option>
                      <option value="Bagus">Bagus</option>
                      <option value="Layak Pakai">Layak Pakai</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-2">Harga (Rp)</label>
                  <input name="price" type="number" required min={0} className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-black focus:outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-2">URL Gambar Sampul (Opsional)</label>
                  <input name="imageUrl" type="url" placeholder="https://..." className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-black focus:outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-2">Deskripsi Kondisi</label>
                  <textarea name="description" required rows={2} className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:border-black focus:outline-none transition-all resize-none text-sm" />
                </div>
                <button type="submit" className="w-full py-3.5 mt-2 bg-[#8B9A6E] text-white rounded-xl font-bold hover:bg-[#7a8a5d] transition-colors text-sm sm:text-base">Posting Iklan</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}