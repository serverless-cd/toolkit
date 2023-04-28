import { get, isEmpty, toUpper } from 'lodash';
import getAccountId from './get-account-id';
export { default as getAccountId } from './get-account-id';

class Credentials {
    constructor(private inputs: Record<string, any>, private context: Record<string, any>) { }
    private transformKey(value: Record<string, any>) {
        const obj = {} as any;
        for (const key in value) {
            obj[toUpper(key)] = value[key];
        }
        return obj;
    }
    private async format(obj: Record<string, any>) {
        const data = {
            accessKeyId: obj.ACCESSKEYID,
            accessKeySecret: obj.ACCESSKEYSECRET,
            securityToken: obj.SECURITYTOKEN,
        }
        const accountId = obj.ACCOUNTID;
        if (accountId) {
            return { ...data, accountId };
        }
        return { ...data, accountId: await getAccountId(data) };

    }

    async run() {
        const newInputs = this.transformKey(this.inputs);
        const ACCESSKEYID = get(newInputs, 'ACCESSKEYID');
        const ACCESSKEYSECRET = get(newInputs, 'ACCESSKEYSECRET');
        if (ACCESSKEYID && ACCESSKEYSECRET) {
            return this.format(newInputs);
        }
        const newCredentials = get(this.inputs, 'credentials')
        if (!isEmpty(newCredentials)) {
            return this.format(this.transformKey(newCredentials));
        }

        const newSts = get(this.context, 'sts')
        if (!isEmpty(newSts)) {
            const formatSts = this.transformKey(newSts)
            formatSts.ACCOUNTID = formatSts.ACCOUNTID || get(this.context, 'uid')
            return this.format(formatSts);
        }

        const newCloudSecrets = get(this.context, 'inputs.cloudSecrets')
        if (!isEmpty(newCloudSecrets)) {
            return this.format(this.transformKey(newCloudSecrets));
        }

    }

}

export const getCredentials = async (inputs: Record<string, any>, context: Record<string, any>) => {
    return await new Credentials(inputs, context).run();
}