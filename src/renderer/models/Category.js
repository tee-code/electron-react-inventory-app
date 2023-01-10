const PouchDB = require('pouchdb').default;

const Category = new PouchDB('categories');

export default Category;