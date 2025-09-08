import type { INodePropertyRouting, INodeRequestSend } from 'n8n-workflow';

export function routeToParameter(property: string, send?: INodeRequestSend): INodePropertyRouting {
  return {
    send: {
      type: 'body',
      property,
      propertyInDotNotation: true,
      ...send,
    },
  };
}
