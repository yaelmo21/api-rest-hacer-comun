const { Product } = require('../../models');

const getProducts = async (page = 1, limit = 10, termSearch) => {
    const query = termSearch ? { $text: { $search: termSearch } } : {};
    return Product.paginate(query, {
        page,
        limit,
        customLabels: {
            docs: 'products',
        }
    });
}

module.exports = {
    getProducts
}