import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import MensajePrivado from './mensaje-privado';
import MensajePrivadoDetail from './mensaje-privado-detail';
import MensajePrivadoUpdate from './mensaje-privado-update';
import MensajePrivadoDeleteDialog from './mensaje-privado-delete-dialog';

const MensajePrivadoRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<MensajePrivado />} />
    <Route path="new" element={<MensajePrivadoUpdate />} />
    <Route path=":id">
      <Route index element={<MensajePrivadoDetail />} />
      <Route path="edit" element={<MensajePrivadoUpdate />} />
      <Route path="delete" element={<MensajePrivadoDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default MensajePrivadoRoutes;
