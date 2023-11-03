import mensaje from 'app/entities/mensaje/mensaje.reducer';
import usuario from 'app/entities/usuario/usuario.reducer';
import mensajePrivado from 'app/entities/mensaje-privado/mensaje-privado.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  mensaje,
  usuario,
  mensajePrivado,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
