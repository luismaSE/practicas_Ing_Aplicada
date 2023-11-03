package isa_logstash.domain;

import static org.assertj.core.api.Assertions.assertThat;

import isa_logstash.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TablonDeAnunciosTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TablonDeAnuncios.class);
        TablonDeAnuncios tablonDeAnuncios1 = new TablonDeAnuncios();
        tablonDeAnuncios1.setId(1L);
        TablonDeAnuncios tablonDeAnuncios2 = new TablonDeAnuncios();
        tablonDeAnuncios2.setId(tablonDeAnuncios1.getId());
        assertThat(tablonDeAnuncios1).isEqualTo(tablonDeAnuncios2);
        tablonDeAnuncios2.setId(2L);
        assertThat(tablonDeAnuncios1).isNotEqualTo(tablonDeAnuncios2);
        tablonDeAnuncios1.setId(null);
        assertThat(tablonDeAnuncios1).isNotEqualTo(tablonDeAnuncios2);
    }
}
