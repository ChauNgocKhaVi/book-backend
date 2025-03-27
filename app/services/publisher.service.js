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
        const result = await this.Publisher.insertOne(publisher);
        return result.insertedId ? { _id: result.insertedId, ...publisher } : null;
    }

    async find(filter = {}) {
        return await this.Publisher.find(filter).toArray();
    }

    async findById(id) {
        if (!ObjectId.isValid(id)) return null;
        return await this.Publisher.findOne({ _id: new ObjectId(id) });
    }

    async update(id, payload) {
        if (!ObjectId.isValid(id)) return null;
        const filter = { _id: new ObjectId(id) };
        const update = this.extractPublisherData(payload);
        const result = await this.Publisher.updateOne(filter, { $set: update });

        return result.matchedCount > 0 ? { _id: id, ...update } : null;
    }

    async delete(id) {
        if (!ObjectId.isValid(id)) return null;
        const result = await this.Publisher.deleteOne({ _id: new ObjectId(id) });

        return result.deletedCount > 0;
    }

    async deleteAll() {
        const result = await this.Publisher.deleteMany({});
        return result.deletedCount;
    }

}

module.exports = PublisherService;
