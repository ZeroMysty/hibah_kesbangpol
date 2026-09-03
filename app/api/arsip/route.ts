import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

// GET — ambil semua data arsip dari tabel arsip
export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM `arsip` ORDER BY id DESC"
    );
    return NextResponse.json(
      { data: rows },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error: any) {
    console.error("[API/arsip GET]", error);
    return NextResponse.json(
      { error: "Gagal mengambil data arsip dari database: " + error.message },
      { status: 500 }
    );
  }
}

// POST — simpan data arsip baru ke tabel arsip
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jenis_dokumen_arsip,
      judul_berkas_dokumen,
      nominal_anggaran,
      lemari_arsip,
      posisi_rak,
      nomor_berkas_urut,
      instansi_penerima,
      bidang_pengampu,
      tahun_anggaran,
      scan_foto,
    } = body;

    const [result]: any = await pool.query(
      `INSERT INTO \`arsip\`
        (jenis_dokumen_arsip, judul_berkas_dokumen, nominal_anggaran,
         lemari_arsip, posisi_rak, nomor_berkas_urut, instansi_penerima,
         bidang_pengampu, tahun_anggaran, scan_foto)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jenis_dokumen_arsip ?? null,
        judul_berkas_dokumen ?? null,
        nominal_anggaran != null ? Number(nominal_anggaran) : null,
        lemari_arsip ?? null,
        posisi_rak ?? null,
        nomor_berkas_urut ?? null,
        instansi_penerima ?? null,
        bidang_pengampu != null ? String(bidang_pengampu) : null,
        tahun_anggaran != null ? String(tahun_anggaran) : null,
        scan_foto ?? null,
      ]
    );

    return NextResponse.json(
      { message: "Data arsip berhasil disimpan.", id: result.insertId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[API/arsip POST]", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data arsip ke database: " + error.message },
      { status: 500 }
    );
  }
}

// DELETE — hapus data arsip berdasarkan id
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Parameter 'id' wajib disertakan." },
        { status: 400 }
      );
    }

    const [result]: any = await pool.query("DELETE FROM `arsip` WHERE id = ?", [id]);

    return NextResponse.json({
      message: "Data arsip berhasil dihapus dari database.",
      deletedId: id,
      affectedRows: result.affectedRows,
    });
  } catch (error: any) {
    console.error("[API/arsip DELETE]", error);
    return NextResponse.json(
      { error: "Gagal menghapus data arsip dari database: " + error.message },
      { status: 500 }
    );
  }
}

// PUT — update data arsip berdasarkan id
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      jenis_dokumen_arsip,
      judul_berkas_dokumen,
      nominal_anggaran,
      lemari_arsip,
      posisi_rak,
      nomor_berkas_urut,
      instansi_penerima,
      bidang_pengampu,
      tahun_anggaran,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Field 'id' wajib disertakan untuk update." },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE \`arsip\` SET
        jenis_dokumen_arsip = ?,
        judul_berkas_dokumen = ?,
        nominal_anggaran = ?,
        lemari_arsip = ?,
        posisi_rak = ?,
        nomor_berkas_urut = ?,
        instansi_penerima = ?,
        bidang_pengampu = ?,
        tahun_anggaran = ?
       WHERE id = ?`,
      [
        jenis_dokumen_arsip,
        judul_berkas_dokumen,
        nominal_anggaran != null ? Number(nominal_anggaran) : null,
        lemari_arsip,
        posisi_rak,
        nomor_berkas_urut,
        instansi_penerima,
        bidang_pengampu != null ? String(bidang_pengampu) : null,
        tahun_anggaran != null ? String(tahun_anggaran) : null,
        id,
      ]
    );

    return NextResponse.json({ message: "Data arsip berhasil diperbarui." });
  } catch (error: any) {
    console.error("[API/arsip PUT]", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data arsip di database: " + error.message },
      { status: 500 }
    );
  }
}
