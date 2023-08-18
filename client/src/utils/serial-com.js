import { SerialPort, ReadlineParser } from 'serialport'



export class SerialCom {
    get serialCom() {
        return this._serialCom;
    }

    set serialCom(value) {
        this._serialCom = value;
    }

    get status() {
        return this.SERIALSTATUS;
    }

    set status(value) {
        this.SERIALSTATUS = value;
    }


    set eventIpc(value) {
        this._eventIpc = value;
    }

    get eventIpc() {
        return this._eventIpc;
    }



    constructor(ipcMainModule) {
        this._serialCom = 'COM1';
        //this._serialCom= '/dev/ttyUSB0'
        this.SERIALPORT = null
        this.SERIALSTATUS = {
            code: 400,
            text: `${this.serialCom} close`
        }
        this.PARSER = null
        this._ipcMainModule = ipcMainModule;
        this._eventIpc = null;
        this.openPort = false
    }


    async init(){
        await this.initSerialCom();
        this.initEvent();
    }

    async destroy(){
        if(this.SERIALPORT){
            this.SERIALPORT.removeAllListeners()
        }

    }


    openCom(){
        this.SERIALPORT.open((err) => {
            if (err) {
                const res = {
                    com: this.serialCom,
                    data: null,
                    info: "error open port",
                    error: 400,
                    textError: err.message

                }
                this.SERIALSTATUS = {
                    code: 400,
                    text: `${this.serialCom} ${err}`
                }
                this.eventIpc.sender.send('barcode', res)
                this.openPort = false
            }else {
                const res = {
                    com: this.serialCom,
                    data: null,
                    info: "Port open",
                    error: null,
                    textError: null
                }

                this.eventIpc.sender.send('barcode', res)
                this.SERIALSTATUS = {
                    code: 200,
                    text: `${this.serialCom} open`
                }
                this.openPort = true
            }
        });


    }

    async closeCom(){
        if (this.openPort){
            this.SERIALPORT.close()
        }
        await this.destroy()
    }


    async initSerialCom(){
        const list = await this.getAllPort()
        if (list.length){
            this.SERIALPORT = new SerialPort({
                path: this.serialCom,
                baudRate: 9600,
                dataBits: 8,
                autoOpen: false
            })
            const parser = this.SERIALPORT.pipe(new ReadlineParser({ delimiter: '\r' }))
            this.PARSER = parser;

        }else {
            this.SERIALPORT = null
            const res = {
                com: null,
                data: null,
                info: "Not fount serial Port",
                error: 400,
                textError: "Not fount serial Port"

            }
            this._ipcMainModule.sender.send('barcode', res)
        }

    }

    async getAllPort(){
        const listPorts = await SerialPort.list()
        //console.log(listPorts)
        return listPorts;// [{}]

    }


    initEvent(){
        if (this.SERIALPORT){
            this.SERIALPORT.on('open', () => {
                console.log('Serial Port ' + `${this.SERIALCOM}` + ' is opened.')
                this.SERIALSTATUS = {
                    code: 200,
                    text: `${this._serialCom} is opened`
                }
            })

            this.PARSER.on('data', (data) => {
                console.log('Data received vie parser: ' + data)
                const res = {
                    com: this._serialCom,
                    data: data,
                    info: "get code",
                    error: null,
                    textError: null

                }
                this._ipcMainModule.sender.send('barcode', res)
            })

            this.SERIALPORT.on('data', (data) => {
                // console.log('Data received time: ', new Date())
                // console.log('Data received: ' + data)
                //event.sender.send('barcode', { com: SERIALCOM, data: data, info:"find com" })
            })

            this.SERIALPORT.on('close', (err) => {
                // open errors will be emitted as an error event
                //console.log('SERIALPORT close : ' + err)
                this.SERIALSTATUS = {
                    code: 400,
                    text:  `${this._serialCom} ${err}`
                }

                this.openPort = false
                const res = {
                    com: this.serialCom,
                    data: null,
                    info: "event close",
                    error: 400,
                    textError: `${this._serialCom} ${err}`

                }
                this._ipcMainModule.sender.send('barcode', res)
            })

            this.SERIALPORT.on('error', (err) => {
                // open errors will be emitted as an error event
                //console.log('SERIALPORT error : ' + err)
                this.SERIALSTATUS = {
                    code: 400,
                    text:  `${this._serialCom} ${err}`
                }

                this.openPort = false
                const res = {
                    com: this.serialCom,
                    data: null,
                    info: "event error",
                    error: 400,
                    textError: `${this._serialCom} ${err}`

                }
                this._ipcMainModule.sender.send('barcode', res)
            })
        }

    }

    async reAsignedConstructor(){
        this._ipcMainModule = this.eventIpc
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


}

