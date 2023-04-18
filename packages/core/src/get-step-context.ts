import { find, isEmpty } from "lodash";

function getStepContext(context: Record<string, any>) {
    const step = find(context.steps, { stepCount: context.stepCount });
    if (isEmpty(step)) {
        throw new Error(`Step ${context.stepCount} not found`);
    }
    if (step.type === 'run') {
        return { run: step }
    }
    if (step.type === 'postRun') {
        return { run: find(context.steps, { stepCount: step.runstepCount }), postRun: step }
    }
    return { run: step }
}

export default getStepContext;
