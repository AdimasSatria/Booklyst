"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Book, Order } from "@/types";
import { dummyBooks } from "@/data/dummyBooks";

interface BookContextType {
  ownedBooks: Book[];
  listedBooks: Book[];
  activeOrders: Order[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFaculty: string;
  setActiveFaculty: (faculty: string) => void;
  buyBook: (book: Book, paymentMethod: string, location: string) => void;
  resellBook: (id: number | string, newPrice: number, newDescription: string, newCondition: string) => void;
  uploadNewBook: (book: Omit<Book, "id">) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ownedBooks, setOwnedBooks] = useState<Book[]>([]);
  const [listedBooks, setListedBooks] = useState<Book[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
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
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("ownedBooks", JSON.stringify(ownedBooks));
      localStorage.setItem("listedBooks", JSON.stringify(listedBooks));
      localStorage.setItem("activeOrders", JSON.stringify(activeOrders));
    }
  }, [ownedBooks, listedBooks, activeOrders, isMounted]);

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
    activeOrders: isMounted ? activeOrders : [],
    searchQuery,
    setSearchQuery,
    activeFaculty,
    setActiveFaculty,
    buyBook,
    resellBook,
    uploadNewBook,
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
