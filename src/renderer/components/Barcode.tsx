
import React, { useCallback } from 'react';
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

import BarcodeScannerComponent from "react-qr-barcode-scanner";

function App() {

  const [data, setData] = React.useState("Not Found");

  const [visible, setVisible] = React.useState(false);

  const setVisibleHandler = () => {
    setVisible(true)
    document.querySelector("#barcode").focus()
  }

  return (
    <div className='container'>
      {visible && (
          <BarcodeScannerComponent
          width={500}
          height={500}
          onUpdate={(err, result) => {
            if (result) {
              setData(result.text);
              barcodeInput()
            }
            else setData("Not Found");
          }}
        />
        )
      }
     
      <div className="input-group m-3">
        <button onClick={setVisibleHandler} className="btn btn-outline-secondary" type="button" id="button-addon1">Generate</button>
        <input id='barcode' value={data} type="text" className="form-control" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1" />
      </div>
    </div>
  );
}

export default App;