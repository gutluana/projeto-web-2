const client = require("../../config/dbConnection");
const { ObjectId } = require("mongodb");

module.exports = class BookModel {
  static async getAllBooks() {
    console.log("getAllBooks");
    const result = await client.db("projeto-web").collection("books").find();
    const books = await result.toArray();
    console.log(books);
    return books;
  }

  static async addBook(data, bibliotecario) {
    console.log(`addBook -> ${data}`);
    try {
      const newBook = {
        nome: data.nome,
        ano: data.ano,
        autor: data.autor,
        link: data.link,
        bibliotecario: bibliotecario,
        dataDeAdicao: new Date(),
        emprestado: false,
        emprestadoPara: false,
        requisitadoPor: [],
      };

      const addedBook = await client
        .db("projeto-web")
        .collection("books")
        .insertOne(newBook);
      console.log(`Novo livro inserido com o id ${addedBook.insertedId}`);
      return addedBook;
    } catch (error) {
      console.log(`[bookService] Error: ${error}`);
    }
  }

  static async getBook(bookId) {
    console.log(`[estou no BookModel , getById] ${bookId}`);
    const book = await client
      .db("projeto-web")
      .collection("books")
      .findOne({ _id: new ObjectId(bookId) });
    return book;
  }

  static async deleteBook(bookId) {
    console.log(`[Book Model - delete Book] ${bookId}`);
    try {
      return await client
        .db("projeto-web")
        .collection("books")
        .deleteOne({ _id: new ObjectId(bookId) });
    } catch (error) {
      console.log(`[bookService] Error: ${error}`);
    }
  }

  static async loanRequisityBook(bookId, Obj){
    try {
        const book = await client
        .db("projeto-web")
        .collection("books")
        .findOne({ _id: new ObjectId(bookId) });

         if(!book) return null;
         
         return await client
        .db("projeto-web")
        .collection("books")
        .updateOne(
          { _id: new ObjectId(bookId) },
          {
            $push: {
                requisitadoPor: Obj,
            },
          }
        );

    } catch (error) {
      console.log(`[bookService] Error: ${error}`);
    }
  }

  static async loanBook(bookId, Obj) {
    console.log(`PUT BOOK by: ${bookId}`);
    try {
      const book = await client
        .db("projeto-web")
        .collection("books")
        .findOne({ _id: new ObjectId(bookId) });

      if (!book) return null;

      return await client
        .db("projeto-web")
        .collection("books")
        .updateOne(
          { _id: new ObjectId(bookId) },
          {
            $set: {
                emprestado: Obj.emprestado,
                emprestadoPara: Obj.emprestadoPara,
            },
          }
        );
    } catch (error) {
      console.log(`[bookService] Error: ${error}`);
    }
  }

  static async devolutionBook(bookId) {
    try {
      const book = await client
        .db("projeto-web")
        .collection("books")
        .findOne({ _id: new ObjectId(bookId) });

      if (!book) return null;

      return await client
        .db("projeto-web")
        .collection("books")
        .updateOne(
          { _id: new ObjectId(bookId) },
          {
            $set: {
                emprestado: false,
                emprestadoPara: false,
            },
          },
        );
    } catch (error) {
      console.log(`[bookService] Error: ${error}`);
    }
  }

  static async removeRequisityBook(bookId, Obj){
    try {
        const book = await client
        .db("projeto-web")
        .collection("books")
        .findOne({ _id: new ObjectId(bookId) });

    if (!book) return null;

   return await client
        .db("projeto-web")
        .collection("books")
        .updateOne(
          { _id: new ObjectId(bookId) },
          {
            $pull:{
                requisitadoPor: Obj
            },
          }
        );
    } catch (error) {
      console.log(`[bookService] Error: ${error}`);
    }
  }
};
