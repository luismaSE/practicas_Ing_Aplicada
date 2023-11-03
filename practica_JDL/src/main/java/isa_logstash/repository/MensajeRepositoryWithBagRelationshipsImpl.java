package isa_logstash.repository;

import isa_logstash.domain.Mensaje;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class MensajeRepositoryWithBagRelationshipsImpl implements MensajeRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Mensaje> fetchBagRelationships(Optional<Mensaje> mensaje) {
        return mensaje.map(this::fetchEtiquetas);
    }

    @Override
    public Page<Mensaje> fetchBagRelationships(Page<Mensaje> mensajes) {
        return new PageImpl<>(fetchBagRelationships(mensajes.getContent()), mensajes.getPageable(), mensajes.getTotalElements());
    }

    @Override
    public List<Mensaje> fetchBagRelationships(List<Mensaje> mensajes) {
        return Optional.of(mensajes).map(this::fetchEtiquetas).orElse(Collections.emptyList());
    }

    Mensaje fetchEtiquetas(Mensaje result) {
        return entityManager
            .createQuery("select mensaje from Mensaje mensaje left join fetch mensaje.etiquetas where mensaje.id = :id", Mensaje.class)
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Mensaje> fetchEtiquetas(List<Mensaje> mensajes) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, mensajes.size()).forEach(index -> order.put(mensajes.get(index).getId(), index));
        List<Mensaje> result = entityManager
            .createQuery("select mensaje from Mensaje mensaje left join fetch mensaje.etiquetas where mensaje in :mensajes", Mensaje.class)
            .setParameter("mensajes", mensajes)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
