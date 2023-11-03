package um.ing_soft.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import um.ing_soft.domain.MensajePrivado;

/**
 * Spring Data JPA repository for the MensajePrivado entity.
 */
@Repository
public interface MensajePrivadoRepository extends JpaRepository<MensajePrivado, Long> {
    default Optional<MensajePrivado> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<MensajePrivado> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<MensajePrivado> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct mensajePrivado from MensajePrivado mensajePrivado left join fetch mensajePrivado.autor left join fetch mensajePrivado.destino",
        countQuery = "select count(distinct mensajePrivado) from MensajePrivado mensajePrivado"
    )
    Page<MensajePrivado> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct mensajePrivado from MensajePrivado mensajePrivado left join fetch mensajePrivado.autor left join fetch mensajePrivado.destino"
    )
    List<MensajePrivado> findAllWithToOneRelationships();

    @Query(
        "select mensajePrivado from MensajePrivado mensajePrivado left join fetch mensajePrivado.autor left join fetch mensajePrivado.destino where mensajePrivado.id =:id"
    )
    Optional<MensajePrivado> findOneWithToOneRelationships(@Param("id") Long id);
}
