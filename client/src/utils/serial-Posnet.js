import { ReadlineParser, SerialPort } from 'serialport'
import { rejects } from "assert";

const delimiter = Buffer.from([0x03]); //

const STX = Buffer.from([0x02]); //
const ETX = Buffer.from([0x03]); //
const TAB = Buffer.from([0x09]); // \t
const ZNAK = '#';

export class Posnet {
    constructor(serialCom = 'COM2') {
        this.serialComString = serialCom;
        this.PARSER = null
        this.SERIALPORT = null
        this.SERIALSTATUS = {
            code: 400,
            text: `${this.serialComString} close`
        }
        this.openPort = false

    }

    getAllPort() {
        return SerialPort.list();// [{}]

    }

    async initSerialCom() {
        let res = {}
        const list = await this.getAllPort();
        console.log("list com", list)
        if (list.length) {
            this.SERIALPORT = new SerialPort({
                path: this.serialComString,
                baudRate: 115200,
                dataBits: 8,
                stopBits: 1,
                parity: "none",
                autoOpen: false
            })
            const parser = this.SERIALPORT.pipe(new ReadlineParser({ delimiter: delimiter }))
            this.PARSER = parser;
            res = {
                com: this.serialComString,
                data: null,
                info: "The serial port is initialized",
                error: null,
                textError: null
            }

        } else {
            this.SERIALPORT = null
            res = {
                com: null,
                data: null,
                info: "Not fount serial Port",
                error: 400,
                textError: "Not fount serial Port"

            }
        }
        return res
    }

    async closeCom() {
        if (this.openPort) {
            this.SERIALPORT.close()
        }
    }

    async openCom() {
        return new Promise((resolve, reject) => {
            let res = {};
            this.SERIALPORT.open((err) => {
                console.log("openCom", err)
                if (err) {
                    res = {
                        com: this.serialComString,
                        data: null,
                        info: "error open port",
                        error: 400,
                        textError: err.message
                    }
                    this.SERIALSTATUS = {
                        code: 400,
                        text: `${this.serialComString} ${err}`
                    }
                    this.openPort = false
                    resolve(res);
                } else {
                    res = {
                        com: this.serialComString,
                        data: null,
                        info: "Port open",
                        error: null,
                        textError: null
                    }

                    this.SERIALSTATUS = {
                        code: 200,
                        text: `${this.serialComString} open`
                    }
                    this.openPort = true
                    resolve(res);
                }
            });
        })

    }


    getFiskalPrinterNumber() {
        return new Promise((resolve, reject) => {
            //[STX]getrealid[TAB]#CRC16[ETX]
            const cmd = [STX, Buffer.from("getrealid"), TAB, Buffer.from(ZNAK,)];
            const forCRC = [Buffer.from("getrealid"), TAB]

            const newBuff = Buffer.concat(cmd);

            console.log("newbuff", newBuff);
            const CRC = this.crc16_ccitt(Buffer.concat(forCRC));
            console.log("CRC", CRC);
            const fullCmd = Buffer.concat([newBuff, CRC, ETX]);
            console.log("fullCmd", fullCmd);

            this.SERIALPORT.write(fullCmd, (error) => {
                if (error) {
                    reject(error);
                }
            });
            this.PARSER.on('data', (response) => {
                const wordsArray = response.split('\t');
                const id = wordsArray[3].substring(2);
                resolve(id);
            });
        });
    }

    crc16_ccitt(buffer) {
        console.log("crc16_ccitt 1", buffer)
        const POLY = 0x1021;
        let crc = 0xFFFF;

        for (let i = 0; i < buffer.length; i++) {
            const byte = buffer[i];
            if (byte === 0x02 || byte === 0x03 || byte === 0x23) continue;
            crc ^= byte << 8;
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) {
                    crc = (crc << 1) ^ POLY;
                } else {
                    crc <<= 1;
                }
            }
        }

        const CRC = Buffer.alloc(2);
        CRC.writeUInt16BE(crc & 0xFFFF, 0);
        console.log("crc16_ccitt end", CRC)
        return CRC;
    }


    async printSalesSlip() {
        // [STX]trinit[TAB]bm0[TAB]#CRC16[ETX]
        // [STX]trline[TAB]naSok pomidorowy[TAB]vt1[TAB]pr350[TAB]il1[TAB]#CRC16[ETX]
        // [STX]trend[TAB]to350[TAB]op0[TAB]om0[TAB]fe0[TAB]#CRC16[ETX]
        // [STX]trftrln[TAB]id2 na987[TAB]#CRC16[ETX]
        // [STX]trftrln[TAB]id15[TAB]naJan Kowalski[TAB]#CRC16[ETX]
        // [STX]trftrend[TAB]#CRC16[ETX]

        try {
            const trinit = [];
            const trline = [];
            const trend = [];
            const trftrln = [];
            const trftrln2 = [];
            const trftrend = [];

            // ElsIf Not ValueIsFilled(PaymentForm) And PaymentFormType = PredefinedValue("Enum.PaymentFormTypes.Card") Then
            // PaymentFormNumber = 2;
            // PaymentFormString = "";
            trinit.push('trinit')
            trinit.push('\t')
            trinit.push('bm0')
            trinit.push('\t')
            const cmd1 = await this.sendCommandToPosnet(trinit);
            console.log("cmd1", cmd1)

            //CommandsArray.Add("trline	na" + Row.Item + "	il" + CalculateQuantity + "	vt"+VATIndex + "	pr" + Format(Price * 100, "NG=0") + DiscountsData);
            trline.push('trline')
            trline.push('\t')
            trline.push('naTestPrint 1')
            trline.push('\t')
            trline.push('il1')
            trline.push('\t')
            trline.push('vt2')
            trline.push('\t')
            trline.push('pr333')
            trline.push('\t')
            const cmd2 = await this.sendCommandToPosnet(trline);
            console.log("cmd2", cmd2)

            trend.push('trend')
            trend.push('\t')
            trend.push('to350')
            trend.push('\t')
            trend.push('op0')
            trend.push('\t')
            trend.push('om0')
            trend.push('\t')
            trend.push('fe0')
            trend.push('\t')
            const cmd3 = await this.sendCommandToPosnet(trend);
            console.log("cmd3", cmd3)

            //[STX]trftrln[TAB]id2 na987[TAB]#CRC16[ETX]
            trftrln.push('trftrln')
            trftrln.push('\t')
            trftrln.push('id2 na987')
            trftrln.push('\t')
            const cmd4 = await this.sendCommandToPosnet(trftrln);
            console.log("cmd4", cmd4)

            //[STX]trftrln[TAB]id15[TAB]naJan Kowalski[TAB]#CRC16[ETX]
            trftrln2.push('trftrln')
            trftrln2.push('\t')
            trftrln2.push('id15')
            trftrln2.push('\t')
            trftrln2.push('naJan Kowalski')
            trftrln2.push('\t')
            const cmd5 = await this.sendCommandToPosnet(trftrln2);
            console.log("cmd5", cmd5)

            // [STX]trftrend[TAB]#CRC16[ETX]
            trftrend.push('trftrend')
            trftrend.push('\t')
            const cmd6 = await this.sendCommandToPosnet(trftrend);
            console.log("cmd6", cmd5)
        } catch (e) {
            console.error("Posnet", e)
        }

    }

    sendCommandToPosnet(commandsArray) {
        return new Promise((resolve, reject) => {

            for (let i = 0; i < commandsArray.length; i++) {
                commandsArray[i] = Buffer.from(commandsArray[i])
            }
            const forCrc = commandsArray;
            const CRC = this.crc16_ccitt(Buffer.concat(forCrc));
            console.log("CRC", CRC);
            console.log("commandsArray", commandsArray);

            const cmd = [STX, Buffer.concat(commandsArray), Buffer.from(ZNAK), CRC, ETX];
            console.log("cmd", cmd);
            const fullCmd = Buffer.concat(cmd);
            console.log("fullCmd", fullCmd);

            this.SERIALPORT.write(fullCmd, (error) => {
                if (error) {
                    reject(error);
                }
            });
            this.PARSER.on('data', (response) => {
                resolve(response);
            });
            resolve(fullCmd)
        });
    }




}

