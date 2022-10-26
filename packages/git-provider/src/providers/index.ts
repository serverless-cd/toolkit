import { PROVIDER } from '../types/input';
import Github from './github';
import Gitee from './gitee';
import Codeup from './codeup';
import Gitlib from './gitlib';


export default {
  [PROVIDER.github]: Github,
  [PROVIDER.gitee]: Gitee,
  [PROVIDER.codeup]: Codeup,
  [PROVIDER.gitlib]: Gitlib,
}