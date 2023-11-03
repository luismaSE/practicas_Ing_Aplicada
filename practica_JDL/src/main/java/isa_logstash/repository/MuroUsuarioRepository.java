package isa_logstash.repository;

import isa_logstash.domain.MuroUsuario;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the MuroUsuario entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MuroUsuarioRepository extends JpaRepository<MuroUsuario, Long> {}
