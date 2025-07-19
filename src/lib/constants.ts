export const ACTIVITY_MODES = {
   'WITH_YOU': 'WITH_YOU',
   'CAFE': 'CAFE',
   'QUEUE': 'QUEUE',
   'STORE': 'STORE'
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
   'WITH_YOU': ['DEFAULT'],
   'CAFE': ['QUEUE','CAFE','PAYMENT_CALL','WAIT_ITEM','WAIT_OP' ],
   'QUEUE': ['QUEUE'],
   'STORE': ['DEFAULT'],
   'WITH_CLIENT': ['DEFAULT'],
}


export const CLIENT_SEND_MSG = {
    
};