const fs = require('fs');
const files = [
  'src/pages/AdminDashboard.jsx',
  'src/pages/AdminLogin.jsx',
  'src/pages/Enquiry.jsx',
  'src/pages/Products.jsx'
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (!c.includes('import { API_BASE_URL }')) {
    c = c.replace('import React', "import { API_BASE_URL } from '../config';\nimport React");
  }
  c = c.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${API_BASE_URL}$1`');
  c = c.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${API_BASE_URL}$1`');
  c = c.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${API_BASE_URL}$1`');
  fs.writeFileSync(f, c);
});
console.log('Replaced local API URLs.');
