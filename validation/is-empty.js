const isEmpty = (value) =>
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0);

module.exports = isEmpty;

//this is done somewhere bw vid 12-14 in case of error revisit
