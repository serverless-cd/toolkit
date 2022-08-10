class Compiler {
  [key: string]: any;
  constructor() {}
  set(key: string, value: any) {
    this[key] = value;
  }
  get(key: string) {
    return this[key];
  }
}
const compiler = new Compiler();
const p: any = process;
if (!p.SERVERLESS_CD) {
  p.SERVERLESS_CD = compiler;
}

export default compiler;
