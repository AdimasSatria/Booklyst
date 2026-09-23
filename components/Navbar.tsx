"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Search, User, ChevronRight, Menu, X } from "lucide-react";
import { useBooks } from "@/context/BookContext";
import SafeImage from "@/components/SafeImage";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { listedBooks, searchQuery, setSearchQuery, activeFaculty, setActiveFaculty } = useBooks();

  const [isMounted, setIsMounted] = useState(false);
  const [hoveredFaculty, setHoveredFaculty] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const faculties = ["Semua", "Fasilkom", "FEB", "Hukum", "FISIP", "FAD", "Faperta"];

  const featuredBooks = hoveredFaculty && hoveredFaculty !== "Semua"
    ? listedBooks.filter(b => b.faculty === hoveredFaculty).slice(0, 4)
    : [];

  const handleFacultyClick = (fac: string) => {
    setActiveFaculty(fac);
    setHoveredFaculty(null);
    if (pathname !== "/") {
      router.push("/#katalog");
    } else {
      const el = document.getElementById("katalog");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isMounted) return null;

  return (
    <div className="sticky top-0 z-50 w-full" onMouseLeave={() => setHoveredFaculty(null)}>
      {/* Primary Navigation Bar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">

          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <BookOpen className="w-6 h-6 text-black" />
            <span className="text-xl font-bold tracking-tight text-black">
              Booklyst
            </span>
          </Link>

          {/* Center: Faculty Mega Menu Triggers (Desktop Only) */}
          <nav className="hidden md:flex items-center justify-center gap-8 flex-1">
            {faculties.map((fac) => (
              <button
                key={fac}
                onMouseEnter={() => setHoveredFaculty(fac)}
                onClick={() => handleFacultyClick(fac)}
                className={`text-sm font-bold uppercase tracking-wider py-8 border-b-2 transition-colors ${activeFaculty === fac || hoveredFaculty === fac
                  ? "border-black text-black"
                  : "border-transparent text-neutral-500 hover:text-black"
                  }`}
              >
                {fac}
              </button>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">

            {/* Search Toggle (Desktop Only - Sembunyikan di Mobile agar tidak overflow) */}
            <div className="relative hidden md:flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ maxWidth: 0, opacity: 0 }}
                    animate={{ maxWidth: 300, opacity: 1 }}
                    exit={{ maxWidth: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden mr-2"
                  >
                    <input
                      type="text"
                      placeholder="Cari buku..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[200px] lg:w-[250px] pl-4 pr-4 py-2 bg-neutral-100 rounded-full border-none focus:ring-2 focus:ring-black transition-all text-sm outline-none"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors text-black shrink-0"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Profile (Desktop Only) */}
            <Link
              href="/profile"
              className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 hidden md:flex items-center justify-center hover:bg-neutral-200 transition-colors text-black shrink-0"
              title="Profil & Dashboard"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Toggle (Mobile Only) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-10 h-10 rounded-full flex md:hidden items-center justify-center hover:bg-neutral-100 text-black transition-colors shrink-0"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Pop-down Mega Menu Panel (Desktop) */}
      <AnimatePresence>
        {hoveredFaculty && hoveredFaculty !== "Semua" && featuredBooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full bg-white/95 backdrop-blur-xl border-b border-neutral-200 shadow-2xl overflow-hidden z-40 hidden md:block"
          >
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold font-serif mb-1">Unggulan dari {hoveredFaculty}</h3>
                  <p className="text-neutral-500">Pilihan buku terbaik semester ini.</p>
                </div>
                <button
                  onClick={() => handleFacultyClick(hoveredFaculty)}
                  className="flex items-center gap-2 text-sm font-bold text-black hover:text-neutral-600 transition-colors"
                >
                  Lihat Katalog Penuh <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {featuredBooks.map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => router.push(`/book/${book.id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] w-full bg-neutral-100 rounded-2xl overflow-hidden flex items-center justify-center p-4 mb-4">
                      <div className="absolute top-3 left-3 bg-[#8B9A6E] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest z-10">
                        Baru
                      </div>
                      <div className="relative w-full h-full shadow-lg rounded-sm overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <SafeImage src={book.imageUrl} alt={book.title} fill className="object-cover" />
                      </div>
                    </div>
                    <h4 className="font-bold text-base leading-tight mb-1 group-hover:text-neutral-600 transition-colors line-clamp-1">{book.title}</h4>
                    <p className="text-neutral-500 text-xs">{book.author}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[70] md:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-neutral-100 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">Menu</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full -mr-2 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Search Bar khusus Mobile di pindah ke sini */}
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Cari judul, author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setIsMobileMenuOpen(false);
                        if (pathname !== "/") router.push("/#katalog");
                        else document.getElementById("katalog")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="w-full pl-11 pr-4 py-3 bg-neutral-100 rounded-full border-none focus:ring-2 focus:ring-black transition-all text-sm outline-none"
                  />
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-2">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Fakultas</p>
                {faculties.map((fac) => (
                  <button
                    key={fac}
                    onClick={() => {
                      handleFacultyClick(fac);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left px-4 py-3 rounded-xl font-bold transition-colors ${activeFaculty === fac ? "bg-black text-white" : "hover:bg-neutral-100 text-neutral-600"
                      }`}
                  >
                    {fac}
                  </button>
                ))}
              </div>
              <div className="p-6 border-t border-neutral-100 flex flex-col gap-2">
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-100 font-bold text-neutral-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  Profil & Dashboard
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}