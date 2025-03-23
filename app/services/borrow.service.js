const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

class BorrowService {
    constructor(client) {
        this.Borrow = client.db().collection("borrows");
    }

    extractBorrowData(payload) {
        const borrow = {
            MaDocGia: payload.MaDocGia,
            MaSach: payload.MaSach,
            NgayMuon: payload.NgayMuon,
            NgayTra: payload.NgayTra,
        };
        Object.keys(borrow).forEach(
            (key) => borrow[key] === undefined && delete borrow[key]
        );
        return borrow;
    }

    async create(payload) {
        const borrow = this.extractBorrowData(payload);
        const result = await this.Borrow.findOneAndUpdate(
            borrow,
            { $set: borrow },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.Borrow.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Borrow.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractBorrowData(payload);
        const result = await this.Borrow.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        return await this.Borrow.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async deleteAll() {
        return await this.Borrow.deleteMany({});
    }
}

module.exports = BorrowService;
