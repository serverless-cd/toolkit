import { includes, startsWith, endsWith } from 'lodash';
import * as path from 'path';
import * as fs from 'fs-extra';
import crypto from 'crypto'
const artTemplate = require('art-template');

export const hashFile = (filename: string) => {
    const data = fs.readFileSync(filename);
    const hash = crypto.createHash('sha1');
    hash.update(data);
    const sha1 = hash.digest('hex');
    return sha1;
}


const getArtTemplate = (context: Record<string, any> = {}) => {
    const { cwd = process.cwd() } = context;
    artTemplate.defaults.escape = false;
    artTemplate.defaults.imports.contains = includes;
    artTemplate.defaults.imports.startsWith = startsWith;
    artTemplate.defaults.imports.endsWith = endsWith;
    artTemplate.defaults.imports.toJSON = (value: any) => {
        return typeof value === 'object' ? `"${JSON.stringify(value, null, 2)}"` : value;
    };
    artTemplate.defaults.imports.hashFile = (filePath: string) => {
        const newPath = path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath);
        return hashFile(newPath);
    }
    return artTemplate;
}
export default getArtTemplate;
