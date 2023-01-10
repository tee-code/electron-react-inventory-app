import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import "tailwindcss/tailwind.css";

import './App.css'

import './bootstrap'

import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import DashboardLayout from './components/DashboardLayout';


export default function App() {
  return (
    <DashboardLayout />
  );
}
