export const ACTIVITY_MODES = {
   'WITH_YOU': 'WITH_YOU',
   'CAFE': 'CAFE',
   'QUEUE': 'QUEUE',
   'STORE': 'STORE'
};

export const ACTIVITY_SUB_MODE_LINKER = {
   'CAFE': ['SELF-SERVICE', 'WAITER-SERVICE'],
   'STORE': ['LARGE', 'MEDIUM', 'SMALL'],
 };

export const ACTIVITY_STATUS = {
    'QUEUE':'QUEUE',
    'PAYMENT_CALL':'PAYMENT_CALL',
    'WAIT_ITEM':'WAIT_ITEM',
    'WAIT_OP':'WAIT_OP',
    'DEFAULT': 'DEFAULT',
    'CLEAR_TABLE': 'CLEAR_TABLE',
    'STAND_CLOSE': 'STAND_CLOSE',
};

export const COMPANION_MODE_STATUS_LINKER = {
   'WITH_YOU': ['DEFAULT', 'QUEUE', 'WAIT_OP' ],
   'CAFE': ['QUEUE','PAYMENT_CALL','WAIT_ITEM','WAIT_OP','CLEAR_TABLE','STAND_CLOSE'],
   'QUEUE': ['QUEUE'],
   'STORE': ['QUEUE','PAYMENT_CALL','WAIT_ITEM','WAIT_OP'],
   'WITH_CLIENT': ['DEFAULT'],
}

export const STATUS_BUTTON_LABELS = {
    [ACTIVITY_STATUS.QUEUE]: 'Queue',
    [ACTIVITY_STATUS.PAYMENT_CALL]: 'Payment',
    [ACTIVITY_STATUS.WAIT_ITEM]: 'waiting for item',
    [ACTIVITY_STATUS.WAIT_OP]: 'waiting OP',
    [ACTIVITY_STATUS.DEFAULT]: 'Default',   
    [ACTIVITY_STATUS.CLEAR_TABLE]: 'Clear Table',
    [ACTIVITY_STATUS.STAND_CLOSE]: 'Stand Close',
};

export const CLIENT_SEND_MSG = {
    'STOP_ACTIVITY':'STOP_ACTIVITY',
    'COMPLETE_MODE_CAFE':'COMPLETE_MODE_CAFE',
};

export const COMPANION_ROLES = {
    'PRIMARY': 'PRIMARY',
    'SECONDARY': 'SECONDARY',
};

export const MESSAGE_TYPES_TO_COMPANION = {
    'STOP_ACTIVITY': 'STOP_ACTIVITY',
    'MODE_END': 'MODE_END',
    'STAND_GUARD': 'WAIT_OP',
}

export const MSG_STATUS = {
    'UNREAD': 'UNREAD',
    'OPENED': 'OPENED',
    'ACTIONED': 'ACTIONED'
};

export const MODE_DEFAULT_STATUS: Record<string, string> = {
  [ACTIVITY_MODES.CAFE]: ACTIVITY_STATUS.WAIT_OP,
  [ACTIVITY_MODES.STORE]: ACTIVITY_STATUS.WAIT_OP,
  [ACTIVITY_MODES.WITH_YOU]: ACTIVITY_STATUS.DEFAULT,
};

export const CLIENT_INSTRUCTION_MANUAL = {
    'WITH_YOU': {
        'DEFAULT': 'DEFAULT',
        'QUEUE': 'QUEUE',
        'WAIT_OP': 'WAIT_OP',
    },
    'CAFE': {
        'WAIT_OP': 'WAIT_OP',
        'BRING_STAFF': 'BRING_STAFF',
        'STAND_CLOSE': 'STAND_CLOSE',
        'ORDER_CALL': 'ORDER_CALL',
        'I_AM_DONE': 'I_AM_DONE',
    },
    'STORE': {
        'I_AM_DONE': 'I_AM_DONE',
        'CLOSE_ASSIST': 'CLOSE_ASSIST',
        'BRING_STAFF': 'BRING_STAFF',
        'WAIT_OP': 'WAIT_OP',
    },
}

export const CLIENT_INSTRUCTION_OPTIONS = {
    DEFAULT: [],
    QUEUE: ['CANCEL'],
    WAIT_OP: ['CANCEL'],
    CLEAR_TABLE: ['CANCEL'],
    STAND_CLOSE: ['CANCEL'],
    ORDER_CALL: ['CANCEL'],
    PAYMENT_CALL: [],
    WAIT_ITEM: [],
}   

export const INSTRUCTION_STATUS_UI_MAP: Record<string, Record<string, { text: string; image?: string }>> = {
  WAIT_OP: {
    UNREAD: { text: 'Waiting for operation to start...' }, // SENT
    OPENED: { text: 'Operation started!' }, // ACTIONED
    ACTIONED: { text: 'Operation completed!' }, // COMPLETED
  },
  BRING_STAFF: {
    UNREAD: { text: 'A staff member is on the way.' },
    OPENED: { text: 'Staff has arrived.' },
    ACTIONED: { text: 'Staff assistance completed.' },
  },
  STAND_CLOSE: {
    UNREAD: { text: 'Your companion will stand close.' },
    OPENED: { text: 'Companion is now standing close.' },
    ACTIONED: { text: 'Stand close instruction completed.' },
  },
  ORDER_CALL: {
    UNREAD: { text: 'Order is being called.' },
    OPENED: { text: 'Order has been placed.' },
    ACTIONED: { text: 'Order completed.' },
  },
  I_AM_DONE: {
    UNREAD: { text: 'You have indicated you are done.' },
    OPENED: { text: 'Companion acknowledged you are done.' },
    ACTIONED: { text: 'Session completed.' },
  },
  QUEUE: {
    UNREAD: { text: 'You are in the queue.' },
    OPENED: { text: 'Queue is moving.' },
    ACTIONED: { text: 'Queue completed.' },
  },
  DEFAULT: {
    UNREAD: { text: 'Default instruction sent.' },
    OPENED: { text: 'Default instruction actioned.' },
    ACTIONED: { text: 'Default instruction completed.' },
  },
  CLOSE_ASSIST: {
    UNREAD: { text: 'Assistance will be closed soon.' },
    OPENED: { text: 'Assistance is being closed.' },
    ACTIONED: { text: 'Assistance closed.' },
  },
};   

export const CLIENT_MODE_STATUS_UI_MAP: Record<string, Record<string, { text: string; image?: string }>> = {
  WITH_YOU: {
    DEFAULT: { text: 'You are with your companion.' },
    QUEUE: { text: 'You are in the queue with your companion.' },
    WAIT_OP: { text: 'Waiting for the next operation with your companion.' },
  },
  CAFE: {
    QUEUE: { text: 'You are in the cafe queue.' },
    PAYMENT_CALL: { text: 'Payment is being processed.' },
    WAIT_ITEM: { text: 'Waiting for your item in the cafe.' },
    WAIT_OP: { text: 'Waiting for the next operation in the cafe.' },
    CLEAR_TABLE: { text: 'Table is being cleared.' },
    STAND_CLOSE: { text: 'Your companion is standing close in the cafe.' },
  },
  QUEUE: {
    QUEUE: { text: 'You are in the main queue.' },
  },
  STORE: {
    QUEUE: { text: 'You are in the store queue.' },
    PAYMENT_CALL: { text: 'Processing payment in the store.' },
    WAIT_ITEM: { text: 'Waiting for your item in the store.' },
    WAIT_OP: { text: 'Waiting for the next operation in the store.' },
  },
  WITH_CLIENT: {
    DEFAULT: { text: 'You are with your client.' },
  },
};   