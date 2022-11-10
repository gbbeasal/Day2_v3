import express from "express"

const authorRouter = express.Router();

// authorRouter.get("/authors/test", (request, response) => {
//     response.send({message: "ok"})
// })

// ============== GET /authors ==============:
authorRouter.get("/authors", async (request, response) => {
    const authors = await request.app.locals.prisma.author.findMany()
    response.send({ authors: authors })
})

// ============== GET /authors/:authorId ==============:
authorRouter.get("/authors/:authorId", async (request, response) => {
    const authorId = request.params.authorId
    const authors = await request.app.locals.prisma.author.findUnique({
        where: {
            id: Number.parseInt(authorId),
        },
    })
    response.send({ author: authors })
})

// ============== GET /authors/:authorId/books ==============:
authorRouter.get("/authors/:authorId/books", async (request, response) => {
    const authorId = request.params.authorId
    const authors = await request.app.locals.prisma.author.findUnique({
        where: {
            id: Number.parseInt(authorId),
        },
        include: {
            books: true,
          },
    })
    response.send({ books: authors.books })
})

/*
POST /authors
PUT /authors/:authorId
DELETE /authors/:authorId
 */



export default authorRouter;