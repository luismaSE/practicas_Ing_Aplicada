import { IMensaje } from 'app/shared/model/mensaje.model';
import { IMensajePrivado } from 'app/shared/model/mensaje-privado.model';

export interface IUsuario {
  id?: number;
  alias?: string | null;
  nombre?: string | null;
  correo?: string | null;
  contrasenia?: string | null;
  descripcion?: string | null;
  admin?: boolean | null;
  siguiendos?: IUsuario[] | null;
  mensajePublicado?: IMensaje | null;
  mensajePrivadoEnviado?: IMensajePrivado | null;
  mensajePrivadoRecibido?: IMensajePrivado | null;
  mensajeMencionado?: IMensaje | null;
  seguidores?: IUsuario[] | null;
}

export const defaultValue: Readonly<IUsuario> = {
  admin: false,
};
