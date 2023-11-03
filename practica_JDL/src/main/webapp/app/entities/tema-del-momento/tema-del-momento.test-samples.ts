import { ITemaDelMomento, NewTemaDelMomento } from './tema-del-momento.model';

export const sampleWithRequiredData: ITemaDelMomento = {
  id: 1779,
};

export const sampleWithPartialData: ITemaDelMomento = {
  id: 10847,
};

export const sampleWithFullData: ITemaDelMomento = {
  id: 10671,
  etiqueta: 'unlike identical blah',
  numeroRepeticiones: 13191,
};

export const sampleWithNewData: NewTemaDelMomento = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
