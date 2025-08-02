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
    DEFAULT: { text: 'We are moving with you' },
    QUEUE: { text: 'Standing in Queue' },
    WAIT_OP: { text: 'We are standing at a distance' },
    QUEUE_CALL: { text: 'Your turn is next' },
  },
  CAFE: {
    QUEUE: { text: 'We are in the queue' },
    PAYMENT_CALL: { text: 'Please come and make payment' },
    WAIT_ITEM: { text: 'Your order is being prepared' },
    WAIT_OP: { text: 'Let us know when you want something' },
    CLEAR_TABLE: { text: 'Table is being cleared' },
    STAND_CLOSE: { text: 'We are standing close' },
  },
  QUEUE: {
    QUEUE: { text: 'You are in the main queue' },
  },
  STORE: {
    QUEUE: { text: 'You are in the store queue' },
    PAYMENT_CALL: { text: 'Please come for payment' },
    WAIT_ITEM: { text: 'We are getting items ready for you' },
    WAIT_OP: { text: 'Let us know if you need help in shopping' },
    CLOSE_ASSIST: { text: 'Assisting you in shopping' },
  },
}; 

export const INSTRUCTION_STATUS_UI_MAP: Record<string, Record<string, { text: string; image?: string }>> = {
  WAIT_OP: {
    UNREAD: { text: 'Standing instructions sent' }, // SENT
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
    OPENED: { text: 'Companion will now stand close to you' },
    ACTIONED: { text: 'Instructions completed' },
  },
  ORDER_CALL: {
    UNREAD: { text: 'Instructions sent to order' },
    OPENED: { text: 'Companions will now move' },
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
    UNREAD: { text: 'Calling Companion to you' },
    OPENED: { text: 'Companions will come now' },
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

export const CLIENT_INSTRUCTION_CONTENT: Record<string, Record<string, { title: string; description: { text: string; image?: string } }>> = {
  WITH_YOU: {
    QUEUE: { 
      title: 'Standing in Queue', 
      description: { text: 'We are waiting in the queue with you' }
    },
    WAIT_OP: { 
      title: 'Standing at distance', 
      description: { text: 'We are standing nearby while you handle your business' }
    },
  },
  CAFE: {
    BRING_STAFF: { 
      title: 'Calling staff', 
      description: { text: 'We will call a staff member to assist you' }
    },
    STAND_CLOSE: { 
      title: 'Standing close', 
      description: { text: 'We are standing nearby to assist you' }
    },
    ORDER_CALL: { 
      title: 'Placing order', 
      description: { text: 'We will place your order with the staff' }
    },
    I_AM_DONE: { 
      title: 'Service complete', 
      description: { text: 'You have indicated you are finished with your meal' }
    },
  },
  STORE: {
    I_AM_DONE: { 
      title: 'Shopping complete', 
      description: { text: 'You have indicated you are finished shopping' }
    },
    CLOSE_ASSIST: { 
      title: 'Shopping assistance', 
      description: { text: 'We are here to assist you with your shopping' }
    },
    BRING_STAFF: { 
      title: 'Calling staff', 
      description: { text: 'We will call a staff member to assist you' }
    },
    WAIT_OP: { 
      title: 'Shopping assistance', 
      description: { text: 'Let us know if you need help while shopping' }
    },
  },
};   