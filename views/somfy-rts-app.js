const socket = io()
// const obj = require('lodash/Object');

let readTableBtn = document.getElementById('readTable')
    rawLogsText = document.getElementById('rawLogs')


// DOM management
readTableBtn.addEventListener( 'click', e=> {
    socket.emit('somfy-rts', {
        command: "READ"
    })
})

socket.on("data", message =>{
    rawLogsText.append(message)
} )
// Table
// let columnArray = [
//     { colName: 'Name', objPath: 'record.name'},
//     { colName: 'Index', objPath: 'record.idx'},
//     { colName: 'Address', objPath: 'record.address'},
//     { colName: 'RollingCode', objPath: 'record.rollingCode'},
//     { colName: 'PAIR', pairFct(idx){
//         socket.emit('somfy-rts', {
//             command: 'PAIR',
//             index: idx
//         });
//     }},
//     { colName: 'UP', upFct(){
//         socket.emit('somfy-rts', 'UP');
//     }},
//     { colName: 'DOWN', downFct(){
//         socket.emit('somfy-rts', 'DOWN');
//     }}
// ];

// function insertCellHeader(document, row, name){
//     let th = document.createElement("th");
//     let text = document.createTextNode(name);
//     th.appendChild(text);
//     row.appendChild(th);
// }

// function generateTableHead(table) {
//     let thead = table.createTHead();
//     let row = thead.insertRow();

//     for (let col of columnArray){
//         insertCellHeader(document, row, col.colName);    
//     }
// }

// function insertCellRow(row, name){
//     let cell = row.insertCell();
//     let text = document.createTextNode(name);
//     cell.appendChild(text);
//     return cell;
// }
  
// function generateTable(table, data) {
//     for (let element of data) {
//         let row = table.insertRow();
        
//         for (let col of columnArray){
//             let cell = insertCellRow(row, obj.get(element, col.objPath));
//             if(col.colorFct != null){
//                 col.colorFct(cell, obj.get(element, col.objPath));
//             }
//         }
//     }
// }

// let table = document.querySelector("table");
// generateTableHead(table);
// generateTable(table, dataObj);