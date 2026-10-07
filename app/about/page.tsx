import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "MANGAKU adalah platform baca manga dan manhwa berbahasa Indonesia, " +
    "dikembangkan oleh Citedd.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Tentang MANGAKU</h1>

      <p className="mb-4">
        <strong>MANGAKU</strong> adalah platform baca manga dan manhwa
        berbahasa Indonesia. Kami menyediakan katalog ribuan judul dengan
        pembaruan chapter, pencarian, daftar favorit, dan riwayat bacaan
        agar pembaca Indonesia dapat menemukan bacaan berikutnya dengan
        cepat.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Dikembangkan oleh</h2>
      <p className="mb-4">
        MANGAKU dikembangkan dan dioperasikan oleh <strong>Citedd</strong>,
        berbasis di Pekalongan, Indonesia.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Fitur</h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>Katalog manga &amp; manhwa dengan pembaruan chapter</li>
        <li>Pencarian judul dan kategori (Terbaru, Populer, Rekomendasi)</li>
        <li>Akun pengguna: daftar, masuk, profil, dan favorit</li>
        <li>Riwayat bacaan otomatis</li>
        <li>Antarmuka Bahasa Indonesia</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">Kontak</h2>
      <p className="mb-4">
        Pertanyaan, kerja sama, atau laporan:{" "}
        <a className="underline" href="mailto:mangakumail@citedd.my.id">
          mangakumail@citedd.my.id
        </a>
      </p>

      <p className="mt-10">
        <Link className="underline" href="/">
          ← Kembali ke katalog
        </Link>
      </p>
    </main>
  );
}
