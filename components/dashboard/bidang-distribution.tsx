import SectionCard from "@/components/section-card";
import { BIDANG_HEX, formatRupiah, formatShortRupiah } from "@/lib/utils";
import type { BidangId, bidangInfo } from "@/context/mode-context";

export type BidangBreakdownItem = {
  id: BidangId;
  info: (typeof bidangInfo)[BidangId];
  proposalCount: number;
  arsipCount: number;
  totalItems: number;
  sumNominal: number;
  percentNominal: number;
};

type BidangDistributionProps = {
  breakdown: BidangBreakdownItem[];
  totalNominal: number;
  selectedBidang: BidangId | "Semua";
  onToggleBidang: (id: BidangId) => void;
};

/**
 * BidangDistribution - Menampilkan porsi alokasi usulan dan nominal anggaran per 4 Bidang teknis.
 */
export default function BidangDistribution({
  breakdown,
  totalNominal,
  selectedBidang,
  onToggleBidang,
}: BidangDistributionProps) {
  return (
    <SectionCard>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900">Distribusi Usulan per Bidang Teknis</h2>
          <p className="text-xs text-zinc-500">
            Porsi berkas dan nilai anggaran yang ditangani oleh 4 Bidang Kesbangpol
          </p>
        </div>
        <span className="text-xs font-semibold text-zinc-400">
          Total 4 Bidang: {formatRupiah(totalNominal)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {breakdown.map((item) => {
          const isSelected = selectedBidang === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggleBidang(item.id)}
              className={`text-left rounded-xl border p-4 transition-all cursor-pointer ${
                isSelected
                  ? "border-red-500 bg-red-50/40 ring-2 ring-red-500/20 shadow-sm"
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold text-white ${item.info.color}`}
                >
                  {item.info.shortName}
                </span>
                <span className="text-[11px] font-mono text-zinc-400 font-semibold">{item.info.code}</span>
              </div>
              <h3 className="mt-2 text-xs font-bold text-zinc-800 line-clamp-1">{item.info.fullName}</h3>
              <div className="mt-3 flex items-baseline justify-between">
                <p className="text-base font-bold text-zinc-900">{formatShortRupiah(item.sumNominal)}</p>
                <span className="text-xs font-semibold text-zinc-500">{item.proposalCount} berkas</span>
              </div>
              {/* Progress bar alokasi nominal */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(item.percentNominal, 4)}%`,
                    backgroundColor: BIDANG_HEX[item.id],
                  }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-zinc-400 text-right">
                {item.percentNominal.toFixed(1)}% dari total usulan
              </p>
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
}
