package um.ing_soft.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import um.ing_soft.web.rest.TestUtil;

class UsuarioTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Usuario.class);
        Usuario usuario1 = new Usuario();
        usuario1.setId(1L);
        Usuario usuario2 = new Usuario();
        usuario2.setId(usuario1.getId());
        assertThat(usuario1).isEqualTo(usuario2);
        usuario2.setId(2L);
        assertThat(usuario1).isNotEqualTo(usuario2);
        usuario1.setId(null);
        assertThat(usuario1).isNotEqualTo(usuario2);
    }
}
