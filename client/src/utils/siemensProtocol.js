const nodes7 = require('nodes7');
export class s7 {
    constructor(server = "", port= 102, rack = 0, slot = 1 , variables= {}) {
        this.server = server
        this.port = port
        this.rack = rack
        this.slot = slot
        this.variables = variables

        this.connParams = {
            host:  this.server,
            port: this.port,
            rack: this.rack,
            slot: this.slot,
            debug: false
        };
        // this.connParams = {
        //     host: '192.168.5.99',
        //     port: 102,
        //     rack: 0,
        //     slot: 1,
        //     debug: false
        // };

        //
        // this.variables = {
        //     rCiezarBruttoW10: 'DB8,DINT82',
        //     //bruttoW10: 'DB8,DINT82',
        //     BeginW10: 'DB8,X86.0',
        //     Barcode: 'DB8,X86.1',
        //     IsFullW10: 'DB8,X86.2',
        //     IsClosedw10: 'DB8,X86.3',
        //     EndLoadw10: 'DB8,X86.4',
        // };


        // this.variables = {
        //     rCiezarBruttoW10: 'DB8,DINT82', //"DB8.DBD82"  -> 4 bytes
        //     WagaZadanaW10: 'DB11,DINT60', //"DB11.DBD60"
        //     BeginW10: 'DB8,X7.2', // DB8.DBX7.2 // bit
        //     Barcode: 'DB8,X87.4', // DB8.DBX7.4 // bit
        //     IsFullW10: 'DB6,X88.1', // DB6.DBX88.1
        //     IsClosedw10: 'DB8,X9.5', // DB8.DBX9.5
        //     EndLoadw10: 'DB18,X0.1', // "DB18.DBX0.1
        // };


        this.conn = new nodes7
    }

    async connectAndReadAll(){
        return new Promise((resolve, reject)=>{
            this.conn.initiateConnection(this.connParams, (err)=>{
                if (typeof(err) !== "undefined"){
                    console.log("Error connect")
                    this.conn.connectionReset()

                    resolve({error: "error connect", connect: false})
                }
                this.conn.setTranslationCB((tag)=> { return this.variables[tag]; });

                this.conn.addItems(Object.keys( this.variables));
                this.conn.readAllItems((err, values)=>{
                    if (err) {
                        console.log("error input params")
                        this.conn.connectionCleanup()

                        resolve({error: "error input params", connect: true})
                    }
                    values.connect = true
                    values.error = false
                    resolve(values)
                });
            });
        })
    }


    async closeConnection(){
        return new Promise((resolve, reject)=>{
            this.conn.dropConnection(()=>{
                //this.conn.connectionCleanup()
                resolve(true)
            })
        })

    }


    async connectAndWrite(arg, value){
        return new Promise((resolve, reject)=>{
            this.conn.initiateConnection(this.connParams, (err)=>{
                if (typeof(err) !== "undefined"){
                    this.conn.connectionCleanup()
                    resolve({write: false, connect: false, error: "error connect"})
                }
                this.conn.setTranslationCB((tag)=> { return this.variables[tag]; });

                this.conn.addItems(Object.keys( this.variables));
                this.conn.writeItems(arg, value,(err)=>{
                    if (err) {
                        this.conn.connectionCleanup()
                        resolve({write: false, connect: true, error: "error write params"})
                    }
                    resolve({write: true, connect: true, error: false})
                });
            });
        })
    }



}