import React from 'react';
import { Translate } from 'react-jhipster';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/mensaje">
        <Translate contentKey="global.menu.entities.mensaje" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/usuario">
        <Translate contentKey="global.menu.entities.usuario" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/mensaje-privado">
        <Translate contentKey="global.menu.entities.mensajePrivado" />
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
