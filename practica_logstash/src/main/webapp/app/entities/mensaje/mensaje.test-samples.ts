import dayjs from 'dayjs/esm';

import { IMensaje, NewMensaje } from './mensaje.model';

export const sampleWithRequiredData: IMensaje = {
  id: 80993,
};

export const sampleWithPartialData: IMensaje = {
  id: 64185,
  texto: 'Home',
};

export const sampleWithFullData: IMensaje = {
  id: 66338,
  texto: 'bifurcated ability',
  fecha: dayjs('2023-10-27'),
};

export const sampleWithNewData: NewMensaje = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
