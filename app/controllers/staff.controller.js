const StaffService = require("../services/staff.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.HoTenNV) {
        return next(new ApiError(400, "Tên nhân viên không được để trống"));
    }
    
    try {
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi tạo nhân viên"));
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const staffService = new StaffService(MongoDB.client);
        const { HoTenNV } = req.query;
        if (HoTenNV) {
            documents = await staffService.findByName(HoTenNV);
        } else {
            documents = await staffService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi truy xuất danh sách nhân viên"));
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi truy xuất nhân viên với id=${req.params.id}`));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }
    
    try {
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên"));
        }
        return res.send({ message: "Nhân viên đã được cập nhật thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật nhân viên với id=${req.params.id}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên"));
        }
        return res.send({ message: "Nhân viên đã được xóa thành công" });
    } catch (error) {
        return next(new ApiError(500, `Không thể xóa nhân viên với id=${req.params.id}`));
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const staffService = new StaffService(MongoDB.client);
        const deletedCount = await staffService.deleteAll();
        return res.send({ message: `${deletedCount} nhân viên đã được xóa thành công` });
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả nhân viên"));
    }
};