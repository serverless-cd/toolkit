import { PROVIDER } from '../types/input';
import Github from './github';
import Gitee from './gitee';
import Codeup from './codeup';
import Gitlab from './gitlab';


export default {
  [PROVIDER.github]: Github,
  [PROVIDER.gitee]: Gitee,
  [PROVIDER.codeup]: Codeup,
  [PROVIDER.gitlab]: Gitlab,
}