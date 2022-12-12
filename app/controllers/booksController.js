const res = require('express/lib/response');
const Joi = require('joi');
const BookModel = require('../models/booksModel');
const jtw = require("jsonwebtoken");
const config = require("../../config/auth.json");

const Book = require('../models/booksModel');

const emailUsuário1 = "usuario1@gmail.com"
const emailUsuário2 = "usuario2@gmail.com"
const emailBibliotecario = "bilbiotecario@gmail.com"
const passwordUsers= "123"

const generateToken = (properties) => jtw.sign(properties, config.secret, {
    expiresIn: 3600,
} )

const schema = Joi.object().keys({
    nome: Joi.string().required(),
    ano: Joi.string().required(),
    autor: Joi.string().required(),
    link: Joi.string().required(),
});

module.exports = class Books {
    static async apiGetAllBooks(req, res) {
        console.log('Controller book - get books');
        try {
            const books = await Book.getAllBooks();
            if (books.length<=0) {
                res.status(400).json('Não existe um livro cadastrado');
                return;
            }
            res.json(books);
        } catch (error) {
            console.log(`getAllBooks error -> ${error}`);
            res.status(500).json({ error: error });
        }
    }

    static async getBook(req, res) {
        try {
            const booksId = req.params.id;
            const book = await BookModel.getBook(booksId);
            if (!book)
                return res.status(404).json(`Não existe livro cadastrada com o id ${booksId}.`);
            else
                return res.status(200).json(book);
        } catch (error) {
            console.log(`[Controller - get book by id error] ${error}`);
            res.status(500).json({ error: error });
        }
    }

    static async addBook(req, res) {
        console.log(`[Add Book Controller]`, req.body);
        const { error, value } = schema.validate(req.body);
        if (error) {
            const result = {
                msg: `Livro não incluído. Campos não foram preenchidos corretamente`,
                error: error.details
            }
            res.status(404).json(result);
            return;
        }
        try {
            if(req.id!=emailBibliotecario) return res.status(403).json(`Pessoa não autorizada`)
            const addedBook = await Book.addBook(req.body, req.id);
            res.status(200).json(`Livro ${req.body.nome} adicionado com sucesso`);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    
    static async deleteBook(req, res) {
        try {
            if(req.id!= emailBibliotecario) return res.status(403).json(`Pessoa não autorizada`)
            const deleteBook = await BookModel.deleteBook(req.params.id);
            if (!deleteBook) return res.status(404).json(`Não existe livro cadastrado com o id ${req.params.id}.`);
            return res.status(200).json(`Livro ${req.params.id} removido com sucesso`);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async loanRequisityBook(req, res){
        try {
            console.log(req.id);
            if(req.id==emailBibliotecario) return res.status(403).json(`Bibliotecários não podem fazer requisição de empréstimo`)
            const book = await BookModel.loanRequisityBook(req.params.id, req.id);
            if(!book) return res.status(404).json(`Livro não encontrado`);
            res.status(200).json(`Livro ${req.params.id} requisitado com sucesso`);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async loanBook(req, res){
        try {
            if(req.id== emailBibliotecario) return res.status(403).json(`Bibliotecários não podem fazer empréstimo de livro`)
            const obj = {};
            obj["emprestado"] = true;
            obj["emprestadoPara"] = req.id;
            const book = await BookModel.loanBook(req.params.id, obj);
            if(!book) return res.status(404).json(`Livro não encontrado`);
            res.status(200).json(`Livro ${req.params.id} emprestado com sucesso`);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async devolutionBook(req, res){
        try {
            if(req.id!= emailBibliotecario) return res.status(403).json(`Apenas bibliotecários podem fazer a devolução de livro`)
            const book = await Book.devolutionBook(req.params.id);
            if(!book) return res.status(404).json(`Livro ${req.params.id} não encontrado`);
            res.status(200).json(`Livro ${req.params.id} devolvido com sucesso`);
        } catch (error) {
            res.status(500).json({ error: error });         
        }
    }

    static async removeRequisityBook(req, res){
        try {
            const book = await BookModel.getBook(req.params.id);
            if(!book.requisitadoPor.includes(String(req.id))) return res.status(302).json(`Você já removeu seu requisição desse livro`)
            const removeSignBook = await BookModel.removeRequisityBook(req.params.id, req.id);
            if(!removeSignBook) return res.status(404).json(`Livro ${req.params.id} não encontrado`);
            res.status(200).json(`Requisição removida com sucesso`);
        } catch (error) {
          res.status(500).json({ error: error });
        }
    }

    static async authUser(req, res) {
        try {
          const { email, password } = req.body;
          if (!email) {
            res.status(400).send({
              message: `Email inválido`,
            });
          }
          const isValidUser = password==passwordUsers && (email==emailUsuário1 || email==emailUsuário2 || email==emailBibliotecario)
          if(!isValidUser){
            return res.status(401).send({message: `Usuário inválido`});
            }
            const token = generateToken({
                id: email,
            });
            return res.send({token});
    } catch (error) {
          res.status(500).json({ error: error });
        }
    }
} 