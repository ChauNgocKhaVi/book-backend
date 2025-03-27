const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const SECRET_KEY = "@123admin667"; // Thay bằng chuỗi bí mật mạnh

// Xử lý đăng ký nhân viên
const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!username || !password || !role) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        // Kiểm tra xem user đã tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};

// Xử lý đăng nhập
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ message: "Đăng nhập thành công!", token, role: user.role });
    } catch (error) {
        console.log(error); // In lỗi ra terminal
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};

module.exports = { register, login };
