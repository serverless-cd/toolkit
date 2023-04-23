import { get } from 'lodash';
import getAccountId from './get-account-id';
export { default as getAccountId } from './get-account-id';

class Credentials {
    constructor(private inputs: Record<string, any>, private context: Record<string, any>) { }
    private getValue(key: string) {
        let value = get(this.inputs, key);
        if (value) return value;
        value = get(this.inputs, `credentials.${key}`);
        if (value) return value;
        value = get(this.context, `sts.${key}`);
        if (value) return value;
        value = get(this.context, `inputs.cloudSecrets.${key}`);
        if (value) return value;
    }
    async run() {
        const accessKeyId = this.getValue('accessKeyId');
        const accessKeySecret = this.getValue('accessKeySecret');
        const securityToken = this.getValue('securityToken');
        const accountId = this.getValue('accountId') || this.getValue('accountID');
        const data = {
            accessKeyId,
            accessKeySecret,
            securityToken,
        }
        if (accountId) {
            return { ...data, accountId };
        }
        return { ...data, accountId: await getAccountId(data) };
    }

}

export const getCredentials = async (inputs: Record<string, any>, context: Record<string, any>) => {
    return await new Credentials(inputs, context).run();
}