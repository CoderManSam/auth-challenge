const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwtSecret = 'mysecret';

const getAllMovies = async (req, res) => {
    const movies = await prisma.movie.findMany();

    res.json({ data: movies });
};

const createMovie = async (req, res) => {
    const { title, description, runtimeMins } = req.body;

    try {
        const token = req.get('authorization');
        // todo verify the token
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)
        console.log("verifiedToken", verifiedToken)
    } catch (e) {
        return res.status(401).json({ error: 'Invalid token provided.' })
    }

    const createdMovie = await prisma.movie.create({
        data: {
            title: title,
            description: description, 
            runtimeMins, runtimeMins
        }
    });

    console.log("createdMovie", createdMovie)

    res.json({ data: createdMovie });
};

module.exports = {
    getAllMovies,
    createMovie
};