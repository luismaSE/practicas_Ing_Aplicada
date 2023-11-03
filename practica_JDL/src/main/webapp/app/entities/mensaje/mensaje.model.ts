import dayjs from 'dayjs/esm';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { IEtiqueta } from 'app/entities/etiqueta/etiqueta.model';

export interface IMensaje {
  id: number;
  autor?: string | null;
  fechaPublicacion?: dayjs.Dayjs | null;
  textoMensaje?: string | null;
  etiquetas?: string | null;
  autor?: Pick<IUsuario, 'id'> | null;
  etiquetas?: Pick<IEtiqueta, 'id'>[] | null;
}

export type NewMensaje = Omit<IMensaje, 'id'> & { id: null };
