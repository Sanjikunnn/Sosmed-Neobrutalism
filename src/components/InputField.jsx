// src/components/InputField.jsx

import React from 'react';

const InputField = ({ label, type, name, value, onChange, placeholder, className }) => (
  <div>
    <label className="block text-sm font-medium text-white">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className={`w-full mt-1 px-3 py-2 rounded-xl ${className}`}
    />
  </div>
);

export default InputField;
