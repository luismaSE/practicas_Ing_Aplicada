import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Mensaje from './mensaje';
import Usuario from './usuario';
import MensajePrivado from './mensaje-privado';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="mensaje/*" element={<Mensaje />} />
        <Route path="usuario/*" element={<Usuario />} />
        <Route path="mensaje-privado/*" element={<MensajePrivado />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
