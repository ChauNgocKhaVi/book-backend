const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

class PublisherService {
    constructor(client) {
        this.Publisher = client.db().collection("publishers");
    }

    extractPublisherData(payload) {
        const publisher = {
            TenNXB: payload.TenNXB,
            DiaChi: payload.DiaChi,
        };
        Object.keys(publisher).forEach(
            (key) => publisher[key] === undefined && delete publisher[key]
        );
        return publisher;
    }

    async create(payload) {
        const publisher = this.extractPublisherData(payload);
        const result = await this.Publisher.findOneAndUpdate(
            publisher,
            { $set: publisher },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.Publisher.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Publisher.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractPublisherData(payload);
        const result = await this.Publisher.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        return await this.Publisher.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async deleteAll() {
        return await this.Publisher.deleteMany({});
    }
}

module.exports = PublisherService;