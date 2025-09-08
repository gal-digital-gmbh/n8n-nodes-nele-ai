import type { INodeType } from 'n8n-workflow';

export type LoadOptions = Exclude<
  Exclude<INodeType['methods'], undefined>['loadOptions'],
  undefined
>;
