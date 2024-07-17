import jwt from 'jsonwebtoken'

export const PRIVATE_KEY = 's3cr3etc@d3r'

export const generateToken = user => {
    console.log('Log de jwt.js-generateToken 1- :', user);
    const token = jwt.sign(user, PRIVATE_KEY, { expiresIn: '24h' });
    console.log('Log de jwt.js-generateToken 2- Generated token:', token); // Log del token generado
    return token;
};


// import jwt from 'jsonwebtoken'

// export const PRIVATE_KEY = 's3cr3etc@d3r'

// export const generateToken = user => jwt.sign(user, process.env.JWT_PRIVATE_KEY, {expiresIn: '24h'})