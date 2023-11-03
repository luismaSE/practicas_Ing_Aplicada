package isa_logstash.repository;

import isa_logstash.domain.TablonDeAnuncios;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TablonDeAnuncios entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TablonDeAnunciosRepository extends JpaRepository<TablonDeAnuncios, Long> {}
