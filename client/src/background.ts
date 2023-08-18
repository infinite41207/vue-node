'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { machineIdSync } from 'node-machine-id'
const path = require('path')
import { SerialCom } from '../src/utils/serial-com'
import { ProtocolTcp } from '../src/utils/tcpIp'
import { ModbusRead } from '../src/utils/modbus'
import * as ModuleParse from '../src/utils/parsers'

import { s7 } from '../src/utils/siemensProtocol'

import { Posnet } from '../src/utils/serial-Posnet'

ipcMain.on('getMachineId', (event, data) => {
  const currentMachineId = machineIdSync()
  event.reply('reply', currentMachineId)
})

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    await win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  await createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

const SERIALPORT: any = new SerialCom('eventIPC')

//Close serial port
ipcMain.handle('closeSerialPort', async (event, args) => {
  if (SERIALPORT) {
    await SERIALPORT.closeCom()
    SERIALPORT.eventIpc = null
    await SERIALPORT.reAsignedConstructor()
    return true
  }
})

ipcMain.on('getBarcode', async function (event, data) {
  SERIALPORT.eventIpc = event
  await SERIALPORT.reAsignedConstructor()
  await SERIALPORT.init()
  await SERIALPORT.openCom()
})

//GET ALL LIST
ipcMain.handle('getComList', async (event, args) => {
  const listPorts = await SERIALPORT.getAllPort()
  if (listPorts.length) {
    return listPorts
  } else {
    return []
  }
})

//Set list port
ipcMain.handle('setListenPort', async (event, args) => {
  SERIALPORT.serialCom = args
  return SERIALPORT.serialCom
})

//GET current COM
ipcMain.handle('getListenPort', async (event, args) => {
  return SERIALPORT.serialCom
})

//GET current COM
ipcMain.handle('getSerialStatus', async (event, args) => {
  //console.log("getSerialStatus: ", SERIALPORT.status)
  return SERIALPORT.status
})

//Set list port
ipcMain.handle('getSerialIdClient', async (event, args) => {
  return machineIdSync()
  //return "1358def1fa367ad021760510ac56bb00089a01fdbe521c83eb100f08e41f54ed"
})

//reConnectPort port
ipcMain.handle('reConnectPort', async (event, args) => {
  await SERIALPORT.delay(2000)
  await SERIALPORT.closeCom()
  await SERIALPORT.init()
  await SERIALPORT.openCom()
  return true
})

//Open port list port
ipcMain.handle('openComport', async (event, args) => {
  await SERIALPORT.init()
  await SERIALPORT.openCom()
  return true
})

ipcMain.handle('getWeightFromCom', async (event, args) => {
  const com = args.com
  const cmd = args.cmd
  return { weight: 0 }
})

//Get weight from Modbus
ipcMain.handle('getWeightFromModbus', async (event, args) => {
  const server = args.server
  const port = args.port
  const register = args.register
  const parserType = args.parserType
  let returnResult = { weight: 0, connect: false }

  const modbusClass = new ModbusRead(server, port, register, ModuleParse.modbusParse)
  const connection = await modbusClass.modbusConnect().catch(console.error)
  if (connection) {
    const readData = await modbusClass.readHoldingRegisters()
    if (readData) {
      returnResult = readData
    }
    modbusClass.closeConnection()
  }
  return returnResult
})

//Get weight from TCP/ip 'ToledoSimple', 'ToledoSimpleTwice', 'ToledoModbus'
ipcMain.handle('getWeightFromModbusTcpIp', async (event, args) => {
  const server = args.server
  const port = args.port
  const parserType = args.parserType
  const command = args.command
  let returnResult = { weight: 0, connect: false }

  if (parserType === 'ToledoSimple') {
    const tcpClass = new ProtocolTcp(server, port, command, ModuleParse.simpleParse)
    const connection = await tcpClass.connectToScale().catch(console.error)
    //console.log("connection TcpIp", connection);
    if (connection) {
      const sendCmd = await tcpClass.sendCmdOnScaleOnce()
      if (sendCmd) {
        returnResult = sendCmd
      }
      tcpClass.closeConnection()
    }
  } else if (parserType === 'ToledoSimpleTwice') {
    const tcpClass = new ProtocolTcp(server, port, command, ModuleParse.simpleParseTwice)
    const connection = await tcpClass.connectToScale().catch(console.error)
    //console.log("connection TcpIp", connection);
    if (connection) {
      const sendCmd = await tcpClass.sendCmdOnScaleTwiceSimple()
      if (sendCmd) {
        returnResult = sendCmd
      }
      tcpClass.closeConnection()
    }
  }
  return returnResult
})

//Print Page
ipcMain.handle('printPage', async (event, args) => {
  let resultPrint = false
  const pageSize = args.paramsForPrint.pageSize
  const orientation = args.paramsForPrint.orientation === 'Landscape' ? true : false
  const numberOfCopies = args.paramsForPrint.numberOfCopies
  const printerName = args.paramsForPrint.printerName

  const options = {
    silent: true,
    printBackground: false,
    deviceName: printerName,
    color: false,
    margin: {
      marginType: 'printableArea',
    },
    landscape: orientation, //альбомний режим
    //pageRanges: [{ from: 0, to: 0 }],
    pagesPerSheet: 1,
    collate: false,
    copies: numberOfCopies || 1, // кількість копій
    dpi: {
      horizontal: 1200,
      vertical: 1200,
    },
    pageSize: pageSize || 'A5',
  }
  if (printerName == null) delete options.deviceName

  const browserWindow = BrowserWindow
  const win = browserWindow.getFocusedWindow() as BrowserWindow
  //const list = win.webContents.getPrinters()

  win.webContents.print(options, (success, failureReason) => {
    if (!success) {
      console.log(failureReason)
      return failureReason
    }
    resultPrint = true
    //console.log('Print Initiated')
  })
  return resultPrint
})

//Print list
ipcMain.handle('printList', async (event, args) => {
  const browserWindow = BrowserWindow
  const win = browserWindow.getFocusedWindow() as BrowserWindow
  const list = win.webContents.getPrinters()
  return list
})

ipcMain.handle('getWeightFromSiemens', async (event, args) => {
  const server = args.server
  const port = args.port // 102 || 8010
  const rack = args.rack // 0
  const slot = args.slot // 1
  const variables = args.variables // {weightW10: "DB8,DINT82"}

  let returnResult = { connect: false }

  const siemans = new s7(server, port, rack, slot, variables)
  const all = await siemans.connectAndReadAll()
  if (all.error) {
    returnResult = Object.assign(returnResult, all)
  } else {
    returnResult = all
  }
  const close = await siemans.closeConnection()
  return returnResult
})

ipcMain.handle('writeToSiemens', async (event, args) => {
  const server = args.server
  const port = args.port // 102 || 8010
  const rack = args.rack // 0
  const slot = args.slot // 1
  const variables = args.variables // {weightW10: "DB8,DINT82"}
  const writeItems = args.value // true, 1234567. false, 0
  const argForwriteAlias = Object.keys(args.variables)

  let returnResult: any = { connect: false }

  const siemans = new s7(server, port, rack, slot, variables)
  const all = await siemans.connectAndWrite(argForwriteAlias[0], writeItems)
  console.log('all', all)
  if (all.error) {
    //{error: "error connect", connect: false, write: false}
    returnResult = all
  } else {
    //{write: true, connect: true, error: ""}
    returnResult = all
    returnResult.error = ''
  }
  const close = await siemans.closeConnection()
  return returnResult
});


ipcMain.handle('prtintTest', async (event, args) => {
  const ttt = new Posnet();
  const init: any = await ttt.initSerialCom()
  if(init.error){
    return {init, info: 'error init COM'}
  }
  const openCom: any = await ttt.openCom()
  if (openCom.error){
    await ttt.closeCom()
    return {openCom, info: 'error open COM'}
  }
  try {
    const sendCMD: any = await ttt.printSalesSlip()
    await ttt.closeCom()
    return true
  }catch (e) {
    await ttt.closeCom()
    return false
  }
  return true
});


// const ttt = new Posnet();
// (async ()=>{
//   await ttt.printSalesSlip()
// })();
