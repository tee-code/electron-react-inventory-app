import React from 'react'

const Receipt = React.forwardRef(({sale, getProductName, getProductPrice, getTotal}, ref) => {
  return (
    <div className="card">
        <div className="card-header bg-black"></div>
        <div className="card-body">

          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <i className="far fa-building text-danger fa-6x float-start"></i>
              </div>
            </div>

            <div className="row">
              <div className="col-xl-12">

                <ul className="list-unstyled float-end">
                  <li style={{fontSize: "30px", color: "red"}}>Company</li>
                  <li>123, Elm Street</li>
                  <li>123-456-789</li>
                  <li>mail@mail.com</li>
                </ul>
              </div>
            </div>

            <div className="row text-center">
              <h3 className="text-uppercase text-center mt-3" style={{fontSize: "40px"}}>Invoice</h3>
              <p>123456789</p>
            </div>

            <div className="row mx-3">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Description</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{getProductName(sale.doc.product)}</td>
                        <td><i className="fas fa-dollar-sign"></i> {getProductPrice(sale.doc.product)}</td>
                      </tr>
                  
                </tbody>
              </table>

            </div>
            <div className="row">
              <div className="col-xl-8">
                <ul className="list-unstyled float-end me-0">
                  <li><span className="me-3 float-start">Total Amount:</span><i className="fas fa-dollar-sign"></i> {getTotal(sale)}
                  </li>
                  
                </ul>
              </div>
            </div>
            <hr/>
            <div className="row">
              <div className="col-xl-8" style={{marginLeft:"60px"}}>
                <p className="text-center"
                  style={{fontSize: "30px", color: "red", fontWeight: "400", fontFamily: "Arial, Helvetica, sans-serif"}}>
                  Total:
                  <span><i className="fas fa-dollar-sign"></i> {getTotal(sale)}</span></p>
              </div>

            </div>

            <div className="row mt-2 mb-5">
              <p className="fw-bold">Date: <span className="text-muted">{sale.doc.date}</span></p>
              <p className="fw-bold mt-3">Signature: Oluwatobi Odekunle. E</p>
            </div>

          </div>

        </div>
        <div className="card-footer bg-black"></div>
      </div>
      
  )
}) 

export default Receipt;