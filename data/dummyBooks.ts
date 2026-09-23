import { Book } from "@/types";

export const dummyBooks: Book[] = [
  {
    id: 1, title: "Clean Code", author: "Robert C. Martin", faculty: "Fasilkom", price: 85000, condition: "Bagus", imageUrl: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg", description: "Mulus 90%, cuma stabilo tipis.",
    seller: { name: "Bima", prodi: "Teknik Informatika", angkatan: "2023", wa: "6281234567890" }
  },
  {
    id: 2, title: "Database System Concepts", author: "Abraham Silberschatz", faculty: "Fasilkom", price: 110000, condition: "Layak Pakai", imageUrl: "https://covers.openlibrary.org/b/isbn/9780073523323-L.jpg", description: "Buku dewa Basis Data.",
    seller: { name: "Rian", prodi: "Sistem Informasi", angkatan: "2022", wa: "6281234567891" }
  },
  {
    id: 3, title: "Introduction to Algorithms", author: "Thomas H. Cormen", faculty: "Fasilkom", price: 150000, condition: "Seperti Baru", imageUrl: "https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg", description: "Jual rugi aja.",
    seller: { name: "Dinda", prodi: "Teknik Informatika", angkatan: "2024", wa: "6281234567892" }
  },
  {
    id: 4, title: "Principles of Marketing", author: "Philip Kotler", faculty: "FEB", price: 95000, condition: "Bagus", imageUrl: "https://covers.openlibrary.org/b/isbn/9780134492513-L.jpg", description: "Buku wajib Manajemen FEB.",
    seller: { name: "Sania", prodi: "Manajemen", angkatan: "2024", wa: "6281234567893" }
  },
  {
    id: 5, title: "Financial Accounting", author: "Jerry J. Weygandt", faculty: "FEB", price: 120000, condition: "Bagus", imageUrl: "https://covers.openlibrary.org/b/isbn/9781118334325-L.jpg", description: "Full daging buat akuntansi dasar.",
    seller: { name: "Tomi", prodi: "Akuntansi", angkatan: "2023", wa: "6281234567894" }
  },
  {
    id: 6, title: "Macroeconomics", author: "N. Gregory Mankiw", faculty: "FEB", price: 105000, condition: "Seperti Baru", imageUrl: "https://covers.openlibrary.org/b/isbn/9781464182891-L.jpg", description: "Mulus pol!",
    seller: { name: "Nadya", prodi: "Ekonomi Pembangunan", angkatan: "2024", wa: "6281234567895" }
  },
  {
    id: 7, title: "Pengantar Ilmu Hukum", author: "Peter Mahmud Marzuki", faculty: "Hukum", price: 75000, condition: "Seperti Baru", imageUrl: "https://covers.openlibrary.org/b/isbn/9786024253240-L.jpg", description: "Cover masih mulus banget.",
    seller: { name: "Risa", prodi: "Ilmu Hukum", angkatan: "2024", wa: "6281234567896" }
  },
  {
    id: 8, title: "Ilmu Komunikasi Suatu Pengantar", author: "Deddy Mulyana", faculty: "FISIP", price: 65000, condition: "Layak Pakai", imageUrl: "https://covers.openlibrary.org/b/isbn/9789795149934-L.jpg", description: "Buku sakti anak FISIP.",
    seller: { name: "Fajar", prodi: "Ilmu Komunikasi", angkatan: "2023", wa: "6281234567897" }
  },
  {
    id: 9, title: "Architecture: Form, Space, and Order", author: "Francis D.K. Ching", faculty: "FAD", price: 150000, condition: "Bagus", imageUrl: "https://covers.openlibrary.org/b/isbn/9780471752165-L.jpg", description: "Buku wajib anak FAD.",
    seller: { name: "Leo", prodi: "Arsitektur", angkatan: "2022", wa: "6281234567898" }
  },
  {
    id: 10, title: "Plant Physiology", author: "Lincoln Taiz", faculty: "Faperta", price: 135000, condition: "Bagus", imageUrl: "https://covers.openlibrary.org/b/isbn/9780878938667-L.jpg", description: "Buku fisiologi tumbuhan.",
    seller: { name: "Sari", prodi: "Agroteknologi", angkatan: "2023", wa: "6281234567899" }
  },
  // Tambahan buku baru agar makin lengkap
  {
    id: 11, title: "Operating System Concepts", author: "Abraham Silberschatz", faculty: "Fasilkom", price: 125000, condition: "Bagus", imageUrl: "https://covers.openlibrary.org/b/isbn/9781118063335-L.jpg", description: "Edisi Internasional, no coret-coret.",
    seller: { name: "Yoga", prodi: "Teknik Informatika", angkatan: "2022", wa: "6281234567900" }
  },
  {
    id: 12, title: "Sosiologi Suatu Pengantar", author: "Soerjono Soekanto", faculty: "FISIP", price: 60000, condition: "Layak Pakai", imageUrl: "https://covers.openlibrary.org/b/isbn/9789794210093-L.jpg", description: "Klasik tapi wajib punya.",
    seller: { name: "Putri", prodi: "Sosiologi", angkatan: "2023", wa: "6281234567901" }
  },
  {
    id: 13, title: "Calculus: Early Transcendentals", author: "James Stewart", faculty: "Fasilkom", price: 140000, condition: "Seperti Baru", imageUrl: "https://covers.openlibrary.org/b/isbn/9780538497909-L.jpg", description: "Kitab suci Kalkulus.",
    seller: { name: "Aldo", prodi: "Sains Data", angkatan: "2024", wa: "6281234567902" }
  }
];