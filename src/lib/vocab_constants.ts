import { ACTIVITY_MODES, ACTIVITY_STATUS } from "./constants";


export const vocab = {
    GuardMatchingPage: {
        modeChangeModal: {
            [ACTIVITY_MODES.QUEUE]: 'Ready to Get into a Queue ?',
            [ACTIVITY_MODES.CAFE]: 'You are going to start the CAFE mode',
            [ACTIVITY_MODES.STORE]: 'You are going to start the STORE mode',
            [ACTIVITY_MODES.WITH_YOU]: 'You are moving with the Client',
        },
        statusChangeModal: {
            [ACTIVITY_STATUS.QUEUE]: 'You are getting into the Queue ?',
            [ACTIVITY_STATUS.PAYMENT_CALL]: 'Call the client for payment ?',
            [ACTIVITY_STATUS.WAIT_ITEM]: 'Waiting for the items ?',
            [ACTIVITY_STATUS.WAIT_OP]: 'Go and wait at the observation point.',
        },
        selectedModeText: '',
        selectedStatusText: '',
        yourRoleText: 'You are ',
    }
};