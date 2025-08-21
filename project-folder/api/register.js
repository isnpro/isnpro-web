const db = require('./_utils/db');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, email, nomor, password } = req.body;

    if (!username || !email || !nomor || !password) {
        return res.status(400).json({ message: 'Semua kolom harus diisi.' });
    }

    // Aturan password di backend (validasi ulang)
    if (password.length < 9 || !/[A-Z]/.test(password)) {
        return res.status(400).json({ message: 'Password tidak memenuhi syarat.' });
    }

    try {
        // Cek apakah username atau email sudah ada
        const existingUser = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Username atau Email sudah terdaftar.' });
        }

        // Hash password sebelum disimpan
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan pengguna baru ke database
        const result = await db.query(
            'INSERT INTO users (username, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id',
            [username, email, nomor, hashedPassword]
        );

        res.status(201).json({ message: 'Pendaftaran berhasil! Silakan login.', userId: result.rows[0].id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};
