import { Long, Row, SortOrder } from 'tablestore';

export function objectToString(value: object | unknown): string {
  if (typeof value === 'object') {
    const protoName = Object.getPrototypeOf(value).constructor.name;
    if (protoName === 'Object' || protoName === 'Array') {
      try {
        return JSON.stringify(value);
      } catch (e) {
        console.warn(e);
      }
    }
  }
  return value as string;
}

export function stringToNested(value: string | unknown): object {
  if (typeof value === 'string' && /(^\[.*\]$)|(^\{.*\}$)/.test(value)) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn(e);
    }
  }
  return value as object;
}

export function valueToLong(value: unknown): any {
  if (typeof value === 'number' && value % 1 === 0) {
    return Long.fromNumber(value);
  }
  return value;
}

export function nullToString(value: unknown): any {
  return value === null ? 'null' : value;
}

export function longToValue(value: unknown): any {
  if (typeof value === 'object' && Object.getPrototypeOf(value).constructor.name === 'Int64') {
    // @ts-ignore
    return value.toNumber();
  }
  if (value === 'null') {
    return null;
  }
  return value;
}

export const wrapAttributes = (attributes: Record<string, any> = {}) => {
  const attributeColumns: any = [];
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

export const wrapRow = (rowData: Row): Record<string, any> => {
  let { primaryKey, attributes } = rowData || {} as Row;
  primaryKey = primaryKey || [];
  attributes = attributes || [];
  const data: any = {};
  primaryKey.forEach((col) => {
    data[col.name] = longToValue(stringToNested(col.value));
  });
  attributes.forEach((col) => {
    data[col.columnName] = longToValue(stringToNested(col.columnValue));
  });
  return data;
};

export const wrapRows = (rows = []): any[] => {
  return rows.map(wrapRow);
};

export const orderQuery = (orderKeys: string[]) => {
  let fieldSortList: any[] = [];
  orderKeys.forEach((fieldName) => {
    fieldSortList.push({
      fieldSort: {
        fieldName,
        order: SortOrder.SORT_ORDER_DESC,
      },
    });
  });
  console.debug("fieldSort config:", fieldSortList);
  return {
    sorters: fieldSortList,
  };
};
