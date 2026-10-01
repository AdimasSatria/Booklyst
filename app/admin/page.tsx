"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { useBooks } from "@/context/BookContext";
import { formatPrice } from "@/lib/utils";
import SafeImage from "@/components/SafeImage";
import { BookCheck, Clock, Wallet, Check, CheckCircle, X, ShieldCheck } from "lucide-react";

const ADMIN_EMAIL = "25081010266@student.upnjatim.ac.id";
const PLATFORM_FEE = 0.1;

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { listedBooks, pendingBooks, payouts, approveBook, rejectBook, confirmPayout } = useBooks();

  const [authChecked, setAuthChecked] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthChecked(true);
  }, []);

  // Route guard: must be logged in AND the specific admin email.
  const isAuthorized = authChecked && isLoggedIn && user?.email?.toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    if (authChecked && !isAuthorized) {
      router.replace("/");
    }
  }, [authChecked, isAuthorized, router]);

  if (!authChecked || !isAuthorized) return null;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleConfirmTransfer = (payoutId: string, bookTitle: string) => {
    confirmPayout(payoutId);
    showToast(`Transfer untuk "${bookTitle}" berhasil dikonfirmasi.`);
  };

  const pendingPayouts = payouts.filter((p) => p.status === "Request Pencairan");

  const stats = [
    { label: "Total Buku Aktif", value: listedBooks.length, icon: BookCheck },
    { label: "Menunggu Verifikasi", value: pendingBooks.length, icon: Clock },
    { label: "Pendapatan Platform", value: formatPrice(payouts.reduce((s, p) => s + p.feeAmount, 0)), icon: Wallet },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 pt-24 px-4 sm:px-6 pb-24">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8B9A6E]/15 text-[#6b7a52] rounded-full text-[10px] font-bold tracking-wider mb-3 uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard Admin</h1>
            <p className="text-neutral-500 font-medium text-sm mt-1">Verifikasi listing buku & pantau platform.</p>
          </div>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-5">
                <stat.icon className="w-5 h-5 text-neutral-700" />
              </div>
              <h3 className="text-3xl font-bold mb-1.5 tracking-tight">{stat.value}</h3>
              <p className="text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Verification Table */}
        <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Menunggu Verifikasi</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Platform memotong 10% dari setiap transaksi yang disetujui.
              </p>
            </div>
            <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-3 py-1.5 rounded-full">
              {pendingBooks.length} antrian
            </span>
          </div>

          {pendingBooks.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-neutral-400" />
              </div>
              <p className="font-bold text-lg mb-1">Semua sudah diverifikasi</p>
              <p className="text-sm text-neutral-500">Tidak ada listing yang menunggu persetujuan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50/80 border-b border-neutral-100">
                    <th className="px-6 py-3.5 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Info Buku
                    </th>
                    <th className="px-6 py-3.5 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Penjual
                    </th>
                    <th className="px-6 py-3.5 text-right text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Harga Asli
                    </th>
                    <th className="px-6 py-3.5 text-right text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Potongan Platform (10%)
                    </th>
                    <th className="px-6 py-3.5 text-center text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {pendingBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-neutral-50/50 transition-colors">
                      {/* Info Buku */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-14 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                            <SafeImage
                              src={book.imageUrl}
                              alt={book.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm leading-tight line-clamp-1">{book.title}</p>
                            <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{book.author}</p>
                            <span className="inline-block mt-1 bg-neutral-100 text-neutral-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                              {book.condition}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Penjual */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-sm line-clamp-1">{book.seller?.name || "-"}</p>
                          <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                            {book.seller?.prodi} • {book.seller?.angkatan}
                          </p>
                        </div>
                      </td>

                      {/* Harga Asli */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-sm">{formatPrice(book.price)}</span>
                      </td>

                      {/* Potongan Platform */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-sm text-[#6b7a52]">
                          {formatPrice(book.price * PLATFORM_FEE)}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => approveBook(book.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Setujui
                          </button>
                          <button
                            onClick={() => rejectBook(book.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-red-600 text-xs font-bold border border-red-200 hover:bg-red-50 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Manajemen Transaksi (Payout Queue) */}
        <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden mt-10">
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Manajemen Transaksi</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Konfirmasi pencairan setelah transfer manual selesai (SLA 24 jam).
              </p>
            </div>
            <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-3 py-1.5 rounded-full">
              {pendingPayouts.length} menunggu
            </span>
          </div>

          {payouts.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-6 h-6 text-neutral-400" />
              </div>
              <p className="font-bold text-lg mb-1">Belum ada transaksi pencairan</p>
              <p className="text-sm text-neutral-500">Permintaan withdraw seller akan muncul di sini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50/80 border-b border-neutral-100">
                    <th className="px-6 py-3.5 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Buku
                    </th>
                    <th className="px-6 py-3.5 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-6 py-3.5 text-right text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Pendapatan Bersih
                    </th>
                    <th className="px-6 py-3.5 text-center text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-center text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {payouts.map((payout) => {
                    const isPending = payout.status === "Request Pencairan";
                    return (
                      <tr
                        key={payout.id}
                        className={`transition-colors ${isPending ? "bg-amber-50/40 hover:bg-amber-50/70" : "hover:bg-neutral-50/50"}`}
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-sm leading-tight line-clamp-1">{payout.bookTitle}</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            {new Date(payout.requestedAt).toLocaleDateString("id-ID")}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-sm line-clamp-1">{payout.sellerName}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-sm">{formatPrice(payout.netAmount)}</span>
                          <p className="text-[10px] text-neutral-400">+fee {formatPrice(payout.feeAmount)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-[10px] whitespace-nowrap ${isPending
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                                }`}
                            >
                              {isPending ? <Clock className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                              {payout.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            {isPending ? (
                              <button
                                onClick={() => handleConfirmTransfer(payout.id, payout.bookTitle)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Konfirmasi Transfer
                              </button>
                            ) : (
                              <span className="text-[10px] text-neutral-400">
                                {new Date(payout.completedAt || payout.requestedAt).toLocaleDateString("id-ID")}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 bg-neutral-900 text-white px-5 py-4 rounded-2xl shadow-2xl max-w-[90vw]"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-sm font-medium">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
