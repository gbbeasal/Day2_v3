// /*
// GET     /genres/:genreId/books
// POST    /genres
// PUT     /genres/:genreId
// DELETE  /genres/:genreId
// */

import express from "express"

const genreRouter = express.Router();

// ============== GET /genres ==============:
genreRouter.get("/genres", async (request, response) => {
    const genres = await request.app.locals.prisma.genre.findMany()
    response.send({genres: genres})
})

// ============== GET /genres/:genreId ==============:
genreRouter.get("/genres/:genreId", async (request, response) => {
    const genreId = request.params.genreId
    const genres = await request.app.locals.prisma.genre.findUnique({
        where: {
            id: Number.parseInt(genreId)
        }
    })
    response.send({genre: genres})
})

// ============== GET /genres/:genreId/books ==============:
genreRouter.get("/genres/:genreId/books", async (request, response) => {
    const genreId = parseInt(request.params.genreId)
    const genres = await request.app.locals.prisma.genre.findUnique({
        where: {
            id: Number.parseInt(genreId)
        },
        include: {
            books: true
        }
    })
    response.send({books: genres.books})
})





export default genreRouter;