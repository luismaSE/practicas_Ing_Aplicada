import { IMensaje } from 'app/entities/mensaje/mensaje.model';

export interface IEtiqueta {
  id: number;
  nombreEtiqueta?: string | null;
  mensajes?: string | null;
  mensajes?: Pick<IMensaje, 'id'>[] | null;
}

export type NewEtiqueta = Omit<IEtiqueta, 'id'> & { id: null };
