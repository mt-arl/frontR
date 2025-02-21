// userController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');


const userController = {
    getVinilById: async (req, res) => {
        try {
            const [user] = await pool.query(
                'SELECT id, model, brand, description, origin FROM vinyl WHERE id = ?',
                [req.params.id]
            );

            if (user.length === 0) {
                return res.status(404).json({ message: 'Vinyl not found' });
            }

            res.json(user[0]);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching vinil', error: error.message });
        }
    },
    // Create new user
    createUser: async (req, res) => {
        try {
            const { cedula, first_name, last_name, address, phone, email, password, gender, google_id } = req.body;
            const defaultRoleId = 3; // Define el ID de rol por defecto (por ejemplo, 2 para "usuario")

            // Validar campos requeridos
            if (!cedula || !first_name || !last_name || !email || !password || !gender) {
                return res.status(400).json({
                    success: false,
                    message: 'Por favor complete todos los campos requeridos (cédula, nombre, apellido, email, contraseña, género)'
                });
            }

            // Verificar si el email o la cédula ya existen
            const [existingUser] = await pool.query(
                'SELECT id FROM users WHERE email = ? OR cedula = ?',
                [email, cedula]
            );

            if (existingUser.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe un usuario con este email o cédula'
                });
            }

            // Insertar el usuario en la base de datos
            const [result] = await pool.query(
                `INSERT INTO users (cedula, first_name, last_name, address, phone, email, password, gender, id_rol, google_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    cedula,
                    first_name,
                    last_name,
                    address || null, // Si no hay dirección, insertar como NULL
                    phone || null,   // Si no hay teléfono, insertar como NULL
                    email,
                    password,
                    gender,
                    defaultRoleId,   // Rol por defecto
                    google_id || null // Si el usuario viene de Google, almacenar su google_id
                ]
            );

            // Respuesta exitosa
            res.status(201).json({
                success: true,
                message: 'Usuario creado exitosamente',
                user: {
                    id: result.insertId,
                    cedula,
                    first_name,
                    last_name,
                    email,
                    role: defaultRoleId
                }
            });
        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear el usuario',
                error: error.message
            });
        }
    },

    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const [users] = await pool.query(`
                SELECT u.id, u.cedula, u.first_name, u.last_name, u.address, u.phone, u.email, u.gender, r.roles as role
                FROM users u
                JOIN roles r ON u.id_rol = r.id_rol
            `);
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    },

    // Get user by ID
    getUserById: async (req, res) => {
        try {
            const [user] = await pool.query(
                'SELECT id, cedula, first_name, last_name, address, phone, email, gender, id_rol FROM users WHERE id = ?',
                [req.params.id]
            );

            if (user.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user[0]);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user', error: error.message });
        }
    },

    // Update user
    updateUser: async (req, res) => {
        try {
            const { cedula, first_name, last_name, address, phone, email, gender, id_rol, profile_image } = req.body;
            const userId = req.params.id; // Verificar si el usuario existe
            const [existingUser] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
            if (existingUser.length === 0) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }
    
            const currentUser = existingUser[0];
    
            // Usar el valor actual de 'gender' si no se envía desde el frontend
            const updatedGender = gender || currentUser.gender;
    
            // Verificar duplicados de email o cédula
            const [duplicateCheck] = await pool.query(
                'SELECT id FROM users WHERE (email = ? OR cedula = ?) AND id != ?',
                [email, cedula, userId]
            );
            if (duplicateCheck.length > 0) {
                return res.status(400).json({ success: false, message: 'Email o cédula ya están en uso por otro usuario' });
            }
    
            // Ejecutar la consulta de actualización
            await pool.query(
                'UPDATE users SET cedula = ?, first_name = ?, last_name = ?, address = ?, phone = ?, email = ?, gender = ?, id_rol = ?, profile_image = ? WHERE id = ?',
                [cedula, first_name, last_name, address, phone, email, updatedGender, id_rol || currentUser.id_rol, profile_image || currentUser.profile_image, userId]
            );
    
            res.json({ success: true });
        } catch (error) {
            console.error('Error al actualizar usuario:', {
                message: error.message,
                stack: error.stack,
                sqlMessage: error.sqlMessage || null
            });
            res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
        }
    },

    // Delete user
    deleteUser: async (req, res) => {
        try {
            const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error: error.message });
        }
    },

    // Update password
    updatePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.params.id;

            // Get current user
            const [user] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);

            if (user.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verify current password
            const isValid = await bcrypt.compare(currentPassword, user[0].password);

            if (!isValid) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating password', error: error.message });
        }
    }
};

module.exports = userController;createUser: async (req, res) => {
    try {
        const { cedula, first_name, last_name, address, phone, email, password, gender, google_id } = req.body;
        const defaultRoleId = 2; // Define el ID de rol por defecto (por ejemplo, 2 para "usuario")

        // Validar campos requeridos
        if (!cedula || !first_name || !last_name || !email || !password || !gender) {
            return res.status(400).json({
                success: false,
                message: 'Por favor complete todos los campos requeridos (cédula, nombre, apellido, email, contraseña, género)'
            });
        }

        // Verificar si el email o la cédula ya existen
        const [existingUser] = await pool.query(
            'SELECT id FROM users WHERE email = ? OR cedula = ?',
            [email, cedula]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un usuario con este email o cédula'
            });
        }

        // Insertar el usuario en la base de datos
        const [result] = await pool.query(
            `INSERT INTO users (cedula, first_name, last_name, address, phone, email, password, gender, id_rol, google_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                cedula,
                first_name,
                last_name,
                address || null, // Si no hay dirección, insertar como NULL
                phone || null,   // Si no hay teléfono, insertar como NULL
                email,
                password,
                gender,
                defaultRoleId,   // Rol por defecto
                google_id || null // Si el usuario viene de Google, almacenar su google_id
            ]
        );

        // Respuesta exitosa
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            user: {
                id: result.insertId,
                cedula,
                first_name,
                last_name,
                email,
                role: defaultRoleId
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el usuario',
            error: error.message
        });
    }
};
