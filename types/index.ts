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

export type Condition = "Baru" | "Bekas" | "Seperti Baru" | "Bagus" | "Layak Pakai";

export interface CartItem {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: Condition;
  coverImage: string;
  quantity: number;
  sellerCampusLocation?: string;
  seller?: Book["seller"];
}

export interface Order {
  id: string;
  book: Book;
  paymentMethod: string;
  location: string;
  status: "Diproses" | "Menunggu Verifikasi" | "Menunggu Diambil" | "Selesai";
  date: string;
  timestamp?: number;
}

export type PayoutStatus = "Request Pencairan" | "Selesai Dicairkan";

export interface Payout {
  id: string;
  orderId: string;
  bookTitle: string;
  sellerName: string;
  netAmount: number;
  feeAmount: number;
  status: PayoutStatus;
  requestedAt: number;
  completedAt?: number;
}
