import { MemoryRouter as Router, Routes, Route, HashRouter } from 'react-router-dom';

import "tailwindcss/tailwind.css";
import "tailwindcss/colors";
import { useEffect, useState } from 'react'

import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Modal, Button, Label, Checkbox, TextInput } from 'flowbite-react'
import Category from 'renderer/models/Category';

import { v4 as uuidv4 } from 'uuid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Categories() {

  const [visible,setVisible] = useState(false)

  const [category, setCategory] = useState({
    name: "",
    new_name: ""
  })

  const [categories, setCategories] = useState([]);

  const create = (e) => {

    e.preventDefault();

    var data = {
      _id: uuidv4(),
      name: category.name
    };

    Category.put(data).then(function(response){
      console.log(response)
      getAll()
    }).catch(function(err){
      console.log(err)
    });
  }

  const remove = function(id,e){
    e.preventDefault();
    Category.get(id).then(function(doc) {
      return Category.remove(doc);
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
    Category.get(id).then(function(doc) {
      return Category.put({
        _id: id,
        _rev: doc._rev,
        name: category.new_name
      });
    }).then(function(response) {
      // handle response
      getAll()
    }).catch(function (err) {
      console.log(err);
    });
  }

  const getAll = function(){
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

  useEffect(() => {
    console.log(categories)
    getAll()
  }, [])

  const handleChange = (event) => {
    setCategory({ ...category, [event.target.name]: event.target.value });
  };

  const handleEdit = (event) => {
    setCategory({ ...category, [event.target.name]: event.target.value });
  };

  return (
    <>
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Categories</h1>
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
                      <h5 className="modal-title" id="exampleModalLabel">Create Category</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">

                      <form>

                        <div className="mb-3">
                          <label for="recipient-name" className="col-form-label">Category Name</label>
                          <input name='name' onChange={handleChange} value={category.name} type="text" className="form-control" id="recipient-name" />
                        </div>
                        
                      </form>

                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" className="btn btn-primary" onClick={create}>Save</button>
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
                          <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                       {
                        categories.map(each => (
                          <tr className="hover:bg-grey-lighter">
                          <td className="py-4 px-6 border-b border-grey-light">{each.doc.name}</td>
                          <td className="py-4 px-6 border-b border-grey-light">
                            {/* <a href="#" className="text-grey-lighter font-bold py-1 px-3 rounded text-xs bg-green hover:bg-green-dark">Edit</a> */}
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#L`+each.doc._id} data-bs-whatever="@mdo">Edit</button>
          
                            <div className="modal fade" id={'L'+each.doc._id} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Edit Category</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                  </div>
                                  <div className="modal-body">
                                    <form>

                                      <div className="mb-3">
                                        <label for="recipient-name" className="col-form-label">Category Name</label>
                                        <input name="new_name" onChange={handleEdit} defaultValue={each.doc.name} type="text" className="form-control" id="recipient-name" />
                                      </div>
                                      
                                    </form>
                                  </div>
                                  <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button onClick={e => update(each.doc._id,e)} type="button" className="btn btn-primary">Save </button>
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
