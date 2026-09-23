"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useBooks } from "@/context/BookContext";
import SafeImage from "@/components/SafeImage";
import { useRouter } from "next/navigation";
import { Search, MapPin, BookOpen, Repeat } from "lucide-react";
import { TiltCard } from "@/components/TiltCard";

const InteractiveText = ({ text, className = "", delayOffset = 0 }: { text: string, className?: string, delayOffset?: number }) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split("").map((char, j) => {
            const rot = (i + j) % 2 === 0 ? 4 : -4;
            return (
              <motion.span
                key={j}
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delayOffset + (i * 10 + j) * 0.02, duration: 0.5, ease: "easeOut" }}
                whileHover={{
                  y: -8,
                  scale: 1.15,
                  rotate: rot,
                  color: '#8B9A6E',
                  filter: 'drop-shadow(0 8px 16px rgba(139, 154, 110, 0.4))',
                  transition: { type: 'spring', stiffness: 450, damping: 12 }
                }}
                whileTap={{
                  scale: 0.9,
                  y: 2,
                  transition: { type: 'spring', stiffness: 600, damping: 15 }
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

export default function Home() {
  const { listedBooks, searchQuery, setSearchQuery, activeFaculty } = useBooks();
  const router = useRouter();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const filteredBooks = listedBooks.filter((book) => {
    const matchFaculty = activeFaculty === "Semua" || book.faculty === activeFaculty;
    const matchSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFaculty && matchSearch;
  });

  const priceFormat = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" });

  return (
    <main className="min-h-screen overflow-x-hidden">

      {/* Immersive Dark Hero */}
      <section
        className="relative min-h-[600px] pt-32 pb-32 flex items-center justify-center bg-black"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Spotlight Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.1), transparent 60%)`
          }}
        />

        <div className="absolute inset-0 z-0">
          <SafeImage
            src="https://media.quipper.com/media/W1siZiIsIjIwMjIvMTEvMjUvMDcvMjQvMzYvOWQ4NTdlYzgtNTFhMy00OTJkLWFlNGYtOWIyYzczNjYzZWViLyJdLFsicCIsInRodW1iIiwiMTIwMHhcdTAwM2UiXSxbInAiLCJjb252ZXJ0IiwiLWNvbG9yc3BhY2Ugc1JHQiAtc3RyaXAiLHsiZm9ybWF0IjoianBnIn1dXQ.jpg"
            alt="Library"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay and Gradient fade */}
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F2EB] to-transparent" />
        </div>

        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-semibold tracking-wide mb-8">
              <MapPin className="w-4 h-4" /> UPN Veteran Jawa Timur
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 font-serif leading-[1.1] cursor-default text-white">
              <InteractiveText text="Koleksi Akademik." />
              <br />
              <InteractiveText text="Diteruskan ke Generasi Berikutnya." className="text-white/80" delayOffset={0.5} />
            </h1>

            {/* Responsivitas Search Bar yang dirapikan */}
            <div className="relative w-full max-w-3xl mx-auto mt-12 mb-8 z-20">
              <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <input
                type="text"
                placeholder="Ketik judul buku, author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 md:pl-14 pr-24 md:pr-32 py-3 md:py-4 rounded-full bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#8B9A6E]/50 text-gray-800 placeholder-gray-500 transition-all text-ellipsis overflow-hidden"
              />
              <button
                onClick={() => {
                  const el = document.getElementById("katalog");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="absolute right-1.5 md:right-2 top-1.5 md:top-2 bottom-1.5 md:bottom-2 bg-[#8B9A6E] hover:bg-[#7a885f] text-white px-6 md:px-8 rounded-full font-medium transition-colors text-sm md:text-base"
              >
                Cari
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Box Vision Section */}
      <section className="py-24 bg-brand-surface relative z-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Buy. Read. Resell.</h2>
            <p className="text-brand-text/60 text-lg">Ekosistem sirkular untuk mahasiswa cerdas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TiltCard
              className="bg-white border border-neutral-200 shadow-sm h-full p-8 rounded-3xl flex flex-col justify-center [perspective:1000px] [transform-style:preserve-3d]"
            >
              <BookOpen className="w-10 h-10 text-neutral-400 mb-6 [transform:translateZ(30px)]" />
              <h3 className="text-xl font-bold mb-3 text-black [transform:translateZ(20px)]">Koleksi Terverifikasi</h3>
              <p className="text-neutral-500 leading-relaxed [transform:translateZ(10px)]">Semua buku difilter sesuai dengan kurikulum aktif UPN Veteran Jawa Timur.</p>
            </TiltCard>

            <TiltCard
              className="bg-[#8B9A6E] shadow-xl md:translate-y-8 h-full p-8 rounded-3xl flex flex-col justify-center [perspective:1000px] [transform-style:preserve-3d]"
            >
              <MapPin className="w-10 h-10 text-white/60 mb-6 [transform:translateZ(30px)]" />
              <h3 className="text-xl font-bold mb-3 text-white [transform:translateZ(20px)]">COD di Kampus</h3>
              <p className="text-white/80 leading-relaxed [transform:translateZ(10px)]">Transaksi aman. Temui penjual langsung di GKB, kantin, atau perpustakaan.</p>
            </TiltCard>

            <TiltCard
              className="bg-white border border-neutral-200 shadow-sm h-full p-8 rounded-3xl flex flex-col justify-center [perspective:1000px] [transform-style:preserve-3d]"
            >
              <Repeat className="w-10 h-10 text-neutral-400 mb-6 [transform:translateZ(30px)]" />
              <h3 className="text-xl font-bold mb-3 text-black [transform:translateZ(20px)]">Jual Kembali Cepat</h3>
              <p className="text-neutral-500 leading-relaxed [transform:translateZ(10px)]">Lulus mata kuliah? Jual kembali bukumu dalam 3 klik ke adik tingkat.</p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <section className="py-24 px-6 bg-brand-base border-t border-brand-secondary" id="katalog">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Eksplorasi Katalog</h2>
            </div>
            <p className="text-neutral-500 font-medium shrink-0 bg-neutral-100 px-4 py-2 rounded-full text-sm">
              Menampilkan {filteredBooks.length} buku {activeFaculty !== "Semua" ? `untuk ${activeFaculty}` : ""}
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book, idx) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group cursor-pointer flex flex-col"
                onClick={() => router.push(`/book/${book.id}`)}
              >
                <div className="relative aspect-[3/4] w-full bg-brand-secondary rounded-2xl overflow-hidden mb-5 flex items-center justify-center p-6">
                  <div className="relative w-full h-full shadow-lg rounded-sm overflow-hidden group-hover:scale-105 transition-transform duration-700 ease-out">
                    <SafeImage
                      src={book.imageUrl}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-brand-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-brand-base text-brand-text px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Lihat Detail
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-brand-text/80 transition-colors line-clamp-2">{book.title}</h3>
                <p className="text-brand-text/60 text-sm mb-4">{book.author}</p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-xl">{priceFormat.format(book.price)}</span>
                  <span className="px-2.5 py-1 bg-brand-secondary text-brand-text/80 rounded-md text-[11px] font-bold uppercase tracking-wider">
                    {book.condition}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="py-32 text-center bg-brand-surface rounded-3xl mt-8">
              <BookOpen className="w-12 h-12 text-brand-text/30 mx-auto mb-4" />
              <p className="text-xl text-brand-text/60 font-medium">Buku tidak ditemukan.</p>
              <p className="text-neutral-400 mt-2">Coba sesuaikan kata kunci atau filter fakultas.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}