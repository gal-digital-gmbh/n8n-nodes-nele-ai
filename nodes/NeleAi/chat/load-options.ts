import { assertParamIsString } from 'n8n-workflow';
import { env } from '../../../config/env';
import type { LoadOptions } from '../types/load-options';

type Model = {
  id: string;
  is_usable: boolean;
  provider: string;
  title: string;
};

type Collection = {
  id: string;
  is_usable: boolean;
  title: string;
  enabled_models: string[];
};

type Response = {
  models: Model[];
  team_models: Model[];
  document_collections: Collection[];
};

export const chatCompletionLoadOptions: LoadOptions = {
  async chatCompletionLoadModels(this) {
    const response = (await this.helpers.httpRequestWithAuthentication.call(
      this,
      env.credentials.apiKey,
      {
        method: 'GET',
        url: `${env.baseUrl}/models`,
        json: true,
      },
    )) as Response;

    return [...response.models, ...response.team_models]
      .filter((model) => model.is_usable)
      .map((model) => ({
        name: `${model.provider}: ${model.title}`,
        value: model.id,
      }));
  },

  async chatCompletionLoadCollections(this) {
    const model = this.getNodeParameter('model', '');
    assertParamIsString('model', model, this.getNode());

    const response = (await this.helpers.httpRequestWithAuthentication.call(
      this,
      env.credentials.apiKey,
      {
        method: 'GET',
        url: `${env.baseUrl}/models`,
        json: true,
      },
    )) as Response;

    return response.document_collections
      .filter((collection) => collection.is_usable && collection.enabled_models.includes(model))
      .map((collection) => ({
        name: collection.title,
        value: collection.id,
      }));
  },
};
