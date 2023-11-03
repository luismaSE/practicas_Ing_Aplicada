package isa_logstash.domain;

import static org.assertj.core.api.Assertions.assertThat;

import isa_logstash.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MuroUsuarioTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MuroUsuario.class);
        MuroUsuario muroUsuario1 = new MuroUsuario();
        muroUsuario1.setId(1L);
        MuroUsuario muroUsuario2 = new MuroUsuario();
        muroUsuario2.setId(muroUsuario1.getId());
        assertThat(muroUsuario1).isEqualTo(muroUsuario2);
        muroUsuario2.setId(2L);
        assertThat(muroUsuario1).isNotEqualTo(muroUsuario2);
        muroUsuario1.setId(null);
        assertThat(muroUsuario1).isNotEqualTo(muroUsuario2);
    }
}
