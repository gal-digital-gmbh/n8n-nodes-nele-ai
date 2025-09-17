import { backgroundOptions, qualityOptions, sizeOptions, styleOptions } from './options';
import { assertParamIsString } from '../../../support/asserts';
import type { LoadOptions } from '../types/load-options';

export const imageGenerationLoadOptions: LoadOptions = {
  async imageGenerationLoadQualityOptions(this) {
    const model = this.getNodeParameter('model', '');
    assertParamIsString('model', model, this.getNode());

    return qualityOptions[model as keyof typeof qualityOptions] ?? [];
  },

  async imageGenerationLoadSizeOptions(this) {
    const model = this.getNodeParameter('model', '');
    assertParamIsString('model', model, this.getNode());

    return sizeOptions[model as keyof typeof sizeOptions] ?? [];
  },

  async imageGenerationLoadStyleOptions(this) {
    const model = this.getNodeParameter('model', '');
    assertParamIsString('model', model, this.getNode());

    return styleOptions[model as keyof typeof styleOptions] ?? [];
  },

  async imageGenerationLoadBackgroundOptions(this) {
    const model = this.getNodeParameter('model', '');
    assertParamIsString('model', model, this.getNode());

    return backgroundOptions[model as keyof typeof backgroundOptions] ?? [];
  },
};
