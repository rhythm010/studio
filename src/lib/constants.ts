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
  'QUEUE': 'QUEUE',
  'PAYMENT_CALL': 'PAYMENT_CALL',
  'WAIT_ITEM': 'WAIT_ITEM',
  'WAIT_OP': 'WAIT_OP',
  'DEFAULT': 'DEFAULT',
  'STAND_CLOSE': 'STAND_CLOSE',
  'QUEUE_CALL': 'QUEUE_CALL',
  'CLOSE_ASSIST': 'CLOSE_ASSIST',
};

export const COMPANION_MODE_STATUS_LINKER = {
  'WITH_YOU': ['DEFAULT', 'QUEUE', 'WAIT_OP', 'QUEUE_CALL'],
  'CAFE': ['QUEUE', 'PAYMENT_CALL', 'WAIT_ITEM', 'WAIT_OP', 'STAND_CLOSE'],
  'QUEUE': ['QUEUE'],
  'STORE': ['QUEUE', 'PAYMENT_CALL', 'WAIT_ITEM', 'WAIT_OP', 'CLOSE_ASSIST'],
}

export const COMPANION_STATUS_BUTTON_LABELS = {
  [ACTIVITY_STATUS.QUEUE]: 'Stand in Queue',
  [ACTIVITY_STATUS.PAYMENT_CALL]: 'Call for Payment',
  [ACTIVITY_STATUS.WAIT_ITEM]: 'Waiting for Item',
  [ACTIVITY_STATUS.WAIT_OP]: 'Stand Guard',
  [ACTIVITY_STATUS.DEFAULT]: 'Default',
  [ACTIVITY_STATUS.STAND_CLOSE]: 'Stand Close',
  [ACTIVITY_STATUS.QUEUE_CALL]: 'Queue Complete',
  [ACTIVITY_STATUS.CLOSE_ASSIST]: 'Close Assist',
};

export const COMPANION_MODE_BUTTON_LABELS = {
  [ACTIVITY_MODES.CAFE]: 'Cafe Mode',
  [ACTIVITY_MODES.STORE]: 'Store Mode',
  [ACTIVITY_MODES.WITH_YOU]: 'with Client Mode',
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
  'PAYMENT_CALL': 'PAYMENT_CALL',
  'WAIT_ITEM': 'WAIT_ITEM',
  'PHOTO': 'PHOTO',
  'CANCEL': 'CANCEL',
};

const SECONDARY_PRIMARY_BOTH = {
  'SECONDARY': 'secondary',
  'PRIMARY': 'primary',
  'BOTH': 'both',
}

export const CLIENT_INSTRUCTION_MANUAL = {
  'WITH_YOU': {
    [INSTRUCTION_LIST.DEFAULT]: 'DEFAULT',
    [INSTRUCTION_LIST.QUEUE]: 'QUEUE',
    [INSTRUCTION_LIST.WAIT_OP]: 'WAIT_OP',
    // [INSTRUCTION_LIST.CANCEL]: 'CANCEL',
  },
  'CAFE': {
    // 'WAIT_OP': 'WAIT_OP',
    [INSTRUCTION_LIST.BRING_STAFF]: 'BRING_STAFF',
    [INSTRUCTION_LIST.STAND_CLOSE]: 'STAND_CLOSE',
    [INSTRUCTION_LIST.ORDER_CALL]: 'ORDER_CALL',
    [INSTRUCTION_LIST.I_AM_DONE]: 'I_AM_DONE',
    [INSTRUCTION_LIST.PHOTO]: 'PHOTO',
    // [INSTRUCTION_LIST.CANCEL]: 'CANCEL',
  },
  'STORE': {
    [INSTRUCTION_LIST.I_AM_DONE]: 'I_AM_DONE',
    // [INSTRUCTION_LIST.CLOSE_ASSIST]: 'CLOSE_ASSIST',
    [INSTRUCTION_LIST.BRING_STAFF]: 'BRING_STAFF',
    [INSTRUCTION_LIST.WAIT_OP]: 'WAIT_OP',
    // [INSTRUCTION_LIST.CANCEL]: 'CANCEL',
  },
};

// Simple companion routing: 'both' = both companions, 'primary' = primary only, 'secondary' = secondary (with fallback to primary)
export const COMPANION_ROLE_ROUTING = {
  [ACTIVITY_MODES.WITH_YOU]: {
    [INSTRUCTION_LIST.DEFAULT]: SECONDARY_PRIMARY_BOTH.BOTH,
    [INSTRUCTION_LIST.QUEUE]: SECONDARY_PRIMARY_BOTH.SECONDARY,
    [INSTRUCTION_LIST.WAIT_OP]: SECONDARY_PRIMARY_BOTH.BOTH,
    [INSTRUCTION_LIST.CANCEL]: SECONDARY_PRIMARY_BOTH.BOTH,
  },
  [ACTIVITY_MODES.CAFE]: {
    [INSTRUCTION_LIST.BRING_STAFF]: SECONDARY_PRIMARY_BOTH.SECONDARY,
    [INSTRUCTION_LIST.STAND_CLOSE]: SECONDARY_PRIMARY_BOTH.BOTH,
    [INSTRUCTION_LIST.ORDER_CALL]: SECONDARY_PRIMARY_BOTH.SECONDARY,
    [INSTRUCTION_LIST.I_AM_DONE]: SECONDARY_PRIMARY_BOTH.BOTH,
    [INSTRUCTION_LIST.PHOTO]: SECONDARY_PRIMARY_BOTH.SECONDARY,
    [INSTRUCTION_LIST.CANCEL]: SECONDARY_PRIMARY_BOTH.BOTH,
  },
  [ACTIVITY_MODES.STORE]: {
    [INSTRUCTION_LIST.I_AM_DONE]: SECONDARY_PRIMARY_BOTH.BOTH,
    [INSTRUCTION_LIST.BRING_STAFF]: SECONDARY_PRIMARY_BOTH.PRIMARY,
    [INSTRUCTION_LIST.WAIT_OP]: SECONDARY_PRIMARY_BOTH.BOTH,
    [INSTRUCTION_LIST.CANCEL]: SECONDARY_PRIMARY_BOTH.BOTH,
  },
  [ACTIVITY_MODES.QUEUE]: {
    [INSTRUCTION_LIST.QUEUE]: SECONDARY_PRIMARY_BOTH.SECONDARY
  }
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
  [INSTRUCTION_LIST.PHOTO]: {
    UNREAD: { text: 'Photo request sent' },
    OPENED: { text: 'Companion will take photo for you' },
    ACTIONED: { text: 'Photo completed' },
  },
  [INSTRUCTION_LIST.CANCEL]: {
    UNREAD: { text: 'Cancel instruction sent' },
    OPENED: { text: 'Cancelling current instruction' },
    ACTIONED: { text: 'Instruction cancelled' },
  },
};

export const CLIENT_INSTRUCTION_OPTIONS = {
  DEFAULT: [],
  QUEUE: ['CANCEL'],
  WAIT_OP: ['CANCEL'],
  STAND_CLOSE: ['CANCEL'],
  ORDER_CALL: ['CANCEL'],
  PAYMENT_CALL: [],
  WAIT_ITEM: [],
  PHOTO: [],
  CANCEL: [],
}

export const CLIENT_MODE_STATUS_UI_MAP: Record<string, Record<string, { text: string; image?: string; secondaryDiv: { text: string } }>> = {
  WITH_YOU: {
    DEFAULT: {
      text: 'Moving in style',
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
  PHOTO: 'Photo request received.',
  CANCEL: 'Cancel instruction received.',
  // Add more mappings as needed
};

export const CLIENT_INSTRUCTION_CONTENT: Record<string, Record<string, { title: string; description: { text: string; image?: string }; iconText: string; iconImage?: string; sendBtnText: string }>> = {
  WITH_YOU: {
    [INSTRUCTION_LIST.QUEUE]: {
      title: 'Stand In Queue',
      description: { text: 'When we are here, you never have to stand in any queue', image: '/images/instructions/QUEUE.png' },
      iconText: 'Queue',
      iconImage: '/icons/instructions/queue.png',
      sendBtnText: 'Send instruction'
    },
    [INSTRUCTION_LIST.WAIT_OP]: {
      title: 'Stand at a Distance',
      description: { text: 'Need Privacy or going for prayer ? We will stand and wait for you', image: '/images/instructions/WAIT_OP.png' },
      iconText: 'Stand Guard',
      iconImage: '/icons/instructions/security-guard.png',
      sendBtnText: 'Send instruction'
    },
    [INSTRUCTION_LIST.DEFAULT]: {
      title: 'Moving with you',
      description: { text: 'Companion will be moving with you, carrying your bags and making space for you', image: '/images/instructions/I_AM_DONE.png' },
      iconText: 'With me',
      iconImage: '/icons/instructions/standing-man.png',
      sendBtnText: 'Send instruction'
    },
    [INSTRUCTION_LIST.CANCEL]: {
      title: 'Cancel Instruction',
      description: { text: 'Cancel the current active instruction' },
      iconText: 'Cancel',
      iconImage: '/icons/cancel_mode.png',
      sendBtnText: 'Send instruction'
    },
  },
  CAFE: {
    [INSTRUCTION_LIST.BRING_STAFF]: {
      title: 'Bring Staff',
      description: { text: 'We will present the staff to your table', image: '/images/instructions/BRING_STAFF.png' },
      iconText: 'Bring Staff',
      iconImage: '/icons/instructions/waiter.png',
      sendBtnText: 'Send instruction'
    },
    [INSTRUCTION_LIST.STAND_CLOSE]: {
      title: 'Stand Close By',
      description: { text: 'Let us give you that extra presence', image: '/images/instructions/CLOSE_ASSIST.png' },
      iconText: 'Stand Close',
      iconImage: '/icons/instructions/standing-man.png',
      sendBtnText: 'Send instruction'
    },
    [INSTRUCTION_LIST.ORDER_CALL]: {
      title: 'Place order for me',
      description: { text: 'Just tell what you want, pay and relax. We will take care of the rest', image: '/images/instructions/ORDER_CALL.png' },
      iconText: 'Order',
      iconImage: '/icons/instructions/bell.png',
      sendBtnText: 'Send instruction'
    },
    [INSTRUCTION_LIST.I_AM_DONE]: {
      title: 'You are Done ?',
      description: { text: 'Let us come and pick up your stuff', image: '/images/instructions/I_AM_DONE.png' },
      iconText: 'Done',
      iconImage: '/icons/instructions/checkmark.png',
      sendBtnText: 'Send instruction'
    },
    [INSTRUCTION_LIST.PHOTO]: {
      title: 'Take Photo',
      description: { text: 'We will take a photo for you', image: '/images/instructions/PHOTO.png' },
      iconText: 'Photo',
      iconImage: '/icons/instructions/camera.png',
      sendBtnText: 'Send instruction'
    },
    [INSTRUCTION_LIST.CANCEL]: {
      title: 'Cancel Instruction',
      description: { text: 'Cancel the current active instruction' },
      iconText: 'Cancel',
      iconImage: '/icons/cancel_mode.png',
      sendBtnText: 'Send instruction'
    },
  },
  STORE: {
    [INSTRUCTION_LIST.I_AM_DONE]: {
      title: 'You are Done ?',
      description: { text: 'Let us come and get your items billed and packed', image: '/images/instructions/I_AM_DONE.png' },
      iconText: 'Done',
      iconImage: '/icons/instructions/shopping-bag.png',
      sendBtnText: 'Send instruction'
    },
    [INSTRUCTION_LIST.CLOSE_ASSIST]: {
      title: 'Come help me',
      description: { text: 'One of us will come with you to hold any items that you want', image: '/images/instructions/CLOSE_ASSIST.png' },
      iconText: 'Assist',
      iconImage: '/icons/instructions/shopping-bag.png',
      sendBtnText: 'Send instruction'
    },
    [INSTRUCTION_LIST.BRING_STAFF]: {
      title: 'Call staff',
      description: { text: 'We will be calling staff for you', image: '/images/instructions/BRING_STAFF.png' },
      iconText: 'Bring Staff',
      iconImage: '/icons/instructions/BRING_STAFF_STORE.png',
      sendBtnText: 'Send instruction'
    },
    [INSTRUCTION_LIST.WAIT_OP]: {
      title: 'Wait outside',
      description: { text: 'We will stand guard outside, waiting for your instructions' },
      iconText: 'Stand Guard',
      iconImage: '/icons/instructions/security-guard.png',
      sendBtnText: 'Send instruction'
    },
    [INSTRUCTION_LIST.CANCEL]: {
      title: 'Cancel Instruction',
      description: { text: 'Cancel the current active instruction' },
      iconText: 'Cancel',
      iconImage: '/icons/cancel_mode.png',
      sendBtnText: 'Send instruction'
    },
  },
};

export const COMPANION_SCREEN_MAPPER: Record<string, { modeText: string; statuses: Record<string, { textToDisplay: string; textInsideModal: string }>; instructions: Record<string, { textToDisplay: string; modalTexts: Record<string, string> }> }> = {
  [ACTIVITY_MODES.WITH_YOU]: {
    modeText: 'With Client',
    statuses: {
      [ACTIVITY_STATUS.DEFAULT]: { textToDisplay: 'Moving with Client', 
      textInsideModal: 'Are you sure ? Go and walk with the Client now' },
      [ACTIVITY_STATUS.QUEUE]: { textToDisplay: 'Standing in Queue', 
      textInsideModal: 'Are you sure ? Update your POSITION in Queue and then press "Queue Done" button to call Client' },
      [ACTIVITY_STATUS.WAIT_OP]: { textToDisplay: 'Standing at Distance', 
      textInsideModal: 'Are you sure ? Stand at a distance and wait for INSTRUCTION MESSAGE' },
      [ACTIVITY_STATUS.QUEUE_CALL]: { textToDisplay: 'Next in Queue', 
      textInsideModal: 'You are next in Queue ? Let the Client know' },
    },
    instructions: {
      [INSTRUCTION_LIST.DEFAULT]: {
        textToDisplay: 'Instruction Message: Walk with me',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Press START and start walking with Client.',
          [MSG_STATUS.OPENED]: 'Press COMPLETED if you are with client. Change STATUS to DEFAULT after that',
          [MSG_STATUS.ACTIONED]: 'You have completed walking with the client'
        }
      },
      [INSTRUCTION_LIST.QUEUE]: {
        textToDisplay: 'Instruction Message: Join the Queue',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Press START and join the Queue',
          [MSG_STATUS.OPENED]: 'Press COMPLETED once you are in Queue. Change STATUS to QUEUE after that',
          [MSG_STATUS.ACTIONED]: 'You have completed queuing for the client'
        }
      },
      [INSTRUCTION_LIST.WAIT_OP]: {
        textToDisplay: 'Instruction Message: Stand Guard',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Press START and go stand at a distance',
          [MSG_STATUS.OPENED]: 'Press COMPLETED if you are at a distance. Change STATUS to STAND GUARD after that',
          [MSG_STATUS.ACTIONED]: 'You have completed standing guard for the client'
        }
      },
      [INSTRUCTION_LIST.CANCEL]: {
        textToDisplay: 'Instruction Message: Cancel',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'The client wants to CANCEL the insturction. Press START and go back to Client.',
          [MSG_STATUS.OPENED]: 'Press COMPLETED once you have cancelled. Change STATUS to DEFAULT after that',
          [MSG_STATUS.ACTIONED]: 'No Action needed now'
        }
      },
    },
  },
  [ACTIVITY_MODES.CAFE]: {
    modeText: 'Cafe',
    statuses: {
      [ACTIVITY_STATUS.QUEUE]: { textToDisplay: 'In Cafe Queue', 
      textInsideModal: 'Are you sure ? Update your POSITION in Queue and then once you get close to the queue, press [Call for Payment] button to call Client' },
      [ACTIVITY_STATUS.PAYMENT_CALL]: { textToDisplay: 'Payment Ready', 
      textInsideModal: 'Press YES to call Client to come and make PAYMENT. Change STATUS to [Waiting For Item] after that' },
      [ACTIVITY_STATUS.WAIT_ITEM]: { textToDisplay: 'Order Being Prepared', 
      textInsideModal: 'Press YES and wait for the items to be prepared. Bring the items to the Client then go back to your previous position and change status' },
      [ACTIVITY_STATUS.WAIT_OP]: { textToDisplay: 'Waiting for Instructions', 
      textInsideModal: 'Press YES and go stand at a distance along with PRIMARY COMPANION' },
      [ACTIVITY_STATUS.STAND_CLOSE]: { textToDisplay: 'Standing Close', 
      textInsideModal: 'Press YES and go stand close to the Client along with PRIMARY COMPANION' },
    },
    instructions: {
      [INSTRUCTION_LIST.BRING_STAFF]: {
        textToDisplay: 'Instruction Message: Bring Staff',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Press START and bring staff to the client',
          [MSG_STATUS.OPENED]: 'Press COMPLETED if you have brought staff to the client. DO NOT change STATUS. Go back to previous position',
          [MSG_STATUS.ACTIONED]: 'You have completed bringing staff to the client'
        }
      },
      [INSTRUCTION_LIST.STAND_CLOSE]: {
        textToDisplay: 'Instruction Message: Stand Close',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Press START and go stand closer to the client',
          [MSG_STATUS.OPENED]: 'Press COMPLETED if you are close to the client. Change STATUS to [STAND CLOSE] after that',
          [MSG_STATUS.ACTIONED]: 'You have completed standing close to the client'
        }
      },
      [INSTRUCTION_LIST.ORDER_CALL]: {
        textToDisplay: 'Instruction Message: Client to order',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Press START and go to the counter',
          [MSG_STATUS.OPENED]: 'Press COMPLETED if you are at the counter. Activate QUEUE if there is a Queue, else change STATUS to [Call for Payment]. Wait for the Client to come',
          [MSG_STATUS.ACTIONED]: 'You have completed calling the order for the client'
        }
      },
      [INSTRUCTION_LIST.I_AM_DONE]: {
        textToDisplay: 'Instruction Message: Cient is Done, Lets\' move',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Press START and go to the client',
          [MSG_STATUS.OPENED]: 'Press COMPLETED if you are with the client. DO NOT change STATUS',
          [MSG_STATUS.ACTIONED]: 'You have completed finishing service for the client'
        }
      },
      [INSTRUCTION_LIST.PHOTO]: {
        textToDisplay: 'Instruction Message: Take Photo',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Press START and go to the client to take photo. Take some photos and press COMPLETED',
          [MSG_STATUS.OPENED]: 'Press COMPLETED if you have taken some photos. DO NOT change STATUS. Get back to your previous position',
          [MSG_STATUS.ACTIONED]: 'You have completed taking a photo for the client'
        }
      },
      [INSTRUCTION_LIST.CANCEL]: {
        textToDisplay: 'Instruction Message: Cancel',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Press START and STOP doing what you are doing',
          [MSG_STATUS.OPENED]: 'Press COMPLETED once you are back to your previous position',
          [MSG_STATUS.ACTIONED]: 'You have cancelled the current instruction'
        }
      },
    },
  },
  [ACTIVITY_MODES.STORE]: {
    modeText: 'Store',
    statuses: {
      [ACTIVITY_STATUS.QUEUE]: { textToDisplay: 'In Store Queue', 
      textInsideModal: 'Activate Queue and update your POSITION in Queue. Press [Call for Payment] button once payment is required' },
      [ACTIVITY_STATUS.PAYMENT_CALL]: { textToDisplay: 'Payment Counter Ready', 
      textInsideModal: 'Press YES to call Client to come and make PAYMENT. Once Payment is made, then get the items ready' },
      [ACTIVITY_STATUS.WAIT_ITEM]: { textToDisplay: 'Getting Items Ready', 
      textInsideModal: 'Press YES and get items ready, packed and then hand it to PRIMARY COMPANION' },
      [ACTIVITY_STATUS.WAIT_OP]: { textToDisplay: 'Ready to Assist Shopping', 
      textInsideModal: 'You have not received instructions for Ready to Assist Shopping, Are you sure you want to proceed?' },
      [ACTIVITY_STATUS.CLOSE_ASSIST]: { textToDisplay: 'Assisting in Shopping', 
      textInsideModal: 'You have not received instructions for Assisting in Shopping, Are you sure you want to proceed?' },
    },
    instructions: {
      [INSTRUCTION_LIST.I_AM_DONE]: {
        textToDisplay: 'Instruction Message: Client is Done Shopping',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Press START. Take items from Client and go to the billing counter. If there is a queue, activate QUEUE',
          [MSG_STATUS.OPENED]: 'Press COMPLETED if you are at the billing counter. Change STATUS to [Call for Payment] to call Client',
          [MSG_STATUS.ACTIONED]: 'You have completed finishing shopping for the client'
        }
      },
      [INSTRUCTION_LIST.CLOSE_ASSIST]: {
        textToDisplay: 'Instruction Message: Close Assist',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Do you want to start providing close assistance to the client?',
          [MSG_STATUS.OPENED]: 'Do you want to start providing close assistance to the client?',
          [MSG_STATUS.ACTIONED]: 'You have completed providing close assistance to the client'
        }
      },
      [INSTRUCTION_LIST.BRING_STAFF]: {
        textToDisplay: 'Instruction Message: Bring Staff to Client',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Press START and Bring STAFF to Client',
          [MSG_STATUS.OPENED]: 'Press COMPLETED once STAFF is there. DO NOT change STATUS',
          [MSG_STATUS.ACTIONED]: 'You have completed bringing staff to the client'
        }
      },
      [INSTRUCTION_LIST.WAIT_OP]: {
        textToDisplay: 'Instruction Message: Stand Guard',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Do you want to start standing guard for the client?',
          [MSG_STATUS.OPENED]: 'Do you want to start standing guard for the client?',
          [MSG_STATUS.ACTIONED]: 'You have completed standing guard for the client'
        }
      },
      [INSTRUCTION_LIST.CANCEL]: {
        textToDisplay: 'Instruction Message: Cancel Instruction',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Press START and STOP doing what you are doing',
          [MSG_STATUS.OPENED]: 'Press COMPLETED once you are back to your previous position',
          [MSG_STATUS.ACTIONED]: 'You have cancelled the current instruction'
        }
      },
    },
  },
  [ACTIVITY_MODES.QUEUE]: {
    modeText: 'Queue',
    statuses: {
      [ACTIVITY_STATUS.QUEUE]: { textToDisplay: 'Managing Main Queue', textInsideModal: 'You have not received instructions for Managing Main Queue, Are you sure you want to proceed?' },
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
      [INSTRUCTION_LIST.CANCEL]: {
        textToDisplay: 'Instruction: Cancel',
        modalTexts: {
          [MSG_STATUS.UNREAD]: 'Do you want to cancel the current instruction?',
          [MSG_STATUS.OPENED]: 'You are cancelling the current instruction',
          [MSG_STATUS.ACTIONED]: 'You have cancelled the current instruction'
        }
      },
    },
  },
};

export const INSTRUCTION_ICONS: Record<string, string> = {
  QUEUE: '/icons/instructions/queue.png',
  WAIT_OP: '/icons/instructions/security-guard.png',
  BRING_STAFF: '/icons/instructions/waiter.png',
  STAND_CLOSE: '/icons/instructions/standing-man.png',
  ORDER_CALL: '/icons/instructions/bell.png',
  I_AM_DONE: '/icons/instructions/checkmark.png',
  CLOSE_ASSIST: '/icons/instructions/shopping-bag.png',
  PHOTO: '/icons/instructions/camera.png',
  DEFAULT: 'default', // This will be handled as an SVG in the component
};

export const INTRODUCTION_CONTENT = [
  {
    image: '/images/introduction/INTRODUCTION_1.png',
    text: 'Welcome to Companion Service'
  },
  {
    image: '/images/introduction/MOVING_1.png',
    text: 'We move with you everywhere'
  },
  {
    image: '/images/introduction/COFFEE_AND_STORE.png',
    text: 'Assist you at cafes and stores'
  },
  {
    image: '/images/introduction/USING_APP.png',
    text: 'Simple and easy to use'
  },
  {
    image: '/images/introduction/DO_NOT.png',
    text: 'Important safety guidelines'
  }
];