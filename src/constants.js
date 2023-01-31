export const OPTIONS = ['NIFTY', 'BANKNIFTY', 'FINNIFTY'];
export const EXPIRY_DATES = [
    '02-Feb-2023',
    '09-Feb-2023',
    '16-Feb-2023',
    '23-Feb-2023',
    '02-Mar-2023',
    '29-Mar-2023',
    '27-Apr-2023',
    '29-Jun-2023',
    '28-Sep-2023',
    '28-Dec-2023'
];
export const QUANTITY = Array.from({length:20}, (v,k) => k+1)

export const INDEX_TOKENS = {
    NIFTY: "26000",
    BANKNIFTY: "26009",
    FINNIFTY: "26037"
}