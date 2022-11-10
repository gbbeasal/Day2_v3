// POST    /genres
// DELETE  /genres/:genreId

import express from "express"
import pick from "lodash/pick.js"

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

// ============ PUT /genres/:genreId ============:
genreRouter.put("/genres/:genreId", async (request, response) => {
    const genreId = request.params.genreId
    // response.send({data:request.body.title, message:"ok"})

    const filteredBody = pick(request.body, ["title"])

    const updatedGenre = await request.app.locals.prisma.genre.update({
        where: {
            id: Number.parseInt(genreId),
          },
        data: filteredBody,
      })
    response.send({ data: updatedGenre, message: "ok" })
})



export default genreRouter;