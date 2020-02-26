
// objects that store info, maybe one big object with each category and which SNI codes belong to it

// or just an object that maps SNI code to color

export function getColorBySNICode(SNIcode) {
    return 'red';
};

export function getColorByCompanyCategory(companyCategory) {
    return 'blue';
}

// each obj in data has a unique key which can be used to map a color
export function getColorByCompanyKey(key) {
    return 'purple';
}
