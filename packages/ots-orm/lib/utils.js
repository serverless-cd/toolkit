"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQuery = exports.wrapRows = exports.wrapRow = exports.wrapAttributes = exports.longToValue = exports.nullToString = exports.valueToLong = exports.stringToNested = exports.objectToString = void 0;
const tablestore_1 = require("tablestore");
function objectToString(value) {
    if (typeof value === 'object') {
        const protoName = Object.getPrototypeOf(value).constructor.name;
        if (protoName === 'Object' || protoName === 'Array') {
            try {
                return JSON.stringify(value);
            }
            catch (e) {
                console.warn(e);
            }
        }
    }
    return value;
}
exports.objectToString = objectToString;
function stringToNested(value) {
    if (typeof value === 'string' && /(^\[.*\]$)|(^\{.*\}$)/.test(value)) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            console.warn(e);
        }
    }
    return value;
}
exports.stringToNested = stringToNested;
function valueToLong(value) {
    if (typeof value === 'number' && value % 1 === 0) {
        return tablestore_1.Long.fromNumber(value);
    }
    return value;
}
exports.valueToLong = valueToLong;
function nullToString(value) {
    return value === null ? 'null' : value;
}
exports.nullToString = nullToString;
function longToValue(value) {
    if (typeof value === 'object' && Object.getPrototypeOf(value).constructor.name === 'Int64') {
        // @ts-ignore
        return value.toNumber();
    }
    if (value === 'null') {
        return null;
    }
    return value;
}
exports.longToValue = longToValue;
const wrapAttributes = (attributes = {}) => {
    const attributeColumns = [];
    const newAttributes = [];
    for (const key in attributes) {
        const ele = attributes[key];
        if (ele || ele === false) {
            newAttributes.push(key);
        }
    }
    newAttributes.forEach((field) => {
        let value = nullToString(attributes[field]);
        value = objectToString(value);
        value = valueToLong(value);
        attributeColumns.push({ [field]: value });
    });
    return attributeColumns;
};
exports.wrapAttributes = wrapAttributes;
const wrapRow = (rowData) => {
    let { primaryKey, attributes } = rowData || {};
    primaryKey = primaryKey || [];
    attributes = attributes || [];
    const data = {};
    primaryKey.forEach((col) => {
        data[col.name] = longToValue(stringToNested(col.value));
    });
    attributes.forEach((col) => {
        data[col.columnName] = longToValue(stringToNested(col.columnValue));
    });
    return data;
};
exports.wrapRow = wrapRow;
const wrapRows = (rows = []) => {
    return rows.map(exports.wrapRow);
};
exports.wrapRows = wrapRows;
const orderQuery = (orderKeys) => {
    let fieldSortList = [];
    orderKeys.forEach((fieldName) => {
        fieldSortList.push({
            fieldSort: {
                fieldName,
                order: tablestore_1.SortOrder.SORT_ORDER_DESC,
            },
        });
    });
    console.debug("fieldSort config:", fieldSortList);
    return {
        sorters: fieldSortList,
    };
};
exports.orderQuery = orderQuery;
//# sourceMappingURL=utils.js.map