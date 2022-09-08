const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwtSecret = 'mysecret';

const getAllMoviesByUserId = async (req, res) => {
    const {userId} = req.query
    const idAsNumber = Number(userId)

    console.log("idAsNumber", idAsNumber)

    let movies = await prisma.movie.findMany()

    if(userId){
        movies = await prisma.movie.findMany({
            where: {
                userId: idAsNumber
            }
        });
    }

    res.json({ data: movies });
};

const createMovie = async (req, res) => {
    const { title, description, runtimeMins } = req.body;

    try {
        const token = req.get('authorization');
        // todo verify the token
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)
        // console.log("verifiedToken", verifiedToken)
    } catch (e) {
        return res.status(401).json({ error: 'Invalid token provided.' })
    }

    const token = req.get('authorization');
    const userInfo = jwt.verify(token, process.env.JWT_SECRET)

    const createdMovie = await prisma.movie.create({
        data: {
            title: title,
            description: description, 
            runtimeMins: runtimeMins,
            userId: userInfo.id
        }
    });

    // console.log("createdMovie", createdMovie)

    res.json({ data: createdMovie });
};

module.exports = {
    getAllMoviesByUserId,
    createMovie
};