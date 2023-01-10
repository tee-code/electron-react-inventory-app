import { MemoryRouter as Router, Routes, Route, HashRouter } from 'react-router-dom';

import "tailwindcss/tailwind.css";

import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

import Product from 'renderer/models/Product';

import { v4 as uuidv4 } from 'uuid';
import Category from 'renderer/models/Category';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Products() {

  const [visible,setVisible] = useState(false)

  const [product, setProduct] = useState({
    name: "",
    price: 0,
    new_name: "",
    new_price: 0,
    category: "",
    new_category: ""
  })

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const create = (e) => {

    e.preventDefault();

    var data = {
      _id: uuidv4(),
      name: product.name,
      price: product.price,
      category: product.category
    };

    Product.put(data).then(function(response){
      console.log(response)
      getAll()
    }).catch(function(err){
      console.log(err)
    });
  }

  const remove = function(id,e){
    e.preventDefault();
    Product.get(id).then(function(doc) {
      return Product.remove(doc);
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
    Product.get(id).then(function(doc) {
      console.log(product, ' inside update ')
      return Product.put({
        _id: id,
        _rev: doc._rev,
        name: product.new_name,
        price: product.new_price,
        category: product.new_category
      });
    }).then(function(response) {
      // handle response
      getAll()
    }).catch(function (err) {
      console.log(err);
    });
  }

  const getAll = function(){
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

  const getCategoryName = function(id){
    if(categories){
      const category_name = categories.find(c => c.doc._id == id);
      console.log(category_name)
      
      return category_name ? category_name.doc.name : 'Unknown';
    }
    
    
    return "Unknown";
  }

  const handleChange = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value });
  };

  const handleEdit = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value });
    
  };
  
  useEffect(() => {
    getAll()
    getCategories()
  }, [])

  

  return (
    <>
    <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Products</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="px-4 py-6 sm:px-0">


            <div className="h-auto rounded-lg border-4 border-dashed border-gray-200">

            <button type="button" className="btn btn-primary float-right m-4" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Create</button>
        
            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Create Product</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <form>

                      <div className="mb-3">
                        <label for="category" className="col-form-label">Category</label>
                        <select value={product.category} onChange={handleChange} name="category" id="category" className='form-control'>
                          <option value="0">Category</option>
                          {
                            categories && categories.map(each => (
                              <option value={each.doc._id}>{each.doc.name}</option>
                            ))
                          }
                          
                        </select>
                      </div>
                      <div className="mb-3">
                        <label for="name" className="col-form-label">Product Name</label>
                        <input value={product.name} name='name' onChange={handleChange} type="text" className="form-control" id="name" />
                      </div>
                      <div className="mb-3">
                        <label for="price" className="col-form-label">Price</label>
                        <input value={product.price} name='price' onChange={handleChange} type="number" className="form-control" id="price" />
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

              <div className="w-2/3 mx-auto">
                <div className="bg-white shadow-md rounded my-6">
                  <table className="text-left w-full border-collapse"> 
              
                    <thead>
                      <tr>
                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Category</th>
                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Product</th>
                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Price</th>
                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                     {
                      categories && products.map(each => (
                        <tr className="hover:bg-grey-lighter">
                        <td className="py-4 px-6 border-b border-grey-light">{getCategoryName(each.doc.category)}</td>
                        <td className="py-4 px-6 border-b border-grey-light">{each.doc.name}</td>
                        <td className="py-4 px-6 border-b border-grey-light">{each.doc.price}</td>
                        <td className="py-4 px-6 border-b border-grey-light">
                          {/* <a href="#" className="text-grey-lighter font-bold py-1 px-3 rounded text-xs bg-green hover:bg-green-dark">Edit</a> */}
                          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#L`+each.doc._id} data-bs-whatever="@mdo">Edit</button>
        
                          <div className="modal fade" id={'L'+each.doc._id} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title" id="exampleModalLabel">Edit Product</h5>
                                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                  <form>
                                    <div className="mb-3">
                                      <label for="category" className="col-form-label">Category</label>
                                      <select defaultValue={each.doc.category} onChange={handleEdit} name="new_category" id="category" className='form-control'>
                                      <option value="0">Category</option>
                                      {
                                        categories.map(c => (
                                          <option value={c.doc._id} selected={c.doc._id == each.doc.category ? true : false}>{c.doc.name}</option>
                                        ))
                                      }
                                      </select>
                                    </div>
                                    <div className="mb-3">
                                      <label for="name" className="col-form-label">Product Name</label>
                                      <input name='new_name' onChange={handleEdit} defaultValue={each.doc.name} type="text" className="form-control" id="recipient-name" />
                                    </div>
                                    <div className="mb-3">
                                      <label for="price" className="col-form-label">Price</label>
                                      <input name='new_price' onChange={handleEdit} defaultValue={each.doc.price} type="number" className="form-control" id="price" />
                                    </div>
                            
                                  </form>
                                </div>
                                <div className="modal-footer">
                                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                  <button onClick={e => update(each.doc._id,e)} type="button" className="btn btn-primary">Save</button>
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
