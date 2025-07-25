export const ACTIVITY_MODES = {
   'WITH_YOU': 'WITH_YOU',
   'CAFE': 'CAFE',
   'QUEUE': 'QUEUE',
   'STORE': 'STORE'
};

export const ACTIVITY_SUB_MODE_LINKER = {
   'CAFE': ['SELF', 'WAITER'],
   'STORE': ['LARGE', 'MEDIUM', 'SMALL'],
 };


export const ACTIVITY_STATUS = {
    'QUEUE':'QUEUE',
    'PAYMENT_CALL':'PAYMENT_CALL',
    'WAIT_ITEM':'WAIT_ITEM',
    'WAIT_OP':'WAIT_OP',
    'DEFAULT': 'DEFAULT',
};

export const MODE_ACTIVITY_MAP = {
    [ACTIVITY_MODES.QUEUE] : [ACTIVITY_STATUS.QUEUE]
};

export const COMPANION_MODE_STATUS_LINKER = {
   'WITH_YOU': ['DEFAULT', 'QUEUE', 'WAIT_OP' ],
   'CAFE': ['QUEUE','PAYMENT_CALL','WAIT_ITEM','WAIT_OP'],
   'QUEUE': ['QUEUE'],
   'STORE': ['QUEUE','PAYMENT_CALL','WAIT_ITEM','WAIT_OP'],
   'WITH_CLIENT': ['DEFAULT'],
}


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

 // Status button labels mapping
 export const STATUS_BUTTON_LABELS = {
    [ACTIVITY_STATUS.QUEUE]: 'Queue',
    [ACTIVITY_STATUS.PAYMENT_CALL]: 'Payment',
    [ACTIVITY_STATUS.WAIT_ITEM]: 'waiting for item',
    [ACTIVITY_STATUS.WAIT_OP]: 'waiting OP',
    [ACTIVITY_STATUS.DEFAULT]: 'Default',
  };