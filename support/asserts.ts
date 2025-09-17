import { assert, NodeOperationError } from 'n8n-workflow';
import type { INode } from 'n8n-workflow';

function assertUserInput<T>(condition: T, message: string, node: INode): asserts condition {
  try {
    assert(condition, message);
  }
  catch (e) {
    if (e instanceof Error) {
      // Use level 'info' to prevent reporting to Sentry (only 'error' and 'fatal' levels are reported)
      const nodeError = new NodeOperationError(node, e.message, { level: 'info' });
      nodeError.stack = e.stack;

      throw nodeError;
    }

    throw e;
  }
}

export function assertParamIsString(parameterName: string, value: unknown, node: INode): asserts value is string {
  assertUserInput(typeof value === 'string', `Parameter "${parameterName}" is not string`, node);
}
