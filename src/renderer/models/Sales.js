const PouchDB = require('pouchdb').default;

const Sale = new PouchDB('sales');

export default Sale;