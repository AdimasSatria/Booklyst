export interface Book {
  id: number | string;
  title: string;
  author: string;
  faculty: string;
  price: number;
  condition: string;
  imageUrl: string;
  ownerName?: string;
  seller?: {
    name: string;
    prodi: string;
    angkatan: string;
    wa: string;
  };
  description: string;
  semester?: string;
}

export interface Order {
  id: string;
  book: Book;
  paymentMethod: string;
  location: string;
  status: "Diproses" | "Menunggu Diambil" | "Selesai";
  date: string;
}
