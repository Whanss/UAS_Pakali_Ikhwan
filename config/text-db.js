const db = require("./db");

async function testConnection() {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("📡 Berhasil terhubung ke TiDB Cloud!");
    console.log("Hasil test query (1+1):", rows[0].result);
    process.exit(0);
  } catch (err) {
    console.error("❌ Gagal terhubung ke database:", err.message);
    process.exit(1);
  }
}

testConnection();
