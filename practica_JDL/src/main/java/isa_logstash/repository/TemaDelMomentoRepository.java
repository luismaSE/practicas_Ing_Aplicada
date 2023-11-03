package isa_logstash.repository;

import isa_logstash.domain.TemaDelMomento;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TemaDelMomento entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TemaDelMomentoRepository extends JpaRepository<TemaDelMomento, Long> {}
