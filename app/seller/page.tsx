"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { useBooks } from "@/context/BookContext";
import { formatPrice } from "@/lib/utils";
import SafeImage from "@/components/SafeImage";
import {
  Store,
  Plus,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  ImagePlus,
  Wallet,
  TrendingUp,
} from "lucide-react";

const COD_LOCATIONS = [
  "Perpustakaan Pusat",
  "Gedung FIK",
  "GKB 2, Lantai 1",
  "Kantin FEB",
  "Gedung FISIP",
];

const CONDITIONS = [
  { id: "Baru", label: "Baru" },
  { id: "Bekas", label: "Bekas" },
];

const PLATFORM_FEE = 0.1;

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { listedBooks, pendingBooks, rejectedBooks, activeOrders, payouts, submitBook, requestPayout } = useBooks();

  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "pending" | "rejected">("active");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("Baru");
  const [codLocation, setCodLocation] = useState(COD_LOCATIONS[0]);
  const [consent, setConsent] = useState(false);
  const [coverImage, setCoverImage] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthChecked(true);
  }, []);

  // Route guard: any logged-in user can be a seller.
  useEffect(() => {
    if (authChecked && !isLoggedIn) {
      router.replace("/login");
    }
  }, [authChecked, isLoggedIn, router]);

  if (!authChecked || !isLoggedIn) return null;

  const numericPrice = Number(price) || 0;
  const feeAmount = numericPrice * PLATFORM_FEE;
  const netRevenue = numericPrice - feeAmount;

  // Buku milik seller yang login.
  const sellerIdentifier = user?.name || "Adimas Satria";
  const isSellerBook = (b: { seller?: { name?: string }; ownerName?: string }) =>
    b.seller?.name === sellerIdentifier || b.ownerName === sellerIdentifier;

  const myActive = listedBooks.filter(isSellerBook);
  const myPending = pendingBooks.filter(isSellerBook);
  const myRejected = rejectedBooks.filter(isSellerBook);

  // Escrow: pesanan "Selesai" yang belum diminta pencairan masuk ke Saldo Bisa Ditarik.
  const myPayouts = payouts.filter((p) => p.sellerName === sellerIdentifier);
  const orderIdsWithPayout = new Set(myPayouts.map((p) => p.orderId));
  const completedOrders = activeOrders.filter(
    (o) => o.status === "Selesai" && o.book.seller?.name === sellerIdentifier
  );
  const availableOrders = completedOrders.filter((o) => !orderIdsWithPayout.has(o.id));
  const withdrawableBalance = availableOrders.reduce(
    (sum, o) => sum + o.book.price * (1 - PLATFORM_FEE),
    0
  );

  const hasRequestedWithdrawal = availableOrders.length === 0 && completedOrders.length > 0;

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setPrice("");
    setCondition("Baru");
    setCodLocation(COD_LOCATIONS[0]);
    setConsent(false);
    setCoverImage("");
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleWithdraw = () => {
    if (isWithdrawing || availableOrders.length === 0) return;

    setIsWithdrawing(true);
    setTimeout(() => {
      availableOrders.forEach((o) => requestPayout(o.id));
      setIsWithdrawing(false);
      showToast("Permintaan pencairan dikirim ke Admin. Maks 24 jam.");
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Mock: pakai object URL sebagai preview, bukan upload nyata.
    setCoverImage(URL.createObjectURL(file));
  };

  const isFormValid =
    title.trim() !== "" && author.trim() !== "" && numericPrice > 0 && consent;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitBook({
        title: title.trim(),
        author: author.trim(),
        faculty: "Fasilkom",
        price: numericPrice,
        condition,
        imageUrl: coverImage || "https://placehold.co/400x600/8B9A6E/FFFFFF/png?text=Book",
        description: `Lokasi COD: ${codLocation}`,
        seller: {
          name: sellerIdentifier,
          prodi: "Teknik Informatika",
          angkatan: "2024",
          wa: "628000000000",
        },
      });

      setIsSubmitting(false);
      resetForm();
      setShowForm(false);
      setActiveTab("pending");
    }, 1000);
  };

  const tabs = [
    { id: "active" as const, label: "Aktif", count: myActive.length, icon: CheckCircle },
    { id: "pending" as const, label: "Menunggu Verifikasi", count: myPending.length, icon: Clock },
    { id: "rejected" as const, label: "Ditolak", count: myRejected.length, icon: XCircle },
  ];

  const currentBooks =
    activeTab === "active" ? myActive : activeTab === "pending" ? myPending : myRejected;

  return (
    <main className="min-h-screen bg-zinc-50 pt-24 px-4 sm:px-6 pb-24">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8B9A6E]/15 text-[#6b7a52] rounded-full text-[10px] font-bold tracking-wider mb-3 uppercase">
              <Store className="w-3.5 h-3.5" />
              Seller
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Toko Saya</h1>
            <p className="text-neutral-500 font-medium text-sm mt-1">
              Kelola listing buku kamu, {sellerIdentifier}.
            </p>
          </div>

          {/* Add New Book CTA */}
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#8B9A6E] text-white rounded-full font-bold shadow-lg shadow-[#8B9A6E]/20 hover:bg-[#7a8a5d] transition-all active:scale-95 text-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Tambah Buku Baru
          </button>
        </header>

        {/* Financial Widget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#8B9A6E]/15 flex items-center justify-center shrink-0">
                <Wallet className="w-6 h-6 text-[#6b7a52]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  Saldo Bisa Ditarik
                </p>
                <p className="text-2xl font-bold tracking-tight">{formatPrice(withdrawableBalance)}</p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Dari {availableOrders.length} pesanan selesai
                </p>
              </div>
            </div>

            {hasRequestedWithdrawal ? (
              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap">
                <Clock className="w-3.5 h-3.5" />
                Sedang Diproses (Maks 24 Jam)
              </span>
            ) : (
              <button
                onClick={handleWithdraw}
                disabled={withdrawableBalance === 0 || isWithdrawing}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#8B9A6E] text-white rounded-full font-bold text-sm shadow-lg shadow-[#8B9A6E]/20 hover:bg-[#7a8a5d] transition-all disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none disabled:cursor-not-allowed active:scale-95 shrink-0"
              >
                {isWithdrawing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Cairkan Uang
                  </>
                )}
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-neutral-700" />
              </div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Riwayat Pencairan
              </p>
            </div>
            {myPayouts.length === 0 ? (
              <p className="text-sm text-neutral-400">Belum ada permintaan pencairan.</p>
            ) : (
              <div className="space-y-3">
                {myPayouts.slice(0, 3).map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold line-clamp-1">{payout.bookTitle}</p>
                      <p className="text-[10px] text-neutral-400">{formatPrice(payout.netAmount)}</p>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${payout.status === "Selesai Dicairkan"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                        }`}
                    >
                      {payout.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white p-1.5 rounded-full mb-8 border border-neutral-100 shadow-sm w-full max-w-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 relative z-10 py-2.5 text-xs sm:text-sm font-bold rounded-full transition-colors"
            >
              <span className={activeTab === tab.id ? "text-white" : "text-neutral-500 hover:text-neutral-800"}>
                {tab.label}
                <span className="ml-1.5 text-[10px] opacity-75">({tab.count})</span>
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeSellerTab"
                  className="absolute inset-0 bg-[#8B9A6E] rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Book Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentBooks.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-neutral-100 shadow-sm">
                <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-6 h-6 text-neutral-400" />
                </div>
                <p className="font-bold text-lg mb-1">
                  {activeTab === "active"
                    ? "Belum ada buku aktif"
                    : activeTab === "pending"
                      ? "Tidak ada buku menunggu verifikasi"
                      : "Tidak ada buku yang ditolak"}
                </p>
                <p className="text-sm text-neutral-500">
                  {activeTab === "active"
                    ? "Mulai jual buku pertamamu sekarang."
                    : activeTab === "pending"
                      ? "Listing kamu akan muncul di sini setelah diajukan."
                      : "Listing yang ditolak admin akan tampil di sini."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm flex flex-col"
                  >
                    <div className="relative w-full aspect-[3/4] bg-neutral-100">
                      <SafeImage src={book.imageUrl} alt={book.title} fill className="object-cover" />
                      {activeTab === "pending" && (
                        <span className="absolute top-3 left-3 bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Review
                        </span>
                      )}
                      {activeTab === "rejected" && (
                        <span className="absolute top-3 left-3 bg-red-100 text-red-600 text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Ditolak
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-1">{book.title}</h3>
                      <p className="text-xs text-neutral-500 line-clamp-1 mb-3">{book.author}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-bold text-sm">{formatPrice(book.price)}</span>
                        <span className="text-[10px] font-bold bg-neutral-100 px-2 py-1 rounded uppercase tracking-wider">
                          {book.condition}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Upload Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm py-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] p-6 sm:p-8 border border-neutral-100 shadow-2xl relative"
            >
              <button
                onClick={() => !isSubmitting && setShowForm(false)}
                disabled={isSubmitting}
                className="absolute top-6 right-6 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-xl sm:text-2xl font-bold mb-6">Tambah Buku Baru</h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Judul */}
                <div>
                  <label className="block text-xs font-bold mb-2">Judul Buku</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Contoh: Clean Code"
                    className="w-full px-4 py-3 bg-neutral-50 rounded-2xl border border-neutral-200 focus:border-[#8B9A6E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B9A6E]/15 transition-all text-sm"
                  />
                </div>

                {/* Pengarang */}
                <div>
                  <label className="block text-xs font-bold mb-2">Pengarang</label>
                  <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    placeholder="Contoh: Robert C. Martin"
                    className="w-full px-4 py-3 bg-neutral-50 rounded-2xl border border-neutral-200 focus:border-[#8B9A6E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B9A6E]/15 transition-all text-sm"
                  />
                </div>

                {/* Harga + perhitungan finansial */}
                <div>
                  <label className="block text-xs font-bold mb-2">Harga (Rp)</label>
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="Contoh: 85000"
                    className="w-full px-4 py-3 bg-neutral-50 rounded-2xl border border-neutral-200 focus:border-[#8B9A6E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B9A6E]/15 transition-all text-sm"
                  />
                  <AnimatePresence>
                    {numericPrice > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 overflow-hidden"
                      >
                        <p className="text-xs text-neutral-500 flex items-center justify-between">
                          <span>Potongan Platform (10%)</span>
                          <span className="font-bold text-red-500">-{formatPrice(feeAmount)}</span>
                        </p>
                        <p className="text-xs flex items-center justify-between mt-1.5 pt-1.5 border-t border-neutral-100">
                          <span className="font-bold text-neutral-700">Estimasi Pendapatan Bersih</span>
                          <span className="font-bold text-[#6b7a52]">{formatPrice(netRevenue)}</span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Kondisi (Radio) */}
                <div>
                  <label className="block text-xs font-bold mb-2">Kondisi</label>
                  <div className="flex gap-3">
                    {CONDITIONS.map((c) => (
                      <label
                        key={c.id}
                        className={`flex-1 flex items-center justify-center py-3 rounded-2xl border-2 cursor-pointer font-bold text-sm transition-all ${condition === c.id
                          ? "border-[#8B9A6E] bg-[#8B9A6E]/5 text-neutral-900"
                          : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                          }`}
                      >
                        <input
                          type="radio"
                          name="condition"
                          value={c.id}
                          checked={condition === c.id}
                          onChange={(e) => setCondition(e.target.value)}
                          className="sr-only"
                        />
                        {c.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Lokasi COD */}
                <div>
                  <label className="block text-xs font-bold mb-2">Lokasi COD</label>
                  <select
                    value={codLocation}
                    onChange={(e) => setCodLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 rounded-2xl border border-neutral-200 focus:border-[#8B9A6E] focus:outline-none focus:ring-2 focus:ring-[#8B9A6E]/15 transition-all appearance-none text-sm"
                  >
                    {COD_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mock Dropzone */}
                <div>
                  <label className="block text-xs font-bold mb-2">Gambar Sampul</label>
                  <label className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-neutral-200 rounded-2xl cursor-pointer hover:border-[#8B9A6E] hover:bg-[#8B9A6E]/5 transition-all">
                    {coverImage ? (
                      <div className="relative w-20 h-24 rounded-lg overflow-hidden">
                        <SafeImage src={coverImage} alt="Preview sampul" fill className="object-cover" />
                      </div>
                    ) : (
                      <>
                        <ImagePlus className="w-7 h-7 text-neutral-400" />
                        <span className="text-xs font-medium text-neutral-500">
                          Klik untuk unggah foto sampul
                        </span>
                        <span className="text-[10px] text-neutral-400">PNG/JPG, maks 5MB (mock)</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Consent Checkbox */}
                <label className="flex items-start gap-3 p-4 bg-neutral-50 rounded-2xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#8B9A6E] focus:ring-[#8B9A6E] rounded shrink-0"
                  />
                  <span className="text-xs text-neutral-700 leading-relaxed">
                    Saya setuju dengan potongan platform 10% dan Syarat Ketentuan.
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full py-4 mt-1 bg-[#8B9A6E] text-white font-bold rounded-full hover:bg-[#7a8a5d] transition-all shadow-lg shadow-[#8B9A6E]/20 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Ajukan Listing
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
