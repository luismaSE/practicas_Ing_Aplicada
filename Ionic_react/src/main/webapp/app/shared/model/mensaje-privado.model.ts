import dayjs from 'dayjs';
import { IUsuario } from 'app/shared/model/usuario.model';

export interface IMensajePrivado {
  id?: number;
  texto?: string | null;
  fecha?: string | null;
  autor?: IUsuario | null;
  destino?: IUsuario | null;
}

export const defaultValue: Readonly<IMensajePrivado> = {};
