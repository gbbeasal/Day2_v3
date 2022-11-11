import express from "express"
import pick from "lodash/pick.js"
import { body, validationResult } from "express-validator"

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

// ============ PUT /authors/:authorId ============:
authorRouter.put("/authors/:authorId", async (request, response) => {
    const authorId = request.params.authorId
    // response.send({data:request.body.title, message:"ok"})

    const filteredBody = pick(request.body, [
        "firstName",
        "lastName"
    ])

    const updatedAuthor = await request.app.locals.prisma.author.update({
        where: {
            id: Number.parseInt(authorId),
          },
        data: filteredBody,
      })
    response.send({ data: updatedAuthor, message: "ok" })
})

// ============== POST /authors ==============:
authorRouter.post(
    "/authors", 
    //validation help from express-validators (inside an array)
    [
        body('firstName')
            .notEmpty()
            .isLength({min: 3}) // title length restriction
            .withMessage("Book requires a `firstName` and should be more than 5 characters long"),
        body('lastName')
            .notEmpty()
            .isLength({min: 2}) // title length restriction
            .withMessage("Book requires a `lastNumber` and should be more than 5 characters long")
    ], 
    async (request, response) => {

        const errors = validationResult(request);
        // if may laman si error, we send a reponse containing all the errors
        if (!errors.isEmpty()) {
            response.status(400).json({ errors: errors.array() })
            return;
        }

        const filteredBody = pick(request.body, [
            "firstName",
            "lastName"
        ])

        // response.send({ data: filteredBody, message: "ok"})
        const author = await request.app.locals.prisma.author.create({
        data: filteredBody,
        })
        // response.send({ data: filteredBody, message: "book added successfully" })
        response.send({ author: author, message: "Author added successfully" })
})

// ============== DELETE /authors/:authorId ==============:
// booksRouter.delete("/books/:bookId", async (request, response) => {
//     const bookId = parseInt(request.params.bookId);
//     try {
//         const deletedBook = await request.app.locals.prisma.book.delete({
//             where: {
//                 id: Number.parseInt(bookId),
//             },
//         });
//         response.send({ data: deletedBook, message: deletedBook? "ok":"book not found" })
//     } catch {
//         response.send({ data: null, message: "book not found" })
//     }
// })

export default authorRouter;