const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.TenSach) {
    return next(new ApiError(400, "Tên sách không được để trống"));
  }

  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Đã xảy ra lỗi khi tạo sách"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const bookService = new BookService(MongoDB.client);
    const { TenSach } = req.query;
    if (TenSach) {
      documents = await bookService.findByName(TenSach);
    } else {
      documents = await bookService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "Đã xảy ra lỗi khi truy xuất danh sách sách"));
  }

  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi truy xuất sách với id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }

  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send({ message: "Sách đã được cập nhật thành công" });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi cập nhật sách với id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send({ message: "Sách đã được xóa thành công" });
  } catch (error) {
    return next(new ApiError(500, `Không thể xóa sách với id=${req.params.id}`));
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const deletedCount = await bookService.deleteAll();
    return res.send({ message: `${deletedCount} sách đã được xóa thành công` });
  } catch (error) {
    return next(new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả sách"));
  }
};

// Phương thức mới để mượn sách
exports.borrowBook = async (req, res, next) => {
    const bookId = req.params.id;
    
    try {
        const bookService = new BookService(MongoDB.client);
        const book = await bookService.findById(bookId);

        if (!book) {
            return next(new ApiError(404, "Không tìm thấy sách"));
        }

        // Kiểm tra nếu số lượng sách còn lại > 0
        if (book.SoQuyen <= 0) {
            return next(new ApiError(400, "Sách đã hết"));
        }

        // Giảm số lượng quyển sách đi 1
        book.SoQuyen -= 1;

        // Cập nhật lại thông tin sách
        await bookService.update(bookId, book);

        return res.send({ message: "Mượn sách thành công", book });
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi mượn sách"));
    }
};

// Phương thức hoàn tác khi xóa lượt mượn
exports.returnBook = async (req, res, next) => {
    const bookId = req.params.id;

    try {
        const bookService = new BookService(MongoDB.client);
        const book = await bookService.findById(bookId);

        if (!book) {
            return next(new ApiError(404, "Không tìm thấy sách"));
        }

        // Tăng số lượng sách lên 1 khi lượt mượn bị xóa
        book.SoQuyen += 1;

        // Cập nhật lại thông tin sách
        await bookService.update(bookId, book);

        return res.send({ message: "Trả sách thành công", book });
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi trả sách"));
    }
};
