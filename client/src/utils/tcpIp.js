var net = require('net');

const CRLF = '\r\n'


export class ProtocolTcp {

	constructor(ip, port, sendCmd, parseFunc){
		this.ip = ip;
		this.port = port;
		this.sendCmd = sendCmd;
		this.client = null;
		this.parseFunc = parseFunc;
		
	}


	async connectToScale(){
		return new Promise((resolve, rejects) =>{
			this.client = new net.Socket();
			this.client.connect(this.port, this.ip, ()=> {
				//console.log('Connected');
				resolve(true)
				//client.write('SIR');
			});

			this.client.on('close', function () {
				//console.log('Connection TCP/ip closed');
				resolve(false)
			})
		})
	}


	async sendCmdOnScaleOnce(){
		return new Promise((resolve, rejects)=>{
			const cmd = this.parseCmd();
			this.client.write(cmd);

			setTimeout(()=>{
				resolve(false)
			}, 5000)

			this.client.once('data', (data)=> {
				//console.log('Received in sendCmdOnScaleOnce: ' + data);
				let parseData = this.parseFunc(data.toString())
				resolve({weight: parseData, connect: true})
			});
		})
	}


	async sendCmdOnScaleTwiceSimple(){
		return new Promise((resolve, rejects)=>{
			let localRes = 2;
			let buf = []

			let cmd = this.parseCmd();
			this.client.write(cmd);

			setTimeout(()=>{
				resolve(false)
			}, 5000)

			this.client.on('data', (data)=> {
				//console.log("data", data.toString());
				//console.log(data.toString());
				localRes = localRes - 1
				if(localRes !== 0){
					buf.push(data.toString())
					
				}else{
					buf.push(data.toString())
					//console.log(buf);
					let parseData = this.parseFunc(buf)
					//console.log(parseData);
					resolve({weight: parseData, connect: true})
				}
			});
		})

	}

	parseCmd(){
		return this.sendCmd.replace('\\r', '\r').replace('\\n','\n')
	}

	closeConnection(){
		this.client.destroy(); // kill client after server's response
	}

	simpleParser(str){
		return Number(str
			.replace('S', "")
			.replace('S', "")
			.replace('kg', "")
			)
	}
		




}

var parserType = ['toledoSimple', 'toledoSimpleTwice', 'toledoModbus']
    // let pr_1 = 'S\r\n' // 10.10.15.208:1705 - S S         00 kg
    // let pr_2 = 'SIR\r\n' // 10.10.190.205:1702 - S S         00 kg
    // let pr_3 = 'S\r\n' //10.10.190.103:1704 - "I4 A "C118667709"↵S S 00 k"
    // let pr_4 = 'SIR\r\n' // 10.10.190.196:1702   S S         00 kg
	//toledoSimple,


    // let pr_5 = ['user admin\r\n', 'read wt0102\r\n'] // 10.10.190.189:1701


// I4 A "C118667709"

// S S         00 kg

// [ 'I4 A "C118667709"\r\n', 'S S         00 kg\r\n' ]

// client.on('data', function(data) {
// 	console.log(data.toString());
// 	//client.destroy();
// 	localRes = localRes - 1
// 	if(localRes !== 0){
// 		buf.push(data.toString())
// 	}else{
// 		buf.push(data.toString())
// 		console.log(buf);
// 		client.destroy(); // kill client after server's response
// 	}


	
// });
