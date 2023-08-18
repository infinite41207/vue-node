const Modbus = require('modbus-serial')

export class ModbusRead {

  constructor(ip, port, register, parseFunc) {
    this.ip = ip;
    this.port = port;
    this.client = new Modbus();
	this.register = register
	this.parseFunc = parseFunc
  }

  async modbusConnect() {
    return new Promise((resolve, reject) => {
      this.client
        .connectTCP(this.ip, { port: this.port })
        .then(() => {
          console.log('Connected to Modbus TCP device.')
          resolve(true)
        })
        .catch((error) => {
          console.log(`Error connecting to Modbus TCP device: ${error}`)
          resolve(false)
        })
    })
  }

  async readHoldingRegisters() {
    return new Promise((resolve, reject) => {
      // Отримання значень регістрів

      this.client.readHoldingRegisters(this.register, 1)
        .then((data) => {
          const parseData = this.parseFunc(data.data)
          console.log("parseData:", parseData)
          resolve ({ weight: parseData, connect: true })

        })
        .catch((error) => {
          console.log(`Error reading data: ${error}`)
          resolve(false)
        })
    })
  }

  closeConnection() {
    this.client.close()
  }

  parseData(inData) {
    var weight_with_reg = inData[0]
    var clear_tail = 0b00000000000000001111111111111111
    var LE = weight_with_reg << 8
    var BE = weight_with_reg >> 8
    var str = (LE | BE) & clear_tail

    if (str >= 50000) {
      var LE_1 = weight_with_reg & 0b0000000011111111
      var BE_1 = weight_with_reg >> 8

      var buf2 = Buffer.from([BE, LE])
      var out = buf2.readInt16LE(0)

      return out
    } else {
      return str
    }
  }
}

// // Підключення до пристрою
// modbus.connectTCP('10.10.15.203', { port: 502 })
//   .then(() => {
//     console.log('Connected to Modbus TCP device.');

//     // Отримання значень регістрів
//     modbus.readHoldingRegisters(0, 1)
//       .then((data) => {
//         console.log(data);
//         let parseData = parse(data)
//         console.log("parseData:", parseData)
//         modbus.close();
//       })
//       .catch((error) => {
//         console.log(`Error reading data: ${error}`);
//       });

//     // Відключення від пристрою

//     console.log('Connection closed.');
//   })
//   .catch((error) => {
//     console.log(`Error connecting to Modbus TCP device: ${error}`);
//   });
