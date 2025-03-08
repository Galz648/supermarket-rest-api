import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key'; // Import from environment variables

export function generateAdminToken() {
    const payload = {
        userId: 'admin-user-id',
        role: 'admin',
    };

    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

// Export the SECRET_KEY so it can be used consistently across the application
export { SECRET_KEY }; 
