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
    'QUEUE_CALL': 'QUEUE_CALL',
    'CLOSE_ASSIST': 'CLOSE_ASSIST',
};

export const COMPANION_MODE_STATUS_LINKER = {
   'WITH_YOU': ['DEFAULT', 'QUEUE', 'WAIT_OP', 'QUEUE_CALL' ],
   'CAFE': ['QUEUE','PAYMENT_CALL','WAIT_ITEM','WAIT_OP','STAND_CLOSE'],
   'QUEUE': ['QUEUE'],
   'STORE': ['QUEUE','PAYMENT_CALL','WAIT_ITEM','WAIT_OP', 'CLOSE_ASSIST'],
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
    [ACTIVITY_STATUS.QUEUE_CALL]: 'Queue Ends',
    [ACTIVITY_STATUS.CLOSE_ASSIST]: 'Close Assist',
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
        // 'DEFAULT': 'DEFAULT',
        'QUEUE': 'QUEUE',
        'WAIT_OP': 'WAIT_OP',
    },
    'CAFE': {
        // 'WAIT_OP': 'WAIT_OP',
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
};

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

export const CLIENT_MODE_STATUS_UI_MAP: Record<string, Record<string, { text: string; image?: string }>> = {
  WITH_YOU: {
    DEFAULT: { text: 'You are with your companion.' },
    QUEUE: { text: 'Compnaions standing in Queue for you' },
    WAIT_OP: { text: 'Companions waiting for your instructions' },
    QUEUE_CALL: { text: 'Your turn is next' },
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
    CLOSE_ASSIST: { text: 'Companion will be helping you' },
  },
  WITH_CLIENT: {
    DEFAULT: { text: 'You are with your client.' },
  },
}; 

export const INSTRUCTION_STATUS_UI_MAP: Record<string, Record<string, { text: string; image?: string }>> = {
  WAIT_OP: {
    UNREAD: { text: 'Standing instructions send' }, // SENT
    OPENED: { text: 'Companions have accepted instructions' }, // ACTIONED
    ACTIONED: { text: 'Instructions completed' }, // COMPLETED
  },
  BRING_STAFF: {
    UNREAD: { text: 'Instructions sent to bring staff' },
    OPENED: { text: 'Companions will now bring staff' },
    ACTIONED: { text: 'Instructions completed' },
  },
  STAND_CLOSE: {
    UNREAD: { text: 'Instructions sent to stand close' },
    OPENED: { text: 'Companion will now complete task' },
    ACTIONED: { text: 'Instructions completed' },
  },
  ORDER_CALL: {
    UNREAD: { text: 'Instructions sent to give orders for food' },
    OPENED: { text: 'Order has been placed' },
    ACTIONED: { text: 'Instructions completed' },
  },
  I_AM_DONE: {
    UNREAD: { text: 'Companions will arrive shortly' },
    OPENED: { text: 'Companion acknowledged you are done' },
    ACTIONED: { text: 'Instructions completed' },
  },
  QUEUE: {
    UNREAD: { text: 'Instructions sent to join queue' },
    OPENED: { text: 'Companions will now join queue' },
    ACTIONED: { text: 'Instructions completed' },
  },
  DEFAULT: {
    UNREAD: { text: 'Default instruction sent' },
    OPENED: { text: 'Default instruction actioned' },
    ACTIONED: { text: 'Instructions completed' },
  },
  CLOSE_ASSIST: {
    UNREAD: { text: 'Instructions Sent' },
    OPENED: { text: 'Help is being provided' },
    ACTIONED: { text: 'Instructions completed' },
  },
};     

export const RECIEVE_COMPANION_MSG_TYPE_MAP: Record<string, string> = {
  WAIT_OP: 'Waiting for operation...',
  BRING_STAFF: 'A staff member is on the way.',
  STAND_CLOSE: 'Your companion will stand close.',
  ORDER_CALL: 'Order is being called.',
  I_AM_DONE: 'You have indicated you are done.',
  QUEUE: 'You are in the queue.',
  DEFAULT: 'Default instruction sent.',
  CLOSE_ASSIST: 'Assistance will be closed soon.',
  // Add more mappings as needed
};   