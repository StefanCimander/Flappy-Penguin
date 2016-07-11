var serialport = require('serialport'),
    SerialPort = serialport.SerialPort,
    sport = process.argv[2],
    webport = process.argv[3] || 3000,

    fs = require('fs'),
    net = require('net'),
    app = require('http').createServer((req,res) => {
        // Serves static files from public directory
        if (req.url == '/') req.url = '/index.html';
        fs.readFile(__dirname + '/public' + req.url, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.write('404: File not found.');
                res.end();
                return;
            } else {
                switch (req.url.substr(req.url.indexOf('.'), req.url.length)) {
                    case '.html': res.setHeader('content-type', 'text/html'); break;
                    case '.css': res.setHeader('content-type', 'text/css'); break;
                    case '.js': res.setHeader('content-type', 'application/javascript'); break;
                    default: console.log(req.url.substr(req.url.indexOf('.'), req.url.length));

                }
                res.writeHead(200);
                res.write(data);
                res.end();
                return;
            }
        });
    }),
    io = require('socket.io')(app);

io.on('connection', (iosocket) => {
    console.log("Socket IO connection established.")
});

const ARDUINO_DATA_BREATH = 0x01;
const ARDUINO_DATA_JUMP = 0x02;

var arduino = new SerialPort(sport, {
    baudRate: 9600,
    options: false,
    parser: serialport.parsers.readline("\n")
}).on('open', () => {
    console.log('Serial port is open');
}).on('close', () => {
    console.log('Serial port is closed');
}).on('error', (e) => {
    console.log('Error: \n\t' + e);
}).on('data', (data) => {
    console.log("Data from Arduino: " + data);
    var jsonData = JSON.parse(data);
    switch (jsonData.type) {
        case ARDUINO_DATA_BREATH:
            io.emit('breath', { type: ARDUINO_DATA_BREATH, breath: true });
            break;
        case ARDUINO_DATA_JUMP:
            io.emit('jump', { type: ARDUINO_DATA_JUMP, jump: true });
            break;
    }
});

app.listen(webport, () => {
    var address = app.address();
    console.log("Web-Server at %j", address);
});
