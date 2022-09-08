const express = require('express');
const {
    getAllMoviesByUserId,
    createMovie
} = require('../controllers/movie');

const router = express.Router();

router.get('/', getAllMoviesByUserId);
router.post('/', createMovie);

module.exports = router;