import PageHeader from "../../../components/page-header";
import SettingsPanel from "../../../components/settings-panel";

export default function PengaturanPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan"
        description="Kelola profil organisasi, keamanan akun, dan preferensi notifikasi."
      />
      <SettingsPanel />
    </div>
  );
}
