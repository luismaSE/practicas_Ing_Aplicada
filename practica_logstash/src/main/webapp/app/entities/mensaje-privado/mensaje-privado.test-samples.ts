import dayjs from 'dayjs/esm';

import { IMensajePrivado, NewMensajePrivado } from './mensaje-privado.model';

export const sampleWithRequiredData: IMensajePrivado = {
  id: 28740,
};

export const sampleWithPartialData: IMensajePrivado = {
  id: 72613,
};

export const sampleWithFullData: IMensajePrivado = {
  id: 10429,
  texto: 'virtual',
  fecha: dayjs('2023-10-27'),
};

export const sampleWithNewData: NewMensajePrivado = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
