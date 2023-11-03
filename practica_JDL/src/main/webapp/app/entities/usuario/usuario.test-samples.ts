import { IUsuario, NewUsuario } from './usuario.model';

export const sampleWithRequiredData: IUsuario = {
  id: 30402,
  nombreUsuario: 'wearily while',
};

export const sampleWithPartialData: IUsuario = {
  id: 20436,
  nombreUsuario: 'whereas behind',
  correo: 'outhouse geez besides',
  nombreCompleto: 'general unblock',
  seguidores: 7454,
  muro: 'heavily fortify eek',
};

export const sampleWithFullData: IUsuario = {
  id: 26668,
  nombreUsuario: 'powerless',
  correo: 'wish knuckle',
  clave: 'unfortunate who',
  nombreCompleto: 'uh-huh while',
  descripcion: 'anti',
  seguidos: 'grumpy provision',
  seguidores: 23435,
  muro: 'gah sorrowful',
  mensajes: 'shoe',
};

export const sampleWithNewData: NewUsuario = {
  nombreUsuario: 'skateboard expurgate',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
