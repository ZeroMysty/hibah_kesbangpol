import HibahTable from "@/components/hibah-table";

export const metadata = {
  title: "Daftar Dokumen Hibah | Kesbangpol",
  description: "Daftar seluruh dokumen hibah yang tersimpan di sistem pengarsipan Kesbangpol",
};

export default function DokumenPage() {
  return <HibahTable />;
}
