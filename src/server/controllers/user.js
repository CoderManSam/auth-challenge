const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwtSecret = 'mysecret';
const saltRounds = 10

const register = async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const createdUser = await prisma.user.create({
        data: {
            username: username,
            password: hashedPassword
        }
    })

    res.json({ data: createdUser });
};

const login = async (req, res) => {
    const { username, password } = req.body;

    const foundUser = await prisma.user.findUnique({
        where: {
            username: username
        }
    });

    if (!foundUser) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const passwordsMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordsMatch) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const payload = foundUser.username

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.json({ data: token });
};

module.exports = {
    register,
    login
};