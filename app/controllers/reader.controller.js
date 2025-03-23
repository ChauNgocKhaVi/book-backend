const ReaderService = require("../services/reader.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.Ten) {
        return next(new ApiError(400, "Tên độc giả không được để trống"));
    }
    
    try {
        const readerService = new ReaderService(MongoDB.client);
        const document = await readerService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi tạo độc giả"));
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const readerService = new ReaderService(MongoDB.client);
        const { Ten } = req.query;
        if (Ten) {
            documents = await readerService.findByName(Ten);
        } else {
            documents = await readerService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi truy xuất danh sách độc giả"));
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const readerService = new ReaderService(MongoDB.client);
        const document = await readerService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy độc giả"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi truy xuất độc giả với id=${req.params.id}`));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }
    
    try {
        const readerService = new ReaderService(MongoDB.client);
        const document = await readerService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy độc giả"));
        }
        return res.send({ message: "Độc giả đã được cập nhật thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật độc giả với id=${req.params.id}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const readerService = new ReaderService(MongoDB.client);
        const document = await readerService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy độc giả"));
        }
        return res.send({ message: "Độc giả đã được xóa thành công" });
    } catch (error) {
        return next(new ApiError(500, `Không thể xóa độc giả với id=${req.params.id}`));
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const readerService = new ReaderService(MongoDB.client);
        const deletedCount = await readerService.deleteAll();
        return res.send({ message: `${deletedCount} độc giả đã được xóa thành công` });
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả độc giả"));
    }
};
