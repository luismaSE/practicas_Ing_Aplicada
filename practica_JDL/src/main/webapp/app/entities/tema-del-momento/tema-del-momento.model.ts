export interface ITemaDelMomento {
  id: number;
  etiqueta?: string | null;
  numeroRepeticiones?: number | null;
}

export type NewTemaDelMomento = Omit<ITemaDelMomento, 'id'> & { id: null };
