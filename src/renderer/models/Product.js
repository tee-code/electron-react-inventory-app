const PouchDB = require('pouchdb').default;

const Product = new PouchDB('products');

export default Product;