import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import {
  LineChart,
  ResponsiveContainer,
  Legend, Tooltip,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';


function App() {
  

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  console.log("data".data)

  // process CSV data
  const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] === '"')
              d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }
    
    // prepare columns list from headers
    const columns =[{
      name: "name",
      selector: "name",
      sortable: false
        
    },
    {
      name: "batch",
      selector: "batch",
      sortable: true
        
    },
    {
      name: "stock",
      selector: "stock",
      sortable: true
        
    },
    {
      name: "deal",
      selector: "deal",
      sortable: true
        
    },
    {
      name: "free",
      selector: "free",
      sortable: true
        
    },
    {
      name: "mrp",
      selector: "mrp",
      sortable: true
        
    },
    {
      name: "rate",
      selector: "rate",
      sortable: true
        
    },
    {
      name: "exp",
      selector: "exp",
      sortable: true
        
    },
    {
      name: "company",
      selector: "company",
      sortable: true
        
    },
  ]
   
      
  

    setData(list);
    console.log(list)
    setColumns(columns);
    console.log("columns",columns)
  }

  // handle file upload
  const handleFileUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  }
 
// for table data extension
const tableData = {
  columns,
  data
};
  return (
    <>
     <div>
      <h3>Upload CSV file here. </h3>
       <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
       />
        <DataTableExtensions {...tableData}>
       <DataTable
      
         pagination
        highlightOnHover
        columns={columns}
        data={data}
        
        noHeader
        defaultSortField="id"
        defaultSortAsc={false}
       
      
       />
        </DataTableExtensions>
       
     </div>
   
    <h1 className="text-heading">
        Line Chart Using Rechart
    </h1>
    <ResponsiveContainer width="100%" aspect={3}>
        <LineChart data={data} margin={{ right: 300 }}>
            <CartesianGrid />
            <XAxis dataKey="company"
                interval={'preserveStartEnd'} />
            <YAxis  dataKey="stock"
               interval={'preserveStartEnd'} />
            <Legend />
            <Tooltip />
            <Line dataKey="rate"
                stroke="black" activeDot={{ r: 8 }} /> 
             <Line dataKey="mrp"
                stroke="red" activeDot={{ r: 8 }} />
                       <Line dataKey="name"
                stroke="blue" activeDot={{ r: 8 }} />
  
        </LineChart>
    </ResponsiveContainer>
</>
    
  );
}

export default App;
