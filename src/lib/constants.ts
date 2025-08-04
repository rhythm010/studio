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


export const INSTRUCTION_LIST = {
    'DEFAULT': 'DEFAULT',
    'QUEUE': 'QUEUE',
    'WAIT_OP': 'WAIT_OP',
    'BRING_STAFF': 'BRING_STAFF',
    'STAND_CLOSE': 'STAND_CLOSE',
    'ORDER_CALL': 'ORDER_CALL',
    'I_AM_DONE': 'I_AM_DONE',
    'CLOSE_ASSIST': 'CLOSE_ASSIST',
    'CLEAR_TABLE': 'CLEAR_TABLE',
    'PAYMENT_CALL': 'PAYMENT_CALL',
    'WAIT_ITEM': 'WAIT_ITEM',
};

export const CLIENT_INSTRUCTION_MANUAL = {
  'WITH_YOU': {
      [INSTRUCTION_LIST.DEFAULT]: 'DEFAULT',
      [INSTRUCTION_LIST.QUEUE]: 'QUEUE',
      [INSTRUCTION_LIST.WAIT_OP]: 'WAIT_OP',
  },
  'CAFE': {
      // 'WAIT_OP': 'WAIT_OP',
      [INSTRUCTION_LIST.BRING_STAFF]: 'BRING_STAFF',
      [INSTRUCTION_LIST.STAND_CLOSE]: 'STAND_CLOSE',
      [INSTRUCTION_LIST.ORDER_CALL]: 'ORDER_CALL',
      [INSTRUCTION_LIST.I_AM_DONE]: 'I_AM_DONE',
  },
  'STORE': {
      [INSTRUCTION_LIST.I_AM_DONE]: 'I_AM_DONE',
      [INSTRUCTION_LIST.CLOSE_ASSIST]: 'CLOSE_ASSIST',
      [INSTRUCTION_LIST.BRING_STAFF]: 'BRING_STAFF',
      [INSTRUCTION_LIST.WAIT_OP]: 'WAIT_OP',
  },
};

export const INSTRUCTION_STATUS_UI_MAP: Record<string, Record<string, { text: string; image?: string }>> = {
  [INSTRUCTION_LIST.WAIT_OP]: {
    UNREAD: { text: 'Standing instructions sent' }, // SENT
    OPENED: { text: 'Companions have accepted instructions' }, // ACTIONED
    ACTIONED: { text: 'Instructions completed' }, // COMPLETED
  },
  [INSTRUCTION_LIST.BRING_STAFF]: {
    UNREAD: { text: 'Instructions sent to bring staff' },
    OPENED: { text: 'Companions will now bring staff' },
    ACTIONED: { text: 'Instructions completed' },
  },
  [INSTRUCTION_LIST.STAND_CLOSE]: {
    UNREAD: { text: 'Instructions sent to stand close' },
    OPENED: { text: 'Companion will now stand close to you' },
    ACTIONED: { text: 'Instructions completed' },
  },
  [INSTRUCTION_LIST.ORDER_CALL]: {
    UNREAD: { text: 'Instructions sent to order' },
    OPENED: { text: 'Companions will now move' },
    ACTIONED: { text: 'Instructions completed' },
  },
  [INSTRUCTION_LIST.I_AM_DONE]: {
    UNREAD: { text: 'Companions will arrive shortly' },
    OPENED: { text: 'Companion acknowledged you are done' },
    ACTIONED: { text: 'Instructions completed' },
  },
  [INSTRUCTION_LIST.QUEUE]: {
    UNREAD: { text: 'Instructions sent to join queue' },
    OPENED: { text: 'Companions will now join queue' },
    ACTIONED: { text: 'Instructions completed' },
  },
  [INSTRUCTION_LIST.DEFAULT]: {
    UNREAD: { text: 'Default instruction sent' },
    OPENED: { text: 'Default instruction actioned' },
    ACTIONED: { text: 'Instructions completed' },
  },
  [INSTRUCTION_LIST.CLOSE_ASSIST]: {
    UNREAD: { text: 'Calling Companion to you' },
    OPENED: { text: 'Companions will come now' },
    ACTIONED: { text: 'Instructions completed' },
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

export const CLIENT_MODE_STATUS_UI_MAP: Record<string, Record<string, { text: string; image?: string; secondaryDiv: { text: string } }>> = {
  WITH_YOU: {
    DEFAULT: { text: 'Moving in style', 
      secondaryDiv: { 
        text: 'Your companions are actively moving with you' 
      },
      image: '/images/with_you.png'
    },
    QUEUE: { text: 'Standing in Queue', secondaryDiv: { text: 'We will let you know when it is your turn' } },
    WAIT_OP: { text: 'We are standing at a distance', secondaryDiv: { text: 'You can let us know if you need anything' } },
    QUEUE_CALL: { text: 'Your turn is next', secondaryDiv: { text: 'Get ready, your turn is approaching' } },
  },
  CAFE: {
    QUEUE: { text: 'We are in the queue', secondaryDiv: { text: 'You will be notified to come and pay.' } },
    PAYMENT_CALL: { text: 'Please come and make payment', secondaryDiv: { text: 'Just come and pay, we will bring items to you' } },
    WAIT_ITEM: { text: 'Your order is being prepared', secondaryDiv: { text: 'We are waiting while your order is being prepared' } },
    WAIT_OP: { text: 'You are in a cafe/restaurant', secondaryDiv: { text: 'We are waiting for your instructions' } },
    CLEAR_TABLE: { text: 'Table is being cleared', secondaryDiv: { text: 'Your table is being prepared for you' } },
    STAND_CLOSE: { text: 'We are standing close', secondaryDiv: { text: 'We are waiting for your instructions' } },
  },
  QUEUE: {
    QUEUE: { text: 'You are in the main queue', secondaryDiv: { text: 'Your companions are managing the queue for you' } },
  },
  STORE: {
    QUEUE: { text: 'You are in the store queue', secondaryDiv: { text: 'Your companions are queuing for your shopping' } },
    PAYMENT_CALL: { text: 'Please come for payment', secondaryDiv: { text: 'Payment counter is ready for you' } },
    WAIT_ITEM: { text: 'We are getting items ready for you', secondaryDiv: { text: 'We are packing your items' } },
    WAIT_OP: { text: 'Let us know if you need help in shopping', secondaryDiv: { text: 'Your companions are ready to assist with shopping' } },
    CLOSE_ASSIST: { text: 'Assisting you in shopping', secondaryDiv: { text: 'We can call staff, hold items for you' } },
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

export const CLIENT_INSTRUCTION_CONTENT: Record<string, Record<string, { title: string; description: { text: string; image?: string }; iconText: string }>> = {
  WITH_YOU: {
        [INSTRUCTION_LIST.QUEUE]: { 
          title: 'Stand In Queue', 
          description: { text: 'When we are here, you never have to stand in any queue' },
          iconText: 'Queue'
        },
        [INSTRUCTION_LIST.WAIT_OP]: { 
          title: 'Stand at a Distance', 
          description: { text: 'Need Privacy or going for prayer ? We will stand and wait for you' },
          iconText: 'Stand Guard'
        },
        [INSTRUCTION_LIST.DEFAULT]: {
          title: 'Moving with you',
          description: { text: 'Companion will be moving with you, carrying your bags and making space for you' },
          iconText: 'With me'
        },
  },
  CAFE: {
    [INSTRUCTION_LIST.BRING_STAFF]: { 
      title: 'Bring Staff', 
      description: { text: 'We will present the staff to your table' },
      iconText: 'Bring Staff'
    },
    [INSTRUCTION_LIST.STAND_CLOSE]: { 
      title: 'Stand Close By', 
      description: { text: 'Let us give you that extra presence' },
      iconText: 'Stand Close'
    },
    [INSTRUCTION_LIST.ORDER_CALL]: { 
      title: 'Place order for me', 
      description: { text: 'Just tell what you want, pay and relax. We will take care of the rest' },
      iconText: 'Order'
    },
    [INSTRUCTION_LIST.I_AM_DONE]: { 
      title: 'I am done', 
      description: { text: 'Let us come and pick up your stuff' },
      iconText: 'Done'
    },
  },
  STORE: {
    [INSTRUCTION_LIST.I_AM_DONE]: { 
      title: 'I am done', 
      description: { text: 'Let us come and get your items billed and packed' },
      iconText: 'Done'
    },
    [INSTRUCTION_LIST.CLOSE_ASSIST]: { 
      title: 'Come help me', 
      description: { text: 'One of us will come with you to hold any items that you want' },
      iconText: 'Assist'
    },
    [INSTRUCTION_LIST.BRING_STAFF]: { 
      title: 'Call staff', 
      description: { text: 'We will be calling staff for you' },
      iconText: 'Bring Staff'
    },
    [INSTRUCTION_LIST.WAIT_OP]: { 
      title: 'Wait outside', 
      description: { text: 'We will stand guard outside, waiting for your instructions' },
      iconText: 'Stand Guard'
    },
  },
};   

export const COMPANION_SCREEN_MAPPER: Record<string, { modeText: string; statuses: Record<string, { textToDisplay: string }>; instructions: Record<string, { textToDisplay: string; modalTexts: Record<string, string> }> }> = {
  [ACTIVITY_MODES.WITH_YOU]: {
    modeText: 'With Client',
    statuses: {
      [ACTIVITY_STATUS.DEFAULT]: { textToDisplay: 'Moving with Client' },
      [ACTIVITY_STATUS.QUEUE]: { textToDisplay: 'Standing in Queue' },
      [ACTIVITY_STATUS.WAIT_OP]: { textToDisplay: 'Standing at Distance' },
      [ACTIVITY_STATUS.QUEUE_CALL]: { textToDisplay: 'Next in Queue' },
    },
    instructions: {
      [INSTRUCTION_LIST.DEFAULT]: { 
        textToDisplay: 'Instruction: Walk with me',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Do you want to start walking with the client?',
          [MSG_STATUS.OPENED]: 'You are in the middle of the action',
          [MSG_STATUS.ACTIONED]: 'You have completed walking with the client'
        }
      },
      [INSTRUCTION_LIST.QUEUE]: { 
        textToDisplay: 'Instruction: Queue here',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Do you want to start queuing for the client?',
          [MSG_STATUS.OPENED]: 'You are in the middle of the action',
          [MSG_STATUS.ACTIONED]: 'You have completed queuing for the client'
        }
      },
      [INSTRUCTION_LIST.WAIT_OP]: { 
        textToDisplay: 'Instruction: Stand Guard',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Do you want to start standing guard for the client?',
          [MSG_STATUS.OPENED]: 'You are in the middle of the action',
          [MSG_STATUS.ACTIONED]: 'You have completed standing guard for the client'
        }
      },
    },
  },
  [ACTIVITY_MODES.CAFE]: {
    modeText: 'Cafe',
    statuses: {
      [ACTIVITY_STATUS.QUEUE]: { textToDisplay: 'In Cafe Queue' },
      [ACTIVITY_STATUS.PAYMENT_CALL]: { textToDisplay: 'Payment Ready' },
      [ACTIVITY_STATUS.WAIT_ITEM]: { textToDisplay: 'Order Being Prepared' },
      [ACTIVITY_STATUS.WAIT_OP]: { textToDisplay: 'Waiting for Instructions' },
      [ACTIVITY_STATUS.CLEAR_TABLE]: { textToDisplay: 'Clearing Table' },
      [ACTIVITY_STATUS.STAND_CLOSE]: { textToDisplay: 'Standing Close' },
    },
    instructions: {
      [INSTRUCTION_LIST.BRING_STAFF]: { 
        textToDisplay: 'Instruction: Bring Staff',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Do you want to start bringing staff to the client?',
          [MSG_STATUS.OPENED]: 'Do you want to start bringing staff to the client?',
          [MSG_STATUS.ACTIONED]: 'You have completed bringing staff to the client'
        }
      },
      [INSTRUCTION_LIST.STAND_CLOSE]: { 
        textToDisplay: 'Instruction: Stand Close',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Do you want to start standing close to the client?',
          [MSG_STATUS.OPENED]: 'Do you want to start standing close to the client?',
          [MSG_STATUS.ACTIONED]: 'You have completed standing close to the client'
        }
      },
      [INSTRUCTION_LIST.ORDER_CALL]: { 
        textToDisplay: 'Instruction: Order Call',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Do you want to start calling the order for the client?',
          [MSG_STATUS.OPENED]: 'Do you want to start calling the order for the client?',
          [MSG_STATUS.ACTIONED]: 'You have completed calling the order for the client'
        }
      },
      [INSTRUCTION_LIST.I_AM_DONE]: { 
        textToDisplay: 'Instruction: I am Done',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Do you want to start finishing service for the client?',
          [MSG_STATUS.OPENED]: 'Do you want to start finishing service for the client?',
          [MSG_STATUS.ACTIONED]: 'You have completed finishing service for the client'
        }
      },
    },
  },
  [ACTIVITY_MODES.STORE]: {
    modeText: 'Store',
    statuses: {
      [ACTIVITY_STATUS.QUEUE]: { textToDisplay: 'In Store Queue' },
      [ACTIVITY_STATUS.PAYMENT_CALL]: { textToDisplay: 'Payment Counter Ready' },
      [ACTIVITY_STATUS.WAIT_ITEM]: { textToDisplay: 'Getting Items Ready' },
      [ACTIVITY_STATUS.WAIT_OP]: { textToDisplay: 'Ready to Assist Shopping' },
      [ACTIVITY_STATUS.CLOSE_ASSIST]: { textToDisplay: 'Assisting in Shopping' },
    },
    instructions: {
      [INSTRUCTION_LIST.I_AM_DONE]: { 
        textToDisplay: 'Instruction: I am Done',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Do you want to start finishing shopping for the client?',
          [MSG_STATUS.OPENED]: 'Do you want to start finishing shopping for the client?',
          [MSG_STATUS.ACTIONED]: 'You have completed finishing shopping for the client'
        }
      },
      [INSTRUCTION_LIST.CLOSE_ASSIST]: { 
        textToDisplay: 'Instruction: Close Assist',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Do you want to start providing close assistance to the client?',
          [MSG_STATUS.OPENED]: 'Do you want to start providing close assistance to the client?',
          [MSG_STATUS.ACTIONED]: 'You have completed providing close assistance to the client'
        }
      },
      [INSTRUCTION_LIST.BRING_STAFF]: { 
        textToDisplay: 'Instruction: Bring Staff',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Do you want to start bringing staff to the client?',
          [MSG_STATUS.OPENED]: 'Do you want to start bringing staff to the client?',
          [MSG_STATUS.ACTIONED]: 'You have completed bringing staff to the client'
        }
      },
      [INSTRUCTION_LIST.WAIT_OP]: { 
        textToDisplay: 'Instruction: Stand Guard',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Do you want to start standing guard for the client?',
          [MSG_STATUS.OPENED]: 'Do you want to start standing guard for the client?',
          [MSG_STATUS.ACTIONED]: 'You have completed standing guard for the client'
        }
      },
    },
  },
  [ACTIVITY_MODES.QUEUE]: {
    modeText: 'Queue',
    statuses: {
      [ACTIVITY_STATUS.QUEUE]: { textToDisplay: 'Managing Main Queue' },
    },
    instructions: {
      [INSTRUCTION_LIST.QUEUE]: { 
        textToDisplay: 'Queue instruction received',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Do you want to start managing the queue for the client?',
          [MSG_STATUS.OPENED]: 'Do you want to start managing the queue for the client?',
          [MSG_STATUS.ACTIONED]: 'You have completed managing the queue for the client'
        }
      },
    },
  },
};