export interface IMuroUsuario {
  id: number;
  usuario?: string | null;
}

export type NewMuroUsuario = Omit<IMuroUsuario, 'id'> & { id: null };
