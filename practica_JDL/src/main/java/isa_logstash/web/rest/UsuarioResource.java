package isa_logstash.web.rest;

import isa_logstash.domain.Usuario;
import isa_logstash.repository.UsuarioRepository;
import isa_logstash.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link isa_logstash.domain.Usuario}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UsuarioResource {

    private final Logger log = LoggerFactory.getLogger(UsuarioResource.class);

    private static final String ENTITY_NAME = "usuario";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UsuarioRepository usuarioRepository;

    public UsuarioResource(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * {@code POST  /usuarios} : Create a new usuario.
     *
     * @param usuario the usuario to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new usuario, or with status {@code 400 (Bad Request)} if the usuario has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/usuarios")
    public ResponseEntity<Usuario> createUsuario(@Valid @RequestBody Usuario usuario) throws URISyntaxException {
        log.debug("REST request to save Usuario : {}", usuario);
        if (usuario.getId() != null) {
            throw new BadRequestAlertException("A new usuario cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Usuario result = usuarioRepository.save(usuario);
        return ResponseEntity
            .created(new URI("/api/usuarios/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /usuarios/:id} : Updates an existing usuario.
     *
     * @param id the id of the usuario to save.
     * @param usuario the usuario to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated usuario,
     * or with status {@code 400 (Bad Request)} if the usuario is not valid,
     * or with status {@code 500 (Internal Server Error)} if the usuario couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<Usuario> updateUsuario(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Usuario usuario
    ) throws URISyntaxException {
        log.debug("REST request to update Usuario : {}, {}", id, usuario);
        if (usuario.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, usuario.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!usuarioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Usuario result = usuarioRepository.save(usuario);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, usuario.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /usuarios/:id} : Partial updates given fields of an existing usuario, field will ignore if it is null
     *
     * @param id the id of the usuario to save.
     * @param usuario the usuario to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated usuario,
     * or with status {@code 400 (Bad Request)} if the usuario is not valid,
     * or with status {@code 404 (Not Found)} if the usuario is not found,
     * or with status {@code 500 (Internal Server Error)} if the usuario couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/usuarios/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Usuario> partialUpdateUsuario(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Usuario usuario
    ) throws URISyntaxException {
        log.debug("REST request to partial update Usuario partially : {}, {}", id, usuario);
        if (usuario.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, usuario.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!usuarioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Usuario> result = usuarioRepository
            .findById(usuario.getId())
            .map(existingUsuario -> {
                if (usuario.getNombreUsuario() != null) {
                    existingUsuario.setNombreUsuario(usuario.getNombreUsuario());
                }
                if (usuario.getCorreo() != null) {
                    existingUsuario.setCorreo(usuario.getCorreo());
                }
                if (usuario.getClave() != null) {
                    existingUsuario.setClave(usuario.getClave());
                }
                if (usuario.getNombreCompleto() != null) {
                    existingUsuario.setNombreCompleto(usuario.getNombreCompleto());
                }
                if (usuario.getDescripcion() != null) {
                    existingUsuario.setDescripcion(usuario.getDescripcion());
                }
                if (usuario.getSeguidos() != null) {
                    existingUsuario.setSeguidos(usuario.getSeguidos());
                }
                if (usuario.getSeguidores() != null) {
                    existingUsuario.setSeguidores(usuario.getSeguidores());
                }
                if (usuario.getMuro() != null) {
                    existingUsuario.setMuro(usuario.getMuro());
                }
                if (usuario.getMensajes() != null) {
                    existingUsuario.setMensajes(usuario.getMensajes());
                }

                return existingUsuario;
            })
            .map(usuarioRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, usuario.getId().toString())
        );
    }

    /**
     * {@code GET  /usuarios} : get all the usuarios.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of usuarios in body.
     */
    @GetMapping("/usuarios")
    public List<Usuario> getAllUsuarios(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Usuarios");
        if (eagerload) {
            return usuarioRepository.findAllWithEagerRelationships();
        } else {
            return usuarioRepository.findAll();
        }
    }

    /**
     * {@code GET  /usuarios/:id} : get the "id" usuario.
     *
     * @param id the id of the usuario to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the usuario, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/usuarios/{id}")
    public ResponseEntity<Usuario> getUsuario(@PathVariable Long id) {
        log.debug("REST request to get Usuario : {}", id);
        Optional<Usuario> usuario = usuarioRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(usuario);
    }

    /**
     * {@code DELETE  /usuarios/:id} : delete the "id" usuario.
     *
     * @param id the id of the usuario to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        log.debug("REST request to delete Usuario : {}", id);
        usuarioRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
