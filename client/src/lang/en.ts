export default {
  route: {
    main: 'Home',
    dashboard: 'Dashboard',
    sales: 'Sales',
    tasks: 'Tasks',
    salesOrders: 'Counterparties orders',
    products: 'Products',
    counterparties: 'Counterparties',
    reclamations: 'Reclamations',
    reclCatalogs: 'Catalogs',
    reclSubjects: 'Orders subjects',
    statusGroups: 'Statuses groups',
    reclStates: 'Orders statuses',
    reclTypes: 'Orders types',
    reclPerpetrators: 'Reclamation perpetrators',
    reclExecutions: 'Executions',
    reclReasons: 'Reclamation reasons',
    reclDecisions: 'Decisions',
    settings: 'Settings',
    firms: 'Firms',
    salesPoints: 'Sales points',
    users: 'Users',
    usersList: 'Users list',
    accessGroups: 'Access groups',
    otherSettings: 'Other settings',
    administration: 'Administration',
    emailTemplates: 'Email templates',
    numerators: 'Document numerators',
    executors: 'Executors',
    executorRoles: 'Executor roles',
    exchangeObjects: 'Objects to exchange',
    taskTemplates: 'Tesk templates',
    customerRequests: 'Customer requests',
    crStatuses: 'Customer request statuses',
    mailbox: 'Mailbox',
    salesOrder: 'Zamówienie klienta',
    customerRequest: 'Zapytanie ofertowe',
    newEmail: 'New e-mail',
    emailDetails: 'E-mail',
    task: 'Task',
    product: 'Product detail',
    customer: 'Customer detail',
    accessGroup: 'Access group',
    user: 'User',
    executor: 'Executor',
    executorRole: 'Executor role',
    taskTemplate: 'Task template',
    reclamation: 'Reclamation',
    reclamationStatistic: 'Reclamation statistic',
    emailAccounts: 'E-mail accounts',
    emailAccount: 'E-mail account',
    formBuilder: 'Form builder',
  },
  navbar: {
    logOut: 'Log Out',
    clearAll: 'Clear all',
    newNotes: 'New notifications',
    checkAll: 'Check all',
    hello: 'Hello!',
  },
  login: {
    username: 'Username',
    usernamePh: 'Enter your username',
    invalidLogin: 'User Email or Password invalid',
    unexpectedError: 'An unexpected error has occurred, try again',
    password: 'Password',
    passwordPh: 'Enter your password',
    forgotPassword: 'Forgot your password?',
    logIn: 'Log In',
    noHaveAccount: "Don't have an account?",
    register: 'Register now',
    rememberMe: 'Remember me',
  },
  register: {
    title: 'User registration',
    titleDescription: 'You do not have an account? Sign up, it will take less than a minute',
    firstLastName: 'Name and surname',
    enterDetailsPh: 'Enter your details',
    email: 'Email',
    emailPh: 'Enter your email',
    terms: 'Terms of use of the portal',
    register: 'Register',
    haveAccount: 'Already have an account?',
    confirm: 'Your account is registered successfully',
    sendTo: 'A email has been send to',
    emailCheck: 'Please check for an email from company and click on the included link to reset your password.',
    backHome: 'Back to Home',
    emailConfirmed: 'Email confirmed',
    emailNotConfirmed: 'Email could not be confirmed',
    resendYourEmail: 'Resend your email',
    enterValidEmail: 'Enter a valid email address',
    enterNewPassword: 'Enter a new password',
    enterPasswordLimit: 'Enter at least 7 characters.',
    reenterPassword: 'Re-enter the password',
    reenterPasswordError: 'It should match the password entered.',
    reenterEmail: 'Re-enter your email for reset link',
    resendEmail: 'Resend Email',
    canResetPasswordMsg: 'You can now change your password.',
    resetPasswordLate: 'Looks like you are a little too late. Please try resending the email.',
    resetPasswordError: 'There was an error fulfilling your request. Please try resending the reset information.',
  },
  customerRequest: {
    title: 'Zapytanie oferty',
    new: 'Nowe zapytanie oferty',
    newVersion: 'Nowa wersja zapytania oferty',
    edit: 'Edycja zapytania oferty nr ',
    presentation: 'Zapytanie oferty nr {0} od {1}',
    createNew: 'Utwórz zapytanie',
    editStatus: 'Zmiana statusu',
    addComment: 'Nowy kommentarz',
    editResult: 'Edycja wyniku',
    msg: {
      selectItemFirst: 'Wybierz najpierw zapytanie oferty!',
      return: 'Zapytanie oferty zostanie przywrócone!',
      delete: 'Zapytanie oferty zostanie zaznaczone do usunięcia!',
      orderAvailable: 'Zapytanie oferty z taką referencja już istnieje: {0}',
      emptyCustomer: 'Niewypełniony klient!',
      noWrite: 'Zapytanie oferty musi być zapisane!',
    },
  },
  order: {
    title: 'Customers orders',
    objectTitle: 'Order',
    new: 'New order',
    presentation: 'Order nr {0} at {1}',
    createTask: 'Create task',
    msg: {
      selectOrderFirst: 'Select order first!',
      return: 'The order will be rolled over',
      delete: 'The order will be marked for deletion!',
      orderAvailable: 'An order with such reference already exists: {0}',
      confirmRemoveProduct: 'You really want to remove this product?',
      emptyCustomer: 'Customer not filled!',
      writeOrder: 'The order must be saved!',
    },
    status: {
      OFERTA: 'Offer',
      NEW: 'New order',
      CONFIRMED: 'Confirmed',
      READY_FOR_PRODUCTION: 'Ready for production',
      CANCELED: 'Canceled',
      CLOSED: 'Closed',
    },
    deliveryMethods: {
      STANDARD: 'Standard',
      UNTIL_CERTAIN_DATE: 'Until certain date',
      ON_CERTAIN_DATE: 'On certain date',
      VIP: 'VIP',
    },
    packageMaterial: {
      Karton: 'Carton',
      Folia: 'Foil',
    },
    enterReference: 'Enter a reference',
    enterProject: 'Enter project name',
    enterDeliveryMethod: 'Select the type of delivery',
    enterMaterial: 'Choose material',
    shipmentDays: 'Shipment days: ',
    roadDays: 'Road days: ',
    deliveryDays: 'Delivery days: ',
    byOrderPeriod: 'According to the scope of the order',
    priceDetails: 'Price details',
  },
  importance: {
    NOT_SET: 'Not set',
    HIGHT: 'Hight',
    NORMAL: 'Normal',
    LOW: 'Low',
  },
  task: {
    executionReceive: 'Receive for execution',
    showExecuted: 'Show executed',
    showMyne: 'Show mine',
    description: 'Task description',
    executionResult: 'Task execution result',
    newTask: 'New task',
  },
  commands: {
    accept: 'Accept',
    search: 'Search',
    add: 'Add',
    clear: 'Clear',
    cancel: 'Cancel',
    ok: 'OK',
    writeAndClose: 'Write and close',
    write: 'Write',
    close: 'Close',
    addProduct: 'Add product',
    addExtraProduct: 'Add extra product',
    addFile: 'Add file',
    addToCalendar: 'Add to calendar',
    eventsList: 'List of events',
    select: 'Select',
    configProduct: 'Configure product',
    confirm: 'Confirm',
    confirmSelected: 'Confirm selection',
    confirmPrices: 'Confirm prices',
    calculate: 'Calculate',
    execute: 'Execute',
    createOrder: 'Create order',
    runAndClose: 'Run and close',
    send: 'Send',
    sendResult: 'Send result',
    resend: 'Resend',
  },
  common: {
    search: 'Search...',
    filter: 'Filter',
    modalTitle: 'Attention!',
    emptyField: '<empty>',
    mainData: 'Main',
    products: 'Products',
    files: 'Files',
    notEmptyField: 'This field cannot be empty',
    selectDate: 'Choose date',
    enterComment: 'Enter comment',
    enterQuantity: 'Enter quantity',
    total: 'Total',
    selectFileTitle: 'Choose file!',
    selectProductTitle: 'Choose product!',
    noSelectedFiles: 'No files selected',
    searchCustomer: 'Search a customer',
    double: 'Double',
    incorrectData: 'Incorrect data entered in the field!',
    from: 'from',
    to: 'to',
    noFound: '<not found>',
    selected: 'Selected',
    confirmSelected: 'Confirm selected',
    addinDimensions: 'Addin dimensions',
    numberOfPieces: 'Number of pieces',
    lengthWidth: 'Length/Width',
    height: 'Height',
    recalculation: 'Recalculation',
    active: 'Active',
    deactive: 'Deactive',
    dateAdded: 'Date added',
    productData: 'Produkt details',
    picturePath: 'Path to the picture',
    enterPictureName: 'Enter a picture name',
    describeProduct: 'Describe the product...',
    customerData: 'Customer data',
    erp: 'ERP',
    executorData: 'Executor data',
    executorRoleData: 'Executor role data',
    emptyExecutorList: 'Artist list is empty ...',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    executionToday: 'Execution today',
    taskTemplatesData: 'Task templates data',
    fillByTemplate: '-- Fill by template --',
    enterName: 'Enter name',
    selectImportance: 'Select importance',
    selectExecutorRole: 'Select executor role',
    selectExecutor: 'Select executor',
    history: 'History',
    yes: 'Yes',
    no: 'No',
  },
  weekDays: {
    Mo: 'Mo',
    Tu: 'Tu',
    We: 'We',
    Th: 'Th',
    Fr: 'Fr',
    Sa: 'Sa',
    Su: 'Su',
  },
  table: {
    sort: 'Nr',
    sortNumber: 'N',
    code: 'Code',
    number: 'Number',
    name: 'Name',
    article: 'Article',
    type: 'Type',
    customer: 'Customer',
    reference: 'Reference',
    createdAt: 'Created At',
    deliveryDate: 'Delivery date',
    shipmentDate: 'Shipment date',
    status: 'Status',
    author: 'Author',
    price: 'Price',
    sum: 'Sum',
    sumWithoutVAT: 'Sum without VAT',
    sumVAT: 'Sum VAT',
    sumWithVAT: 'Sum with VAT',
    currency: 'Currency',
    note: 'Note',
    paymentTerms: 'Terms of payment',
    project: 'Project',
    deliveryMethod: 'Delivery method',
    packageMaterial: 'Package material',
    comment: 'Comments',
    product: 'Product',
    description: 'Description',
    jOM: 'JOM',
    quantity: 'Quantity',
    discountPercent: 'Discount %',
    discountSum: 'Discount sum',
    fileSize: 'Size, kB',
    country: 'Country',
    email: 'Email',
    address: 'Address',
    phone: 'Phone',
    abbreviation: 'Abbreviation',
    actions: 'Actions',
    priceCode: 'Price code',
    executor: 'Executor',
    executionPeriod: 'Execution period',
    changeDate: 'Change date',
    user: 'User',
    nip: 'NIP',
    region: 'Region',
    pricesType: 'Prices type',
    customersGroup: 'Customers group',
    language: 'Language',
    executorName: 'Executor name',
    importance: 'Importance',
    executorRole: 'Executor role',
    contents: 'Contents',
    template: 'Szablon',
    base: 'Base',
    task: 'Task',
    category: 'Category',
    priority: 'Priority',
    postDate: 'Post date',
    topic: 'Topic',
    objectType: 'Object type',
    objectDescription: 'Object description',
    objectId: 'Object ID',
    changeType: 'Change type',
    sent: 'Sent',
    constructor: 'Constructor',
    const: 'Konstruktor',
    manager: 'Manager',
    commission: 'Commission, %',
    version: 'Version',
    orderNumber: 'Order number',
    isActive: 'Is active',
    title: 'Title',
    notes: 'Notes',
    startTime: 'Start time',
    endTime: 'End time',
  },
  configurator: {
    selectedParameters: 'Selected parameters',
    byNumber: 'by nr...',
    byName: 'by name / description ...',
  },
  settings: {
    title: 'Settings',
    lsbThemeDefault: 'Default',
    lsbThemeLight: 'Light',
    lsbThemeDark: 'Dark',
    lsbTypeFixed: 'Fixed',
    lsbTypeCondensed: 'Condensed',
    lsbTypeScrollable: 'Scrollable',
  },
  editTypes: {
    created: 'Created',
    edited: 'Edited',
    markedToDeleteRestore: 'Marked to delete / Restore',
    deleted: 'Deleted',
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All',
  },
  documentation: {},
  permission: {},
  guide: {},
  components: {
    historyOfChanges: 'History of changes.',
    relatedTasks: 'Related tasks.',
  },
  example: {},
  errorLog: {},
  excel: {},
  zip: {},
  pdf: {},
  theme: {
    leftSidebar: 'Left sidebar',
  },
  fm: {
    components: {
      fields: {
        input: 'Input',
        'b-input': 'BInput',
        'b-button': 'BButton',
        textarea: 'Textarea',
        number: 'Number',
        radio: 'Radio',
        checkbox: 'Checkbox',
        time: 'Time',
        date: 'Date',
        rate: 'Rate',
        color: 'Color',
        select: 'Select',
        switch: 'Switch',
        slider: 'Slider',
        text: 'Text',
        blank: 'Custom',
        fileupload: 'File',
        imgupload: 'Image',
        editor: 'Editor',
        cascader: 'Cascader',
        table: 'Sub-table',
        grid: 'Grid',
        'b-card': 'B-Card',
        tabs: 'Tabs',
        divider: 'Divider',
      },
      basic: {
        title: 'Basic Component',
      },
      advance: {
        title: 'Advance Component',
      },
      layout: {
        title: 'Layout',
      },
    },
    description: {
      containerEmpty: 'You can drag and drop the item from the left to add components',
      configEmpty: 'Please add a component',
      tableEmpty: 'You can drag and drop the item from the left to add components',
      uploadJsonInfo: 'There is the format of JSON below，you can overwrite it with you own JSON code',
    },
    message: {
      copySuccess: 'Copy Successed',
      validError: 'Form data validation failed',
    },
    actions: {
      import: 'Import JSON',
      clear: 'Clear',
      preview: 'Preview',
      json: 'Generate JSON',
      code: 'Generate Code',
      getData: 'Get Data',
      reset: 'Reset',
      copyData: 'Copy Data',
      cancel: 'Cancel',
      confirm: 'Confirm',
      addOption: 'Add Option',
      addColumn: 'Add Column',
      addTab: 'Add Tab',
      upload: 'Upload',
      add: 'Add',
    },
    config: {
      form: {
        title: 'Form',
        actions: 'Actions',
        functionName: 'Function name',
        functionDescription: 'Function description',
        dataSource: 'Data source',
        labelPosition: {
          title: 'Label Position',
          left: 'Left',
          right: 'Right',
          top: 'Top',
        },
        labelWidth: 'Label Width',
        size: 'Size',
        customClass: 'Custom Class',
      },
      widget: {
        title: 'Attribute',
        model: 'ID',
        name: 'Name',
        width: 'Width',
        height: 'Height',
        size: 'Size',
        labelWidth: 'Label Width',
        custom: 'Custom',
        placeholder: 'Placeholder',
        layout: 'Layout',
        block: 'Block',
        inline: 'Inline',
        contentPosition: 'Content Position',
        left: 'Left',
        right: 'Right',
        center: 'Center',
        showInput: 'Display Input Box',
        min: 'Minimum',
        max: 'Maximum',
        step: 'Step',
        multiple: 'Multiple',
        filterable: 'Searchable',
        allowHalf: 'Allow Half',
        showAlpha: 'Support transparency options',
        showLabel: 'Show lable',
        option: 'Option',
        staticData: 'Static Data',
        remoteData: 'Remote Date',
        remoteFunc: 'Remote Function',
        value: 'Value',
        label: 'Label',
        childrenOption: 'Sub-Option',
        defaultValue: 'Default Value',
        showType: 'Display type',
        isRange: 'Range Time',
        isTimestamp: 'Get time stamp',
        startPlaceholder: 'Placeholder of start time',
        endPlaceholder: 'Placeholder of end time',
        format: 'Format',
        limit: 'Maximum Upload Count',
        isQiniu: 'Upload with Qiniu Cloud',
        tokenFunc: 'A funchtin to get Qiniu Uptoken',
        imageAction: 'Picture upload address',
        tip: 'Text Prompt',
        action: 'Upload Address',
        defaultType: 'Data Type',
        string: 'String',
        object: 'Object',
        array: 'Array',
        number: 'Number',
        boolean: 'Boolean',
        search: 'search',
        tel: 'tel',
        date: 'date',
        time: 'time',
        range: 'range',
        color: 'color',
        integer: 'Integer',
        float: 'Float',
        url: 'URL',
        email: 'E-mail',
        password: 'Password',
        hex: 'Hexadecimal',
        gutter: 'Grid Spacing',
        columnOption: 'Column Configuration',
        span: 'Grid spans',
        justify: 'Horizontal Arrangement',
        justifyStart: 'Start',
        justifyEnd: 'End',
        justifyCenter: 'Center',
        justifySpaceAround: 'Space Around',
        justifySpaceBetween: 'Space Between',
        align: 'Vertical Arrangement',
        alignTop: 'Top',
        alignMiddle: 'Middle',
        alignBottom: 'Bottom',
        type: 'Type',
        default: 'Default',
        card: 'Tabs',
        borderCard: 'Border-Card',
        tabPosition: 'Tab Position',
        top: 'Top',
        bottom: 'Bottom',
        tabOption: 'Label Configuration',
        tabName: 'Tab Name',
        customClass: 'Custom Class',
        attribute: 'Attribute Action',
        dataBind: 'Data Binding',
        hidden: 'Hidden',
        readonly: 'Read Only',
        disabled: 'Disabled',
        editable: 'Text box is editable',
        clearable: 'Display Clear Button',
        arrowControl: 'Use the arrow for time selection',
        isDelete: 'Deletable',
        isEdit: 'Editable',
        showPassword: 'Display Password',
        validate: 'Validation',
        required: 'Required',
        patternPlaceholder: 'Fill in the regular expressions',
        newOption: 'New Option',
        tab: 'Tab',
        validatorRequired: 'Required',
        validatorType: 'Invaild format',
        validatorPattern: 'Unmatched pattern',
        showWordLimit: 'Show word limit',
        maxlength: 'Max length',
      },
    },
    upload: {
      preview: 'preview',
      edit: 'replace',
      delete: 'delete',
    },
  },
}
