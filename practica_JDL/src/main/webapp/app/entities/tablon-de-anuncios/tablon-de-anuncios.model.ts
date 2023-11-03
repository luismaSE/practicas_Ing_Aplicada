export interface ITablonDeAnuncios {
  id: number;
}

export type NewTablonDeAnuncios = Omit<ITablonDeAnuncios, 'id'> & { id: null };
