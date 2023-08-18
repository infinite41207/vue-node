export default {
  // User settings
  allUsers: '/user',
  userDetails: '/user',
  addUser: '/user',
  updateUser: '/user',
  deleteUser: '/user',

  allrolegroups: '/allrolegroups',
  createRoleGroup: '/rolegroup',
  updateRoleGroup: '/rolegroup',
  getRoleGroup: '/rolegroup',
  deleteRoleGroup: '/rolegroup',
  userRoles: '/user_roles',
  defaultRoles: '/default_roles',

  // Reclamation module
  createreclamation: '/createreclamation',
  getallreclamations: '/getallreclamations',
  getreclamation: '/getreclamation',
  updatereclamation: '/updatereclamation',
  deletereclamation: '/deletereclamation',

  createbpdefinition: '/bp_definition',
  getallbpdefinitions: '/bp_definitions',
  getbpdefinition: '/bp_definition',
  updatebpdefinition: '/bp_definition',
  deletebpdefinition: '/bp_definition',

  createbpexemplar: '/bp_exemplar',
  getallbpexemplars: '/bp_exemplars',
  getbpexemplar: '/bp_exemplar',
  updatebpexemplar: '/bp_exemplar',
  deletebpexemplar: '/bp_exemplar',

  createbphistory: '/bp_history',
  getallbphistories: '/bp_histories',
  getbphistory: '/bp_history',

  // Calendars
  getAllCalendars: '/calendars',
  createCalendar: '/calendars',
  updateCalendar: '/calendars',
  deleteCalendar: '/calendars',

  // Calendar Events
  createCalendarEvent: '/calendar_events',
  updateCalendarEvent: '/calendar_events',
  getAllCalendarEvents: '/calendar_events',
  deleteAllCalendarEvent: '/calendar_events',

  allReclamationSubjects: '/getallreclamationsubjects',
  createReclamationSubject: '/createreclamationsubject',
  getAllReclamationSubjects: '/getallreclamationsubjects',
  getReclamationSubjectDetails: '/getreclamationsubjectdetails/:id',
  updateReclamationSubject: '/updatereclamationsubject',
  deleteReclamationSubject: '/deletereclamationsubject',

  allReclamationCosts: '/reclamationcosts',
  createReclamationCost: '/reclamationcost',
  getReclamationCostDetails: '/reclamationcost/:id',
  updateReclamationCost: '/reclamationcost',
  deleteReclamationCost: '/reclamationcost',

  createreclamationstatusgroup: '/createreclamationstatusgroup',
  getallreclamationstatusgroups: '/getallreclamationstatusgroups',
  getreclamationstatusgroup: '/getreclamationstatusgroup',
  updatereclamationstatusgroup: '/updatereclamationstatusgroup',
  deletereclamationstatusgroup: '/deletereclamationstatusgroup',

  createreclamationstatus: '/createreclamationstatus',
  getallreclamationstatuses: '/getallreclamationstatuses',
  getreclamationstatus: '/getreclamationstatus',
  updatereclamationstatus: '/updatereclamationstatus',
  deletereclamationstatus: '/deletereclamationstatus',

  createreclamationreason: '/createreclamationreason',
  getallreclamationreasons: '/getallreclamationreasons',
  getreclamationreason: '/getreclamationreason',
  updatereclamationreason: '/updatereclamationreason',
  deletereclamationreason: '/deletereclamationreason',

  createdeliverytype: '/delivery_type',
  getalldeliverytypes: '/delivery_types',
  getdeliverytype: '/delivery_type',
  updatedeliverytype: '/delivery_type',
  deletedeliverytype: '/delivery_type',

  createcostarticle: '/cost_article',
  getallcostarticles: '/cost_articles',
  getcostarticle: '/cost_article',
  updatecostarticle: '/cost_article',
  deletecostarticle: '/cost_article',

  getAllCRStatuses: '/cr_status',
  getCRStatus: '/cr_status',
  createCRStatus: '/cr_status',
  updateCRStatus: '/cr_status',
  deleteCRStatus: '/cr_status',

  getAllCRTags: '/cr_tag',
  getCRTag: '/cr_tag',
  createCRTag: '/cr_tag',
  updateCRTag: '/cr_tag',
  deleteCRTag: '/cr_tag',

  getAllEmails: '/email',
  getMailboxes: '/mailbox',
  getEmailByPk: '/email',
  getEmailBySeq: '/email_seq',
  getEmailByUid: '/email_uid',
  getIncomingEmailAttachment: '/incoming_email_attachment',

  createreclamationtype: '/createreclamationtype',
  getallreclamationtypes: '/getallreclamationtypes',
  getreclamationtype: '/getreclamationtype',
  updatereclamationtype: '/updatereclamationtype',
  deletereclamationtype: '/deletereclamationtype',

  createreclamationperpetrator: '/reclamation_perpetrator',
  getallreclamationperpetrators: '/reclamation_perpetrators',
  getreclamationperpetrator: '/reclamation_perpetrator',
  updatereclamationperpetrator: '/reclamation_perpetrator',
  deletereclamationperpetrator: '/reclamation_perpetrator',

  createreclamationexecutiontype: '/createreclamationexecutiontype',
  getallreclamationexecutiontypes: '/getallreclamationexecutiontypes',
  getreclamationexecutiontype: '/getreclamationexecutiontype',
  updatereclamationexecutiontype: '/updatereclamationexecutiontype',
  deletereclamationexecutiontype: '/deletereclamationexecutiontype',

  createreclamationdecision: '/createreclamationdecision',
  getallreclamationdecisions: '/getallreclamationdecisions',
  getreclamationdecision: '/getreclamationdecision',
  updatereclamationdecision: '/updatereclamationdecision',
  deletereclamationdecision: '/deletereclamationdecision',

  createreclamationproductionorder: '/createreclamationproductionorder',
  getallreclamationproductionorders: '/getallreclamationproductionorders',
  getreclamationproductionorder: '/getreclamationproductionorder',
  updatereclamationproductionorder: '/updatereclamationproductionorder',
  deletereclamationproductionorder: '/deletereclamationproductionorder',

  createreclamationemail: '/createreclamationemail',
  getallreclamationemails: '/getallreclamationemails',
  getreclamationemail: '/getreclamationemail',
  updatereclamationemail: '/updatereclamationemail',
  deletereclamationemail: '/deletereclamationemail',

  createreclamationitem: '/createreclamationitem',
  getallreclamationitems: '/getallreclamationitems',
  getreclamationitem: '/getreclamationitem',
  updatereclamationitem: '/updatereclamationitem',
  deletereclamationitem: '/deletereclamationitem',
  deleteallreclamationitems: '/deleteallreclamationitems',

  createreclamationhistoryevent: '/createreclamationhistoryevent',
  getallreclamationhistoryevents: '/getallreclamationhistoryevents',
  getreclamationhistoryevent: '/getreclamationhistoryevent',
  updatereclamationhistoryevent: '/updatereclamationhistoryevent',
  deletereclamationhistoryevent: '/deletereclamationhistoryevent',

  uploadReclamationFile: '/reclamation/upload_files',
  getReclamationFiles: '/reclamation/subject_files',
  deleteReclamationFiles: '/reclamation/file',

  createfirm: '/createfirm',
  getallfirms: '/getallfirms',
  getmainfirm: '/getmainfirm',
  getfirm: '/getfirm',
  updatefirm: '/updatefirm',
  deletefirm: '/deletefirm',

  getAllDocNumerators: '/doc-numerator',
  getDocNumerator: '/doc-numerator',
  createDocNumerator: '/doc-numerator',
  updateDocNumerator: '/doc-numerator',
  deleteDocNumerator: '/doc-numerator',

  createsalespoint: '/createsalespoint',
  getallsalespoints: '/getallsalespoints',
  getsalespoint: '/getsalespoint',
  updatesalespoint: '/updatesalespoint',
  deletesalespoint: '/deletesalespoint',

  createEmailTemplate: '/email_template',
  getAllEmailTemplates: '/email_template',
  getEmailTemplate: '/email_template',
  updateEmailTemplate: '/email_template',
  deleteEmailTemplate: '/email_template',

  // Order URLS
  getOrderByStatus: '/orders/orderList',
  getSingleOrderById: '/orders/order?orderId=',
  confirmOrder: '/orders/confirmOrder',
  fulfillOrder: '/orders/markItemAsFulfilling',
  editFulfillOrder: '/orders/updateOrderFulfillmentDetails',
  markShipped: '/orders/markItemAsShipped',
  editShipped: '/orders/updateShipmentDetails',
  markDelivered: '/orders/markItemAsDelivered',
  editDelivered: '/orders/updateDeliveryDetails',
  cancelOrder: '/orders/cancelOrder',

  // Tariff URLs
  allTariffs: '/referenceData/tariffList',
  editTariff: '/referenceData/tariff',
  addTariff: '/referenceData/tariff',

  // Comments
  postComment: '/orders/addComment',
  deleteComment: '/orders/deleteComment',
  putComment: '/orders/editComment',

  // Categories
  allCategories: '/referenceData/productCategoryList',
  editCategory: '/referenceData/productCategory',
  addCategory: '/referenceData/productCategory',

  // Featured
  getAllFeatures: '/ui/featuredList',
  featuredUrl: '/ui/featured',

  // Counterparties
  getAllCustomers: '/counterparties',

  // Employees
  getAllEmployees: '/employee',

  // Vehicles
  getAllVehicles: '/vehicle',

  // Reports
  getAllReportVariants: '/report_variants_list',
  getReportVariant: '/report_variant/',
  writeReportVariant: '/write_report_variant',
  renameReportVariant: '/rename_report_variant',

  getDataReportOrderList: '/report_order_list',
  getDataReportReclamationList: '/report_reclamation_list',
  getDataReportEnovaSalesList: '/report_enovasales_list',

  // user settings
  allUserSettingItems: '/user_setting_item',
  getUserSettingItem: '/user_setting_item',
  createUserSettingItem: '/user_setting_item',
  updateUserSettingItem: '/user_setting_item',
  deleteUserSettingItem: '/user_setting_item',

  allUserSettings: '/user_settings',
  writeUserSettings: '/user_settings',
  findUserSettings: '/user_setting',

  // dispositions
  findFirstWeighting: '/disposition_first_weighting',
  findSecondWeighting: '/disposition_second_weighting',

  // Sync 1C data
  runSync1CData: '/run_sync_1c_data',

  // delivery notes

  createDeliveryNote: '/deliveryNote',
}
