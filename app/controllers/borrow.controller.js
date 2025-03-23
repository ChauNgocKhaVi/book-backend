const BorrowService = require("../services/borrow.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.MaDocGia || !req.body?.MaSach) {
        return next(new ApiError(400, "Mã độc giả và mã sách không được để trống"));
    }
    
    try {
        const borrowService = new BorrowService(MongoDB.client);
        const document = await borrowService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi tạo thông tin mượn sách"));
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const borrowService = new BorrowService(MongoDB.client);
        documents = await borrowService.find({});
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi truy xuất danh sách mượn sách"));
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const borrowService = new BorrowService(MongoDB.client);
        const document = await borrowService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy thông tin mượn sách"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi truy xuất thông tin mượn sách với id=${req.params.id}`));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }
    
    try {
        const borrowService = new BorrowService(MongoDB.client);
        const document = await borrowService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy thông tin mượn sách"));
        }
        return res.send({ message: "Thông tin mượn sách đã được cập nhật thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật thông tin mượn sách với id=${req.params.id}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const borrowService = new BorrowService(MongoDB.client);
        const document = await borrowService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy thông tin mượn sách"));
        }
        return res.send({ message: "Thông tin mượn sách đã được xóa thành công" });
    } catch (error) {
        return next(new ApiError(500, `Không thể xóa thông tin mượn sách với id=${req.params.id}`));
    }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const deletedCount = await borrowService.deleteAll();
    return res.send({ message: `${deletedCount} Thông tin mượn sách đã được xóa thành công` });
  } catch (error) {
    return next(new ApiError(500, "Đã xảy ra lỗi khi mượn sách"));
  }
};