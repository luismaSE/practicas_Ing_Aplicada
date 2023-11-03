package um.ing_soft.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import um.ing_soft.web.rest.TestUtil;

class MensajePrivadoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MensajePrivado.class);
        MensajePrivado mensajePrivado1 = new MensajePrivado();
        mensajePrivado1.setId(1L);
        MensajePrivado mensajePrivado2 = new MensajePrivado();
        mensajePrivado2.setId(mensajePrivado1.getId());
        assertThat(mensajePrivado1).isEqualTo(mensajePrivado2);
        mensajePrivado2.setId(2L);
        assertThat(mensajePrivado1).isNotEqualTo(mensajePrivado2);
        mensajePrivado1.setId(null);
        assertThat(mensajePrivado1).isNotEqualTo(mensajePrivado2);
    }
}
