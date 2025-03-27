const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }

    extractUserData(payload) {
        const user = {
            HoTen: payload.HoTen,
            NgaySinh: payload.NgaySinh,
            Phai: payload.Phai,
            DiaChi: payload.DiaChi,
            DienThoai: payload.DienThoai,
            Email: payload.Email,
            VaiTro: payload.VaiTro,
        };

        if (payload.Password) {
            user.Password = bcrypt.hashSync(payload.Password, 10);
        }

        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );

        return user;
    }


    async create(payload) {
        const user = this.extractUserData(payload);

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await this.User.findOne({ Email: user.Email });
        if (existingUser) {
            throw new ApiError(400, "Email đã tồn tại");
        }

        const result = await this.User.insertOne(user);
        return result;
    }

    async find(filter) {
        const cursor = await this.User.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.User.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findByEmail(email) {
        return await this.User.findOne({ Email: email });
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractUserData(payload);
        const result = await this.User.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        return await this.User.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async deleteAll() {
        return await this.User.deleteMany({});
    }
}

module.exports = UserService;
