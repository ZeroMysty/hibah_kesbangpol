import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

// GET — ambil semua data hibah dari tabel data_hibah
export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM `data_hibah` ORDER BY id DESC"
    );
    return NextResponse.json(
      { data: rows },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error: any) {
    console.error("[API/hibah GET]", error);
    return NextResponse.json(
      { error: "Gagal mengambil data hibah dari database: " + error.message },
      { status: 500 }
    );
  }
}

// POST — simpan data hibah baru ke tabel data_hibah
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jenis_dokume_arsip,
      nominal_diajukan,
      lembaga,
      tujuan_bidang_teknis,
      lemari_arsip,
      posisi_rak,
      nomor_berkas,
      kategori_program,
      nama_penanggung_jawab,
      scan_foto,
    } = body;

    const [result]: any = await pool.query(
      `INSERT INTO \`data_hibah\`
        (jenis_dokume_arsip, nominal_diajukan, lembaga, tujuan_bidang_teknis,
         lemari_arsip, posisi_rak, nomor_berkas, kategori_program, nama_penanggung_jawab, scan_foto)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jenis_dokume_arsip ?? null,
        nominal_diajukan != null ? String(nominal_diajukan) : null,
        lembaga ?? null,
        tujuan_bidang_teknis != null ? String(tujuan_bidang_teknis) : null,
        lemari_arsip ?? null,
        posisi_rak ?? null,
        nomor_berkas ?? null,
        kategori_program ?? null,
        nama_penanggung_jawab ?? null,
        scan_foto ?? null,
      ]
    );

    return NextResponse.json(
      { message: "Data hibah berhasil disimpan.", id: result.insertId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[API/hibah POST]", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data hibah ke database: " + error.message },
      { status: 500 }
    );
  }
}

// DELETE — hapus data hibah dan arsip terkait dari database
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

    // 1. Ambil nama usulan sebelum data_hibah dihapus agar arsip terkait juga terhapus
    const [rows]: any = await pool.query(
      "SELECT * FROM `data_hibah` WHERE id = ?",
      [id]
    );

    if (rows && rows.length > 0) {
      const nama = rows[0].jenis_dokume_arsip;
      if (nama) {
        // Hapus juga baris otomatis di tabel arsip yang sesuai nama usulan ini
        await pool.query(
          "DELETE FROM `arsip` WHERE `judul_berkas_dokumen` = ? OR `judul_berkas_dokumen` LIKE ?",
          [`Proposal & Berkas Hibah: ${nama}`, `%${nama}%`]
        );
      }
    }

    // 2. Hapus baris dari tabel data_hibah
    const [deleteResult]: any = await pool.query(
      "DELETE FROM `data_hibah` WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      message: "Data hibah dan arsip terkait berhasil dihapus dari database.",
      deletedId: id,
      affectedRows: deleteResult.affectedRows,
    });
  } catch (error: any) {
    console.error("[API/hibah DELETE]", error);
    return NextResponse.json(
      { error: "Gagal menghapus data hibah dari database: " + error.message },
      { status: 500 }
    );
  }
}

// PUT — update data hibah berdasarkan id
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      jenis_dokume_arsip,
      nominal_diajukan,
      lembaga,
      tujuan_bidang_teknis,
      lemari_arsip,
      posisi_rak,
      nomor_berkas,
      kategori_program,
      nama_penanggung_jawab,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Field 'id' wajib disertakan untuk update." },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE \`data_hibah\` SET
        jenis_dokume_arsip = ?,
        nominal_diajukan = ?,
        lembaga = ?,
        tujuan_bidang_teknis = ?,
        lemari_arsip = ?,
        posisi_rak = ?,
        nomor_berkas = ?,
        kategori_program = ?,
        nama_penanggung_jawab = ?
       WHERE id = ?`,
      [
        jenis_dokume_arsip,
        nominal_diajukan != null ? String(nominal_diajukan) : null,
        lembaga,
        tujuan_bidang_teknis != null ? String(tujuan_bidang_teknis) : null,
        lemari_arsip,
        posisi_rak,
        nomor_berkas,
        kategori_program,
        nama_penanggung_jawab,
        id,
      ]
    );

    return NextResponse.json({ message: "Data hibah berhasil diperbarui." });
  } catch (error: any) {
    console.error("[API/hibah PUT]", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data hibah di database: " + error.message },
      { status: 500 }
    );
  }
}
