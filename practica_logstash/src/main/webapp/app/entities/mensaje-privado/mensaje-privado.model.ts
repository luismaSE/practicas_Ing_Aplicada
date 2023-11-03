import dayjs from 'dayjs/esm';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IMensajePrivado {
  id: number;
  texto?: string | null;
  fecha?: dayjs.Dayjs | null;
  autor?: Pick<IUsuario, 'id' | 'alias'> | null;
  destino?: Pick<IUsuario, 'id' | 'alias'> | null;
}

export type NewMensajePrivado = Omit<IMensajePrivado, 'id'> & { id: null };
