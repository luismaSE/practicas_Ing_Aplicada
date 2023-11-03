import { ITablonDeAnuncios, NewTablonDeAnuncios } from './tablon-de-anuncios.model';

export const sampleWithRequiredData: ITablonDeAnuncios = {
  id: 3703,
};

export const sampleWithPartialData: ITablonDeAnuncios = {
  id: 31139,
};

export const sampleWithFullData: ITablonDeAnuncios = {
  id: 8284,
};

export const sampleWithNewData: NewTablonDeAnuncios = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
