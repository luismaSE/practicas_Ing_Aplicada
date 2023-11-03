package um.ing_soft.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import um.ing_soft.domain.Usuario;

public interface UsuarioRepositoryWithBagRelationships {
    Optional<Usuario> fetchBagRelationships(Optional<Usuario> usuario);

    List<Usuario> fetchBagRelationships(List<Usuario> usuarios);

    Page<Usuario> fetchBagRelationships(Page<Usuario> usuarios);
}
