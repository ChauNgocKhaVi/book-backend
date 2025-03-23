const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

class ReaderService {
    constructor(client) {
        this.Reader = client.db().collection("readers");
    }

    extractReaderData(payload) {
        const reader = {
            HoLot: payload.HoLot,
            Ten: payload.Ten,
            NgaySinh: payload.NgaySinh,
            Phai: payload.Phai,
            DiaChi: payload.DiaChi,
            DienThoai: payload.DienThoai,
        };
        Object.keys(reader).forEach(
            (key) => reader[key] === undefined && delete reader[key]
        );
        return reader;
    }

    async create(payload) {
        const reader = this.extractReaderData(payload);
        const result = await this.Reader.findOneAndUpdate(
            reader,
            { $set: reader },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.Reader.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Reader.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractReaderData(payload);
        const result = await this.Reader.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        return await this.Reader.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async deleteAll() {
        return await this.Reader.deleteMany({});
    }
}

module.exports = ReaderService;
