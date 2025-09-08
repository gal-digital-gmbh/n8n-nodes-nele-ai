import type { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';
import { env } from '../../config/env';

export class NeleAiApi implements ICredentialType {
  name = env.credentials.apiKey;
  displayName = 'nele.ai API';
  documentationUrl = env.docs.url;

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '={{"Bearer " + $credentials.apiKey}}',
      },
    },
  };
}
