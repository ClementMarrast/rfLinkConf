const socket = io()

let table = document.getElementById("table");
let readTableBtn = document.getElementById('readTable')
    rawLogsText = document.getElementById('rawLogs')


// DOM management
readTableBtn.addEventListener( 'click', e=> {
    socket.emit('somfy-rts', {
        command: "READ"
    })
    rawLogsText.innerHTML = ""
})

socket.on('rts-record-raw', message =>{
    // console.log(message)
    rawLogsText.append(message)
})

socket.on('rts-records', records =>{
    console.log("rts-records")
    console.log(records)
    
    loadRecords(records)
})

function loadRecords(records){
    records.forEach(record => {
        console.log(record)
        textAddress[record.number].nodeValue = record.address
        textRollingCode[record.number].nodeValue = record.rollingCode
        // cellNumber.appendChild(document.createTextNode(record.number));
        // cellAddress.appendChild(document.createTextNode(record.address));
        // cellRollingCode.appendChild(document.createTextNode(record.rollingCode));
    });
}

let textAddress = []
let textRollingCode = []
let btnUp = []
let btnDown = []
let btnStop = []
let btnPair = []

function generateTable(){
    for (let index = 0; index < 16; index++) {
        let row = table.insertRow();
        // Cell creation
        let cellNumber = row.insertCell();
        let cellAddress = row.insertCell();
        let cellRollingCode = row.insertCell();
        let cellUp = row.insertCell();
        let cellDown = row.insertCell();
        let cellStop = row.insertCell();
        let cellPair = row.insertCell();
        // Cell element creation
        cellNumber.appendChild(document.createTextNode(index));
        let address = document.createTextNode("0")
        cellAddress.appendChild(address);
        textAddress.push(address)
        let rollingCode = document.createTextNode("0")
        cellRollingCode.appendChild(rollingCode);
        textRollingCode.push(rollingCode)
        let up = document.createElement("BUTTON")
        up.innerHTML = "UP"
        cellUp.appendChild(up);
        btnUp.push(up)
        let down = document.createElement("BUTTON")
        down.innerHTML = "DOWN"
        cellDown.appendChild(down);
        btnDown.push(down)
        let stop = document.createElement("BUTTON")
        stop.innerHTML = "STOP"
        cellStop.appendChild(stop);
        btnStop.push(stop)
        let pair = document.createElement("BUTTON")
        pair.innerHTML = "PAIR"
        cellPair.appendChild(pair);
        btnPair.push(pair)
    }

    // Button listeners
    btnPair.forEach( (btn, idx) => {
        btn.addEventListener('click', e =>{
            console.log("click button pair index " + idx)
            socket.emit('somfy-rts', {
                command: "PAIR",
                index: idx
            })
        })
    });
    btnUp.forEach( (btn, idx) => {
        btn.addEventListener('click', e =>{
            console.log("click button UP index " + idx)
            socket.emit('somfy-rts', {
                command: "UP",
                index: idx
            })
        })
    });
    btnDown.forEach( (btn, idx) => {
        btn.addEventListener('click', e =>{
            console.log("click button UP index " + idx)
            socket.emit('somfy-rts', {
                command: "DOWN",
                index: idx
            })
        })
    });
    btnStop.forEach( (btn, idx) => {
        btn.addEventListener('click', e =>{
            console.log("click button UP index " + idx)
            socket.emit('somfy-rts', {
                command: "STOP",
                index: idx
            })
        })
    });
}

generateTable()