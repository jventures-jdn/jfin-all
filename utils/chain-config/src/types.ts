/* -------------------------------- Validator ------------------------------- */
export enum VALIDATOR_STATUS_ENUM {
    'NOT_FOUND' = 0,
    'ACTIVE' = 1,
    'PENDING' = 2,
    'JAILED' = 3,
}
export const VALIDATOR_STATUS_MAPPING = {
    0: 'NOT_FOUND',
    1: 'ACTIVE',
    2: 'PENDING',
    3: 'JAILED',
}
