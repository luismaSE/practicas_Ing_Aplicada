import dayjs from 'dayjs/esm';

import { IMensaje, NewMensaje } from './mensaje.model';

export const sampleWithRequiredData: IMensaje = {
  id: 29972,
};

export const sampleWithPartialData: IMensaje = {
  id: 19736,
  textoMensaje: 'once',
};

export const sampleWithFullData: IMensaje = {
  id: 15893,
  autor: 'inasmuch',
  fechaPublicacion: dayjs('2023-10-25T23:58'),
  textoMensaje: 'carnation that icy',
  etiquetas: 'ugh',
};

export const sampleWithNewData: NewMensaje = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
