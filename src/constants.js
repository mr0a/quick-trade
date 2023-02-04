export const INDICES = ['NIFTY', 'BANKNIFTY', 'FINNIFTY'];

export const IndexProperties = {
    "NIFTY": {
        token: "26000",
        strike_multiple: 50,
        exchange: "NSE"
    },
    "BANKNIFTY": {
        token: "26009",
        strike_multiple: 100,
        exchange: "NSE"
    },
    "FINNIFTY": {
        token: "26037",
        strike_multiple: 50,
        exchange: "NSE"
    }
}

let expiry_dates = [
    '02-FEB-2023',
    '09-FEB-2023',
    '16-FEB-2023',
    '23-FEB-2023',
    '02-MAR-2023',
    '29-MAR-2023',
    '27-APR-2023',
    '29-JUN-2023',
    '28-SEP-2023',
    '28-DEC-2023'
];

export const EXPIRY_DATES = expiry_dates.filter((date) => {
    let today = new Date();
    return !(new Date(date) < today);
});

export const QUANTITY = [1,2,3,4,5,6,7,8,9,10]

export const INDEX_TOKENS = {
    NIFTY: "26000",
    BANKNIFTY: "26009",
    FINNIFTY: "26037"
}