import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET — ambil semua data mitra kerja dari tabel mitra_kerja
export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM `mitra_kerja` ORDER BY id DESC"
    );
    return NextResponse.json({ data: rows });
  } catch (error: any) {
    console.error("[API/lembaga GET]", error);
    return NextResponse.json(
      { error: "Gagal mengambil data mitra kerja dari database: " + error.message },
      { status: 500 }
    );
  }
}

// POST — simpan mitra kerja baru ke tabel mitra_kerja
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      Nama_lembaga_ormas,
      jenis_organisasi,
      bidang_yang_terkait,
      nama_ketua,
      nomor_contact,
      alamat_sekretariat,
    } = body;

    const [result]: any = await pool.query(
      `INSERT INTO \`mitra_kerja\`
        (Nama_lembaga_ormas, jenis_organisasi, bidang_yang_terkait, nama_ketua, nomor_contact, alamat_sekretariat)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        Nama_lembaga_ormas ?? null,
        jenis_organisasi ?? null,
        bidang_yang_terkait != null ? String(bidang_yang_terkait) : null,
        nama_ketua ?? null,
        nomor_contact ?? null,
        alamat_sekretariat ?? null,
      ]
    );

    return NextResponse.json(
      { message: "Mitra kerja berhasil disimpan.", id: result.insertId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[API/lembaga POST]", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data mitra kerja ke database: " + error.message },
      { status: 500 }
    );
  }
}

// PUT — update data mitra kerja berdasarkan id
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      Nama_lembaga_ormas,
      jenis_organisasi,
      bidang_yang_terkait,
      nama_ketua,
      nomor_contact,
      alamat_sekretariat,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Field 'id' wajib disertakan untuk update." },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE \`mitra_kerja\` SET
        Nama_lembaga_ormas = ?,
        jenis_organisasi = ?,
        bidang_yang_terkait = ?,
        nama_ketua = ?,
        nomor_contact = ?,
        alamat_sekretariat = ?
       WHERE id = ?`,
      [
        Nama_lembaga_ormas,
        jenis_organisasi,
        bidang_yang_terkait != null ? String(bidang_yang_terkait) : null,
        nama_ketua,
        nomor_contact,
        alamat_sekretariat,
        id,
      ]
    );

    return NextResponse.json({ message: "Data mitra kerja berhasil diperbarui." });
  } catch (error: any) {
    console.error("[API/lembaga PUT]", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data mitra kerja di database: " + error.message },
      { status: 500 }
    );
  }
}

// DELETE — hapus mitra kerja berdasarkan id
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

    await pool.query("DELETE FROM `mitra_kerja` WHERE id = ?", [id]);

    return NextResponse.json({ message: "Data mitra kerja berhasil dihapus." });
  } catch (error: any) {
    console.error("[API/lembaga DELETE]", error);
    return NextResponse.json(
      { error: "Gagal menghapus data mitra kerja dari database: " + error.message },
      { status: 500 }
    );
  }
}
