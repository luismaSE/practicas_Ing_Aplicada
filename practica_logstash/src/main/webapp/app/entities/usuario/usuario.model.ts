import { IMensaje } from 'app/entities/mensaje/mensaje.model';

export interface IUsuario {
  id: number;
  alias?: string | null;
  nombre?: string | null;
  correo?: string | null;
  contrasenia?: string | null;
  descripcion?: string | null;
  admin?: boolean | null;
  siguiendos?: Pick<IUsuario, 'id'>[] | null;
  mensajeMencionado?: Pick<IMensaje, 'id'> | null;
  seguidores?: Pick<IUsuario, 'id'>[] | null;
}

export type NewUsuario = Omit<IUsuario, 'id'> & { id: null };
