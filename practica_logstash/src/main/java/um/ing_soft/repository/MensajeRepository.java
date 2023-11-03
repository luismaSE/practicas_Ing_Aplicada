package um.ing_soft.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import um.ing_soft.domain.Mensaje;

/**
 * Spring Data JPA repository for the Mensaje entity.
 */
@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    default Optional<Mensaje> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Mensaje> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Mensaje> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct mensaje from Mensaje mensaje left join fetch mensaje.autor",
        countQuery = "select count(distinct mensaje) from Mensaje mensaje"
    )
    Page<Mensaje> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct mensaje from Mensaje mensaje left join fetch mensaje.autor")
    List<Mensaje> findAllWithToOneRelationships();

    @Query("select mensaje from Mensaje mensaje left join fetch mensaje.autor where mensaje.id =:id")
    Optional<Mensaje> findOneWithToOneRelationships(@Param("id") Long id);
}
