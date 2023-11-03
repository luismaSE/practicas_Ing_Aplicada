import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Mensaje from './mensaje';
import MensajeDetail from './mensaje-detail';
import MensajeUpdate from './mensaje-update';
import MensajeDeleteDialog from './mensaje-delete-dialog';

const MensajeRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Mensaje />} />
    <Route path="new" element={<MensajeUpdate />} />
    <Route path=":id">
      <Route index element={<MensajeDetail />} />
      <Route path="edit" element={<MensajeUpdate />} />
      <Route path="delete" element={<MensajeDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default MensajeRoutes;
