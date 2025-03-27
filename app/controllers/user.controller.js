const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



exports.create = async (req, res, next) => {
    if (!req.body?.HoTen) {
        return next(new ApiError(400, "Tên người dùng không được để trống"));
    }
    
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi tạo người dùng"));
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const userService = new UserService(MongoDB.client);
        const { HoTen } = req.query;
        if (HoTen) {
            documents = await userService.find({ HoTen: new RegExp(HoTen, "i") });
        } else {
            documents = await userService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi truy xuất danh sách người dùng"));
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy người dùng"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi truy xuất người dùng với id=${req.params.id}`));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }
    
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy người dùng"));
        }
        return res.send({ message: "Người dùng đã được cập nhật thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật người dùng với id=${req.params.id}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy người dùng"));
        }
        return res.send({ message: "Người dùng đã được xóa thành công" });
    } catch (error) {
        return next(new ApiError(500, `Không thể xóa người dùng với id=${req.params.id}`));
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const deletedCount = await userService.deleteAll();
        return res.send({ message: `${deletedCount} người dùng đã được xóa thành công` });
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả người dùng"));
    }
};

exports.login = async (req, res, next) => {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
        return next(new ApiError(400, "Email và mật khẩu không được để trống"));
    }

    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.findByEmail(Email);

        if (!user) {
            return next(new ApiError(401, "Email hoặc mật khẩu không chính xác"));
        }

        const passwordMatch = bcrypt.compareSync(Password, user.Password);
        if (!passwordMatch) {
            return next(new ApiError(401, "Email hoặc mật khẩu không chính xác"));
        }

        // Tạo token JWT
        const token = jwt.sign(
            { id: user._id, VaiTro: user.VaiTro },
            "secret_key", // Thay bằng secret key bảo mật
            { expiresIn: "1h" }
        );

        return res.send({
            message: "Đăng nhập thành công",
            user: {
                id: user._id,
                HoTen: user.HoTen,
                Email: user.Email,
                VaiTro: user.VaiTro
            },
            token
        });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi đăng nhập"));
    }
};