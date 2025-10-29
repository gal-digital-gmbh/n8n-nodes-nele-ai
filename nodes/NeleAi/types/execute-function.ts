import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export type ExecuteFunction = (root: IExecuteFunctions, itemIndex: number) => Promise<INodeExecutionData[]>;
