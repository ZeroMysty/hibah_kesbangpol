import PageHeader from "../../../components/page-header";
import FaqAccordion from "../../../components/faq-accordion";
import {
  BuildingIcon,
  DocumentIcon,
  InfoIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "../../../components/icons";

const contacts = [
  {
    label: "Email Dukungan",
    value: "bantuan@kesbangpol.go.id",
    desc: "Balasan dalam 1×24 jam kerja",
    icon: MailIcon,
    href: "mailto:bantuan@kesbangpol.go.id",
  },
  {
    label: "Telepon / WhatsApp",
    value: "(021) 1234-5678",
    desc: "Senin–Jumat, 08.00–16.00 WIB",
    icon: PhoneIcon,
    href: "tel:+622112345678",
  },
  {
    label: "Kantor Kesbangpol",
    value: "Jl. Jenderal Sudirman No. 1",
    desc: "Jakarta Pusat, DKI Jakarta",
    icon: MapPinIcon,
    href: "https://maps.google.com/?q=Jakarta",
  },
];

const steps = [
  {
    num: "01",
    title: "Daftarkan Instansi Anda",
    desc: "Buat akun organisasi dan lengkapi profil instansi serta dokumen legalitasnya.",
    icon: BuildingIcon,
  },
  {
    num: "02",
    title: "Ajukan Proposal Hibah",
    desc: "Isi formulir pengajuan dengan rincian kegiatan dan RAB yang sesuai ketentuan.",
    icon: DocumentIcon,
  },
  {
    num: "03",
    title: "Pantau Status & Pencairan",
    desc: "Lacak status verifikasi dan pencairan dana secara real-time di dashboard.",
    icon: InfoIcon,
  },
];

export default function BantuanPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pusat Bantuan"
        description="Temukan jawaban atas pertanyaan umum atau hubungi tim dukungan kami."
      />

      {/* Contact cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {contacts.map((c) => {
          const Icon = c.icon;
          return (
            <a
              key={c.label}
              href={c.href}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold">{c.label}</p>
              <p className="mt-0.5 text-sm font-medium text-red-600">
                {c.value}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{c.desc}</p>
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* FAQ */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold">Pertanyaan Umum</h2>
          <FaqAccordion />
        </div>

        {/* Guide */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold">Panduan Pengajuan</h2>
          <p className="text-sm text-zinc-500">
            Tiga langkah mudah mengajukan hibah
          </p>
          <ol className="mt-5 space-y-5">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.num} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-sm font-bold text-red-600">
                      {s.num}
                    </div>
                    {s.num !== "03" && (
                      <span className="mt-1 w-px flex-1 bg-zinc-200" />
                    )}
                  </div>
                  <div className="pb-1">
                    <p className="flex items-center gap-1.5 text-sm font-semibold">
                      <Icon className="h-4 w-4 text-zinc-400" />
                      {s.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                      {s.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
