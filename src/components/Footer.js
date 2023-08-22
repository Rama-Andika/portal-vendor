import React from 'react';

const Footer = ({className}) => (
  <div className={`flex justify-start ${className} `}>
    <div className="dark:text-gray-200 text-gray-700 text-center mt-20 px-10 py-5">
      © 2023 All rights reserved by Dashra.com
    </div>
  </div>
);

export default Footer;
