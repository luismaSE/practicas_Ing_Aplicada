package isa_logstash.repository;

import isa_logstash.domain.Usuario;
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
public class UsuarioRepositoryWithBagRelationshipsImpl implements UsuarioRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Usuario> fetchBagRelationships(Optional<Usuario> usuario) {
        return usuario.map(this::fetchSeguidos);
    }

    @Override
    public Page<Usuario> fetchBagRelationships(Page<Usuario> usuarios) {
        return new PageImpl<>(fetchBagRelationships(usuarios.getContent()), usuarios.getPageable(), usuarios.getTotalElements());
    }

    @Override
    public List<Usuario> fetchBagRelationships(List<Usuario> usuarios) {
        return Optional.of(usuarios).map(this::fetchSeguidos).orElse(Collections.emptyList());
    }

    Usuario fetchSeguidos(Usuario result) {
        return entityManager
            .createQuery("select usuario from Usuario usuario left join fetch usuario.seguidos where usuario.id = :id", Usuario.class)
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Usuario> fetchSeguidos(List<Usuario> usuarios) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, usuarios.size()).forEach(index -> order.put(usuarios.get(index).getId(), index));
        List<Usuario> result = entityManager
            .createQuery("select usuario from Usuario usuario left join fetch usuario.seguidos where usuario in :usuarios", Usuario.class)
            .setParameter("usuarios", usuarios)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
