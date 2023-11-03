import { IMuroUsuario, NewMuroUsuario } from './muro-usuario.model';

export const sampleWithRequiredData: IMuroUsuario = {
  id: 27285,
};

export const sampleWithPartialData: IMuroUsuario = {
  id: 2676,
  usuario: 'query worrisome frail',
};

export const sampleWithFullData: IMuroUsuario = {
  id: 26164,
  usuario: 'where',
};

export const sampleWithNewData: NewMuroUsuario = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
