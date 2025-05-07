// src/components/Button.jsx

import React from 'react';

const Button = ({ type, label, className, onClick }) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-full py-3 rounded-xl ${className}`}
  >
    {label}
  </button>
);

export default Button;
