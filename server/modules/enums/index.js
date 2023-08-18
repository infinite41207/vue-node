module.exports.CUSTOM_STATE_OF_GOODS = ['EU', 'NonEU']
module.exports.DATA_TYPES = ['number', 'date', 'boolean', 'text', 'enum', 'object']
module.exports.DELIVERY_NOTE_STATE = ['OnBrutto', 'OnTare', 'Returns', 'Closed', 'ToApproved']
module.exports.ORDER_STATE = ['Open', 'Closed', 'Deleted', 'ToClarify', 'ForAcceptance', 'Activated']
module.exports.DISPOSITION_STATE = [
  'Active',
  'Closed',
  'Stoped',
  'Deleted',
  'OnTheWay',
  'ForAcceptance',
  'ToClarify',
  'ParkingEntry',
  'Accepted',
  'ToBeImplemented',
  'ToClarifySecurity',
  'NaTerminalu',
  'ParkingDeparture',
  'OnWarehouse',
  'ToClarifyWarehouse',
  'FirstWeighing',
  'SecondWeighing',
  'Loaded',
  'Unloaded',
  'End',
  'ToClarifyWagowy',
  'ToClarifyDisponent',
  'AddWeight',
  'RemoveWeight',
  'PulledOutOfParking',
  'ParkingExit',
  'ZeroDN',
]
module.exports.TYPE_OF_OPERATION = ['Shipment', 'Receipt', 'Reweighing', 'DirectVariantShipment', 'DirectVariantReceipt', 'Resigning', 'Relocation']
module.exports.TYPE_OF_DOCUMENT = ['Automobile', 'Railway', 'Water', 'Internal']
module.exports.TYPE_OF_DISPOSITION = ['Loading', 'Unloading']
module.exports.TYPE_OF_SCALE = ['Gross', 'Tara', 'GrossAndTara', 'Bunker', 'WithoutWeighing']
module.exports.INVENTORY_TYPE = ['Inventory', 'NonInventory']
module.exports.TRANSPORT_TYPE = ['Carriage', 'Car', 'Trailer']
module.exports.CAR_QUEUE_STATUS = ['OnTheWay', 'EntryReservedWithBuffer', 'Accepted', 'EntryReserved', 'EntryAllowed', 'ParkingExit', 'TerminalExit', 'Deleted']
module.exports.RESEARCH_RESULT = ['Positive', 'Negative']
module.exports.WORK_SHIFTS = ['First', 'Second', 'Third']
module.exports.BUSINESS_PROCESS_ROUTE_POINT = ['Brutto', 'Tare', 'BruttoShipment', 'TareShipment']
module.exports.ORIENTATION = ['Portrait', 'Landscape']
module.exports.REPORT_PERIOD_TYPE = ['date', 'period']
module.exports.TEXT_ALIGNS = ['left', 'right', 'center']
module.exports.PROTOCOL_SCALE = ['Mechanical', 'IoT', 'TCP/IP', 'Modbus', 'COM', 'S7']
module.exports.PROTOCOL_SCALE_PARSE = ['ToledoSimple', 'ToledoSimpleTwice', 'ToledoModbus']
module.exports.REPORT_OPERATORS = ['=', '!=', 'inList', 'notInList', 'like', 'notLike', '<=', '<', '>', '>=']
module.exports.REPORT_FUNCS = ['min', 'max', 'sum', 'awerage']
module.exports.VERSIONING_METHODS = ['create', 'update', 'confirm', 'all']
module.exports.NAVIGATION_PLACINGS = ['general', 'usual', 'other']
module.exports.CALENDAR_TYPE = ['private', 'shared', 'common']
module.exports.CONTACT_TYPES = ['phone', 'email', 'messenger', 'skype', 'social']
module.exports.TYPE_OF_MOVEMENT = ["Receipt", "Expense"]
module.exports.TYPE_OF_PAYMENT = ["Cash", "Bank"]