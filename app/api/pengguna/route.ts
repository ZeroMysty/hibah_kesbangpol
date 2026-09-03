import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET — ambil semua pengguna dari tabel pengguna
export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM `pengguna` ORDER BY id DESC"
    );
    return NextResponse.json({ data: rows });
  } catch (error: any) {
    console.error("[API/pengguna GET]", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pengguna dari database: " + error.message },
      { status: 500 }
    );
  }
}

// POST — tambah pengguna baru ke tabel pengguna
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama_pengguna, email, peran, status, jabatan } = body;

    const [result]: any = await pool.query(
      `INSERT INTO \`pengguna\` (nama_pengguna, email, peran, status, jabatan)
       VALUES (?, ?, ?, ?, ?)`,
      [
        nama_pengguna ?? null,
        email ?? null,
        peran ?? null,
        status ?? "Aktif",
        jabatan ?? null,
      ]
    );

    return NextResponse.json(
      { message: "Pengguna berhasil ditambahkan.", id: result.insertId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[API/pengguna POST]", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data pengguna ke database: " + error.message },
      { status: 500 }
    );
  }
}

// PUT — update data pengguna berdasarkan id
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, nama_pengguna, email, peran, status, jabatan } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Field 'id' wajib disertakan untuk update." },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE \`pengguna\` SET
        nama_pengguna = ?,
        email = ?,
        peran = ?,
        status = ?,
        jabatan = ?
       WHERE id = ?`,
      [nama_pengguna, email, peran, status, jabatan, id]
    );

    return NextResponse.json({ message: "Data pengguna berhasil diperbarui." });
  } catch (error: any) {
    console.error("[API/pengguna PUT]", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data pengguna di database: " + error.message },
      { status: 500 }
    );
  }
}

// DELETE — hapus pengguna berdasarkan id
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

    await pool.query("DELETE FROM `pengguna` WHERE id = ?", [id]);

    return NextResponse.json({ message: "Pengguna berhasil dihapus." });
  } catch (error: any) {
    console.error("[API/pengguna DELETE]", error);
    return NextResponse.json(
      { error: "Gagal menghapus data pengguna dari database: " + error.message },
      { status: 500 }
    );
  }
}
