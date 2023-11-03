import dayjs from 'dayjs';
import { IUsuario } from 'app/shared/model/usuario.model';

export interface IMensaje {
  id?: number;
  texto?: string | null;
  fecha?: string | null;
  autor?: IUsuario | null;
  menciones?: IUsuario[] | null;
}

export const defaultValue: Readonly<IMensaje> = {};
