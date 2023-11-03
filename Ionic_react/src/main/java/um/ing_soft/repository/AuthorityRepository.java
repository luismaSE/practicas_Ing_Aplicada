package um.ing_soft.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import um.ing_soft.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
