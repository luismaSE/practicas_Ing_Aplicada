import { IUsuario, NewUsuario } from './usuario.model';

export const sampleWithRequiredData: IUsuario = {
  id: 19585,
};

export const sampleWithPartialData: IUsuario = {
  id: 56175,
  correo: 'Accounts',
  descripcion: 'Avon SAS',
};

export const sampleWithFullData: IUsuario = {
  id: 4097,
  alias: 'Handcrafted Officer',
  nombre: 'Belize',
  correo: 'Plastic synthesizing',
  contrasenia: 'Bedfordshire Ford transmitter',
  descripcion: 'Computer Personal migration',
  admin: true,
};

export const sampleWithNewData: NewUsuario = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
