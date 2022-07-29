import fse from 'fs-extra';

export default function logger(message: string, filePath: string) {
  console.log(message);

  fse.appendFileSync(filePath, message);
}
