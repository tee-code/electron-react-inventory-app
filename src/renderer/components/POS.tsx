import { MemoryRouter as Router, Routes, Route, HashRouter } from 'react-router-dom';

import "tailwindcss/tailwind.css";

import { Fragment, useEffect, useRef, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

import Sale from 'renderer/models/Sales';
import ReactToPrint from 'react-to-print';

import { v4 as uuidv4 } from 'uuid';
import Category from 'renderer/models/Category';
import Product from 'renderer/models/Product';
import Receipt from './Receipt';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function POS() {

  const [visible,setVisible] = useState(false)

  const [sale, setSale] = useState({
    customer: "",
    product: "",
    category: "",
    new_product: "",
    new_category: "",
    new_customer: "",
    quantity: 0,
    new_quantity: 0
  })

  let [products, setProducts] = useState([]);
  let [categories, setCategories] = useState([]);
  let [sales, setSales] = useState([]);

  const create = (e) => {

    e.preventDefault();

    var data = {
      _id: uuidv4(),
      product: sale.product,
      customer: sale.customer,
      category: sale.category,
      quantity: sale.quantity,
      date: new Date()
    };

    Sale.put(data).then(function(response){
      console.log(response)
      getAll()
    }).catch(function(err){
      console.log(err)
    });
  }

  const remove = function(id,e){
    e.preventDefault();
    Sale.get(id).then(function(doc) {
      return Sale.remove(doc);
    }).then(function (result) {
      // handle result
      getAll()
    }).catch(function (err) {
      alert('Unable to delete')
      console.log(err);
    });
  }

  const update = function(id,e){
    e.preventDefault();
    Sale.get(id).then(function(doc) {
      
      return Sale.put({
        _id: id,
        _rev: doc._rev,
        product: sale.new_product,
        customer: sale.new_customer,
        category: sale.new_category,
        quantity: sale.new_quantity
      });

    }).then(function(response) {
      // handle response
      getAll()
    }).catch(function (err) {
      console.log(err);
    });
  }

  const getAll = function(){
    Sale.allDocs({
      include_docs: true,
      attachments: true
    }).then(function (result) {
      console.log(result);
      setSales(result.rows);
    }).catch(function (err) {
      console.log(err);
    });
  }

  const getCategories = function(){
    Category.allDocs({
      include_docs: true,
      attachments: true
    }).then(function (result) {
      console.log(result);
      setCategories(result.rows);
    }).catch(function (err) {
      console.log(err);
    });
  }

  const getProducts = function(){
    Product.allDocs({
      include_docs: true,
      attachments: true
    }).then(function (result) {
      console.log(result);
      setProducts(result.rows);
    }).catch(function (err) {
      console.log(err);
    });
  }

  const filterProductsByCategory = function(category_id){
    const result = products.filter(product => product.doc.category == category_id);
    console.log(category_id, result)
    setProducts(result)
  }

  const getCategoryName = function(id){
    const category = categories.find(c => c.doc._id == id);
    return category.doc.name;
  }

  const getProductName = function(id){
    const product = products.find(c => c.doc._id == id);
    return product ? product.doc.name : ""
  }

  const getProductPrice = function(id){
    const product = products.find(c => c.doc._id == id);
    return product ? product.doc.price : 0
  }

  const getTotal = function(s){

    return getProductPrice(s.doc.product) * parseInt(s.doc.quantity)
  }

  useEffect(() => {
    getAll()
    getCategories()
    getProducts()
  }, [])

  const handleChange = (event) => {
    
    setSale({ ...sale, [event.target.name]: event.target.value });
    
    // filterProductsByCategory(event.target.value)
  };

  const handleEdit = (event) => {
    setSale({ ...sale, [event.target.name]: event.target.value });
    // filterProductsByCategory()
  };

  const componentRef = useRef(null);

  return (
    <>
      <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Point of Sales</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-6 sm:px-0">
              <div className="h-auto rounded-lg border-4 border-dashed border-gray-200">
              <button type="button" className="btn btn-primary flaot-right m-4" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Create</button>
        
              <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">Create Sale</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <form>

                        <div className="mb-3">
                          <label for="category" className="col-form-label">Category</label>
                          <select onChange={handleChange} name="category" id="category" className='form-control'>
                            <option value="0">Category</option>
                            {
                              categories && categories.map(each => (
                                <option value={each.doc._id}>{each.doc.name}</option>
                              ))
                            }
                            
                          </select>
                        </div>
                        <div className="mb-3">
                          <label for="product" className="col-form-label">Product</label>
                          <select value={sale.category} onChange={handleChange} name="product" id="product" className='form-control'>
                            <option value="0">Product</option>
                            {
                              products && products.map(each => (
                                <option value={each.doc._id}>{each.doc.name}</option>
                              ))
                            }
                            
                          </select>
                        </div>
                        
                        <div className="mb-3">
                          <label for="quantity" className="col-form-label">Quantity</label>
                          <input name='quantity' value={sale.quantity} onChange={handleChange} type="number" className="form-control" id="quantity" />
                        </div>

                        <div className="mb-3">
                          <label for="customer" className="col-form-label">Customer</label>
                          <input name='customer' value={sale.customer} onChange={handleChange} type="text" className="form-control" id="customer" />
                        </div>

                      </form>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button onClick={create} type="button" className="btn btn-primary">Save</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-3/3 mx-auto">
                <div className="bg-white shadow-md rounded my-6">
                  <table className="text-left w-full border-collapse"> 
              
                    <thead>
                      <tr>
                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Customer</th>
                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Reference</th>
                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Date</th>
                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        sales.map(each => (
                          <tr className="hover:bg-grey-lighter">
                          <td className="py-4 px-6 border-b border-grey-light">{each.doc.customer}</td>
                          <td className="py-4 px-6 border-b border-grey-light">{each.doc._id}</td>
                          <td className="py-4 px-6 border-b border-grey-light">{each.doc.date}</td>
                          <td className="py-4 px-6 border-b border-grey-light">
                          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#L`+each.doc._id} data-bs-whatever="@mdo">Edit</button>
                          <button type="button" className="btn btn-primary mx-2" data-bs-toggle="modal" data-bs-target={`#D`+each.doc._id} data-bs-whatever="@mdo">View</button>
          
                          <div className="modal fade" id={'L'+each.doc._id} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title" id="exampleModalLabel">Edit Sale</h5>
                                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                  <form>
  
                                  <div className="mb-3">
                                      <label for="category" className="col-form-label">Category</label>
                                      <select defaultValue={each.doc.category} onChange={handleEdit} name="new_category" id="category" className='form-control'>
                                      <option value="0">Category</option>
                                      {
                                        categories && categories.map(c => (
                                          <option value={c.doc._id} selected={c.doc._id == each.doc.category ? true : false}>{c.doc.name}</option>
                                        ))
                                      }
                                      </select>
                                    </div>
                                    <div className="mb-3">
                                      <label for="product" className="col-form-label">Product</label>
                                      <select defaultValue={each.doc.product} onChange={handleEdit} name="new_product" id="category" className='form-control'>
                                      <option value="0">Product</option>
                                      {
                                        products && products.map(c => (
                                          <option value={c.doc._id} selected={c.doc._id == each.doc.product ? true : false}>{getProductName(c.doc._id)} : {getProductPrice(c.doc._id)}</option>
                                        ))
                                      }
                                      </select>
                                    </div>
                                    <div className="mb-3">
                                      <label for="quantity" className="col-form-label">Quantity</label>
                                      <input defaultValue={sale.quantity} name='new_quantity' type="text" className="form-control" id="quantity" />
                                    </div>

                                    <div className="mb-3">
                                      <label for="customer" className="col-form-label">Customer</label>
                                      <input defaultValue={sale.customer} name='new_customer' type="text" className="form-control" id="customer" />
                                    </div>
                            
                                    
                            
                                  </form>
                                </div>
                                <div className="modal-footer">
                                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                  <button type="button" className="btn btn-primary">Save</button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal fade" id={'D'+each.doc._id} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title" id="exampleModalLabel">Edit Sale</h5>
                                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                
                                <div className="modal-body">
                                  
                                <div ref={componentRef}>
                                    <ReactToPrint
                                        trigger={() => <button ref={componentRef}  type="button" className="btn btn-primary m-3">Print Receipt</button>}
                                        content={() => componentRef.current}
                                      />

                                      <Receipt 
                                        sale = {each} 
                                        getProductName={getProductName} 
                                        getProductPrice = {getProductPrice}
                                        getTotal = {getTotal}
                                        ref={componentRef} 
                                        />
                                      
                                  </div>
                                  
                                  
                                  </div>
                                
                                <div className="modal-footer">
                                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                  
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                          <button onClick={e => remove(each.doc._id,e)} type="button" className="btn btn-danger mx-2">Delete</button>          
                          </td>
                        </tr>
                       
                        ))
                      }
                    
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
            </div>
            {/* /End replace */}
          </div>
        </main>
    </>
  )
}
