package isa_logstash.repository;

import isa_logstash.domain.Mensaje;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface MensajeRepositoryWithBagRelationships {
    Optional<Mensaje> fetchBagRelationships(Optional<Mensaje> mensaje);

    List<Mensaje> fetchBagRelationships(List<Mensaje> mensajes);

    Page<Mensaje> fetchBagRelationships(Page<Mensaje> mensajes);
}
