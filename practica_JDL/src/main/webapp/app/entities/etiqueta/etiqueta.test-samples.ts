import { IEtiqueta, NewEtiqueta } from './etiqueta.model';

export const sampleWithRequiredData: IEtiqueta = {
  id: 3870,
};

export const sampleWithPartialData: IEtiqueta = {
  id: 7941,
};

export const sampleWithFullData: IEtiqueta = {
  id: 32506,
  nombreEtiqueta: 'wreak',
  mensajes: 'phooey aboard windy',
};

export const sampleWithNewData: NewEtiqueta = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
