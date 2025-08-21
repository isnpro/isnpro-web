const db = require('./_utils/db');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { identifier, password } = req.body; // identifier bisa username atau email

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Username/Email dan password harus diisi.' });
    }

    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1 OR email = $1', [identifier]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'Username atau Email tidak ditemukan.' });
        }

        // Bandingkan password yang diinput dengan hash di database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Password salah.' });
        }

        // Jangan kirim password ke client
        res.status(200).json({ message: 'Login berhasil!', username: user.username });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};
