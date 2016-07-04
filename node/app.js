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
    if (data == 'Breathing OUT finished' || data == 'Breathing OUT finished\n') {
        console.log("yay");
        io.emit('arduino-data', { breath: true });
    }

app.listen(webport, () => {
    var address = app.address();
    console.log("Web-Server at %j", address);
});
