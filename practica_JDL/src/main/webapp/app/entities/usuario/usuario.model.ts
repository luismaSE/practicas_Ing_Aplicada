import { IMuroUsuario } from 'app/entities/muro-usuario/muro-usuario.model';

export interface IUsuario {
  id: number;
  nombreUsuario?: string | null;
  correo?: string | null;
  clave?: string | null;
  nombreCompleto?: string | null;
  descripcion?: string | null;
  seguidos?: string | null;
  seguidores?: number | null;
  muro?: string | null;
  mensajes?: string | null;
  muro?: Pick<IMuroUsuario, 'id'> | null;
  seguidos?: Pick<IUsuario, 'id'>[] | null;
  seguidores?: Pick<IUsuario, 'id'>[] | null;
}

export type NewUsuario = Omit<IUsuario, 'id'> & { id: null };
