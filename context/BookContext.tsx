"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Book, CartItem, Order, Payout } from "@/types";
import { dummyBooks } from "@/data/dummyBooks";

interface BookContextType {
  ownedBooks: Book[];
  listedBooks: Book[];
  pendingBooks: Book[];
  rejectedBooks: Book[];
  activeOrders: Order[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFaculty: string;
  setActiveFaculty: (faculty: string) => void;
  buyBook: (book: Book, paymentMethod: string, location: string) => void;
  addOrderFromCheckout: (items: CartItem[], paymentMethod: string, location: string) => void;
  resellBook: (id: number | string, newPrice: number, newDescription: string, newCondition: string) => void;
  uploadNewBook: (book: Omit<Book, "id">) => void;
  approveBook: (id: number | string) => void;
  rejectBook: (id: number | string) => void;
  submitBook: (book: Omit<Book, "id">) => void;
  payouts: Payout[];
  requestPayout: (orderId: string) => void;
  confirmPayout: (payoutId: string) => void;
  completeOrder: (orderId: string) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ownedBooks, setOwnedBooks] = useState<Book[]>([]);
  const [listedBooks, setListedBooks] = useState<Book[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [pendingBooks, setPendingBooks] = useState<Book[]>([]);
  const [rejectedBooks, setRejectedBooks] = useState<Book[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaculty, setActiveFaculty] = useState("Semua");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const storedOwned = localStorage.getItem("ownedBooks");
    const storedListed = localStorage.getItem("listedBooks");
    const storedOrders = localStorage.getItem("activeOrders");

    if (storedOwned) setOwnedBooks(JSON.parse(storedOwned));
    if (storedListed) {
      const parsedListed = JSON.parse(storedListed);
      
      // Update existing books with seller info if missing
      const updatedListed = parsedListed.map((storedBook: Book) => {
        const dummyBook = dummyBooks.find(b => b.id === storedBook.id);
        if (dummyBook && !storedBook.seller && dummyBook.seller) {
          return { ...storedBook, seller: dummyBook.seller };
        }
        return storedBook;
      });

      if (updatedListed.length < dummyBooks.length) {
        // Merge missing books from dummyBooks based on id
        const existingIds = new Set(updatedListed.map((b: Book) => b.id));
        const missingBooks = dummyBooks.filter(b => !existingIds.has(b.id));
        setListedBooks([...updatedListed, ...missingBooks]);
      } else {
        setListedBooks(updatedListed);
      }
    } else {
      setListedBooks(dummyBooks);
    }
    if (storedOrders) setActiveOrders(JSON.parse(storedOrders));
    const storedRejected = localStorage.getItem("rejectedBooks");
    if (storedRejected) setRejectedBooks(JSON.parse(storedRejected));
    const storedPayouts = localStorage.getItem("payouts");
    if (storedPayouts) setPayouts(JSON.parse(storedPayouts));

    // Mock: listing yang butuh verifikasi admin.
    const storedPending = localStorage.getItem("pendingBooks");
    if (storedPending) {
      setPendingBooks(JSON.parse(storedPending));
    } else {
      setPendingBooks([
        {
          id: `pend-${Date.now()}-1`,
          title: "Struktur Data & Algoritma",
          author: "Michael T. Goodrich",
          faculty: "Fasilkom",
          price: 98000,
          condition: "Bagus",
          imageUrl: "https://covers.openlibrary.org/b/isbn/9781118386964-L.jpg",
          description: "Mulus, sedikit coretan pensil di bab 3.",
          seller: { name: "Rangga", prodi: "Teknik Informatika", angkatan: "2023", wa: "6281234567890" },
        },
        {
          id: `pend-${Date.now()}-2`,
          title: "Manajemen Pemasaran Jasa",
          author: "Christopher Lovelock",
          faculty: "FEB",
          price: 87000,
          condition: "Seperti Baru",
          imageUrl: "https://covers.openlibrary.org/b/isbn/9780136127155-L.jpg",
          description: "Belum pernah dibuka sepenuhnya.",
          seller: { name: "Wulan", prodi: "Manajemen", angkatan: "2024", wa: "6281234567891" },
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("ownedBooks", JSON.stringify(ownedBooks));
      localStorage.setItem("listedBooks", JSON.stringify(listedBooks));
      localStorage.setItem("activeOrders", JSON.stringify(activeOrders));
      localStorage.setItem("pendingBooks", JSON.stringify(pendingBooks));
      localStorage.setItem("rejectedBooks", JSON.stringify(rejectedBooks));
      localStorage.setItem("payouts", JSON.stringify(payouts));
    }
  }, [ownedBooks, listedBooks, activeOrders, pendingBooks, rejectedBooks, payouts, isMounted]);

  // Seller minta pencairan dana dari order yang berstatus Selesai.
  const requestPayout = (orderId: string) => {
    const order = activeOrders.find((o) => o.id === orderId);
    if (!order) return;

    // Hindari request ganda untuk order yang sama.
    if (payouts.some((p) => p.orderId === orderId)) return;

    const PLATFORM_FEE = 0.1;
    const feeAmount = Math.round(order.book.price * PLATFORM_FEE);

    const newPayout: Payout = {
      id: `PO-${Date.now()}`,
      orderId,
      bookTitle: order.book.title,
      sellerName: order.book.seller?.name || "Adimas Satria",
      netAmount: order.book.price - feeAmount,
      feeAmount,
      status: "Request Pencairan",
      requestedAt: Date.now(),
    };
    setPayouts((prev) => [newPayout, ...prev]);
  };

  // Admin konfirmasi bahwa transfer manual sudah dilakukan.
  const confirmPayout = (payoutId: string) => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId ? { ...p, status: "Selesai Dicairkan", completedAt: Date.now() } : p
      )
    );
  };

  // Pembeli menandai pesanan selesai — dana masuk ke Saldo Bisa Ditarik seller.
  const completeOrder = (orderId: string) => {
    setActiveOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Selesai" } : o))
    );
  };

  const approveBook = (id: number | string) => {
    const book = pendingBooks.find((b) => b.id === id);
    if (!book) return;
    setPendingBooks((prev) => prev.filter((b) => b.id !== id));
    setListedBooks((prev) => [book, ...prev]);
  };

  const rejectBook = (id: number | string) => {
    setPendingBooks((prev) => {
      const book = prev.find((b) => b.id === id);
      if (book) setRejectedBooks((r) => [book, ...r]);
      return prev.filter((b) => b.id !== id);
    });
  };

  const submitBook = (book: Omit<Book, "id">) => {
    const newBook: Book = {
      ...book,
      id: `pend-${Date.now()}`,
    };
    setPendingBooks((prev) => [newBook, ...prev]);
  };

  const buyBook = (book: Book, paymentMethod: string, location: string) => {
    setListedBooks((prev) => prev.filter((b) => b.id !== book.id));
    setOwnedBooks((prev) => [...prev, {
      ...book,
      seller: { name: "Adimas Satria", prodi: "Teknik Informatika", angkatan: "2024", wa: "628000000000" }
    }]);

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      book,
      paymentMethod,
      location,
      status: "Diproses",
      date: new Date().toISOString()
    };
    setActiveOrders((prev) => [newOrder, ...prev]);
  };

  const addOrderFromCheckout = (items: CartItem[], paymentMethod: string, location: string) => {
    const boughtIds = new Set(items.map((i) => i.id));

    // Move purchased listings out of the catalog into the buyer's collection.
    setListedBooks((prev) => prev.filter((b) => !boughtIds.has(String(b.id))));

    const booksFromItems: Book[] = items.map((item) => ({
      id: item.id,
      title: item.title,
      author: item.author,
      faculty: "-",
      price: item.price,
      condition: item.condition,
      imageUrl: item.coverImage,
      description: "",
      seller: item.seller,
    }));

    setOwnedBooks((prev) => [...prev, ...booksFromItems]);

    const timestamp = Date.now();
    const newOrders: Order[] = booksFromItems.map((book) => ({
      id: `ORD-${timestamp}-${book.id}`,
      book,
      paymentMethod,
      location,
      status: "Menunggu Verifikasi",
      date: new Date(timestamp).toISOString(),
      timestamp,
    }));
    setActiveOrders((prev) => [...newOrders, ...prev]);
  };

  const resellBook = (id: number | string, newPrice: number, newDescription: string, newCondition: string) => {
    const bookToSell = ownedBooks.find((b) => b.id === id);
    if (!bookToSell) return;

    const updatedBook = {
      ...bookToSell,
      price: newPrice,
      description: newDescription,
      condition: newCondition,
    };

    setOwnedBooks((prev) => prev.filter((b) => b.id !== id));
    setListedBooks((prev) => [updatedBook, ...prev]);
  };

  const uploadNewBook = (book: Omit<Book, "id">) => {
    const newBook: Book = {
      ...book,
      id: Date.now(),
      seller: { name: "Adimas Satria", prodi: "Teknik Informatika", angkatan: "2024", wa: "628000000000" }
    };
    setListedBooks((prev) => [newBook, ...prev]);
  };

  const contextValue = {
    ownedBooks: isMounted ? ownedBooks : [],
    listedBooks: isMounted ? listedBooks : [],
    pendingBooks: isMounted ? pendingBooks : [],
    rejectedBooks: isMounted ? rejectedBooks : [],
    activeOrders: isMounted ? activeOrders : [],
    payouts: isMounted ? payouts : [],
    searchQuery,
    setSearchQuery,
    activeFaculty,
    setActiveFaculty,
    buyBook,
    addOrderFromCheckout,
    resellBook,
    uploadNewBook,
    approveBook,
    rejectBook,
    submitBook,
    requestPayout,
    confirmPayout,
    completeOrder,
  };

  return (
    <BookContext.Provider value={contextValue}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
};
