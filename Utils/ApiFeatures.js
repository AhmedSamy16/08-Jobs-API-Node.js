
class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
        this.removed = ['page', 'fields', 'limit', 'sort']
    }
    filter() {
        let queryString = JSON.stringify(this.queryStr)
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/ig, (match) => `$${match}`)
        let queryObj = JSON.parse(queryString)
        this.removed.forEach(el => {
            delete queryObj[el]
        })
        this.query = this.query.find(queryObj)
        return this
    }
    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.replace(/,/g, ' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }
    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.replace(/,/g, ' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }
        return this
    }
    paginate() {
        const page = +this.queryStr.page || 1
        const limit = +this.queryStr.limit || 20
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

export default ApiFeatures