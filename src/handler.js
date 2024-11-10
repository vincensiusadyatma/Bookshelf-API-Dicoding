const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = function(request,h){
    const {name, year, author, summary, publisher, pageCount, readPage,reading} = request.payload;
    if (name == null || name == undefined ) {
        const response =  h.response({
            status: "fail",
            message : "Gagal menambahkan buku. Mohon isi nama buku",
        
        });
        response.code(400)
        return response;
    }else if(readPage > pageCount){
        const response =  h.response({
            status: "fail",
            message : "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }
    
    
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const isFinished = readPage === pageCount;

    const newBook = {id, name , year, author, summary, publisher, pageCount, readPage, finished: isFinished,reading, insertedAt,updatedAt};
    
    books.push(newBook);
    const isSuccess = books.filter(function(book){
        return book.id == id
    }).length > 0;

    if (isSuccess) {
        const response =  h.response({
            status: "success",
            message : "Buku berhasil ditambahkan",
            data : {
                bookId : id
            }
        });
        response.code(201)
        return response;
    }else{
        const response =  h.response({
            status: "success",
            message : "Buku gagal ditambahkan",
        });
        response.code(400)
        return response;
    }

};

const getAllBookHandler = function(request,h){
    const getBooks = books.map(function(book){
        return {id: book.id, name: book.name, publisher: book.publisher}
    })
    const response = h.response(
        {
            status: "success",
            message : "Buku berhasil didapatkan",
            data : {
                books : getBooks
            }
        }
    )

    return response;
};


const getBookByIdHandler = function(request, h) {
    const { bookId } = request.params;

    const book = books.find(book => book.id === bookId);

    if (book) {
        return h.response({
            status: "success",
            data: {
                book
            }
        }).code(200);
    } else {
        return h.response({
            status: "fail",
            message: "Buku tidak ditemukan"
        }).code(404);
    }
};


const editBookByIdHandler = function(request,h){
    const {bookId} = request.params;
    const {name, year, author, summary, publisher, pageCount, readPage,reading} = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex(function(book){
        return book.id == bookId
    })

    if (name == null || name == undefined) {
        const response = h.response({
           "status": "fail",
            "message": "Gagal memperbarui buku. Mohon isi nama buku"
       })
       response.code(400)
       return response

    }else if(readPage > pageCount){
        const response = h.response({
            "status": "fail",
            "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        })
        response.code(400)
        return response
    }else if(index == -1){
        const response = h.response({
            "status": "fail",
            "message": "Gagal memperbarui buku. Id tidak ditemukan"
        })
        response.code(404)
        return response
    }else if(index !== -1){

        const isFinished = readPage === pageCount;
        
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished : isFinished,
            reading,
            updatedAt
        }
        const response = h.response({
             "status": "success",
             "message": "Buku berhasil diperbarui"
        })

        response.code(200)
        return response;
    }

}

const deleteBookByIdHandler = function(request,h){
    const {bookId} = request.params;
    const index = books.findIndex(function(book){
        return book.id = bookId;
    });

    if (index == -1) {
        const response = h.response({
            "status": "fail",
            "message": "Buku gagal dihapus. Id tidak ditemukan"
        })
        response.code(404)
        return response
    }else{
        books.splice(index,1);
        const response = h.response({
            "status": "success",
            "message": "Buku berhasil dihapus"
        })
        response.code(200)
        return response
    }
}

module.exports = {addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};