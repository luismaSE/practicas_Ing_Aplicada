package isa_logstash.domain;

import static org.assertj.core.api.Assertions.assertThat;

import isa_logstash.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TemaDelMomentoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TemaDelMomento.class);
        TemaDelMomento temaDelMomento1 = new TemaDelMomento();
        temaDelMomento1.setId(1L);
        TemaDelMomento temaDelMomento2 = new TemaDelMomento();
        temaDelMomento2.setId(temaDelMomento1.getId());
        assertThat(temaDelMomento1).isEqualTo(temaDelMomento2);
        temaDelMomento2.setId(2L);
        assertThat(temaDelMomento1).isNotEqualTo(temaDelMomento2);
        temaDelMomento1.setId(null);
        assertThat(temaDelMomento1).isNotEqualTo(temaDelMomento2);
    }
}
