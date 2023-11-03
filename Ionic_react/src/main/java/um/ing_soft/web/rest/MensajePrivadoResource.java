package um.ing_soft.web.rest;

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
import um.ing_soft.domain.MensajePrivado;
import um.ing_soft.repository.MensajePrivadoRepository;
import um.ing_soft.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link um.ing_soft.domain.MensajePrivado}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MensajePrivadoResource {

    private final Logger log = LoggerFactory.getLogger(MensajePrivadoResource.class);

    private static final String ENTITY_NAME = "mensajePrivado";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MensajePrivadoRepository mensajePrivadoRepository;

    public MensajePrivadoResource(MensajePrivadoRepository mensajePrivadoRepository) {
        this.mensajePrivadoRepository = mensajePrivadoRepository;
    }

    /**
     * {@code POST  /mensaje-privados} : Create a new mensajePrivado.
     *
     * @param mensajePrivado the mensajePrivado to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mensajePrivado, or with status {@code 400 (Bad Request)} if the mensajePrivado has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mensaje-privados")
    public ResponseEntity<MensajePrivado> createMensajePrivado(@RequestBody MensajePrivado mensajePrivado) throws URISyntaxException {
        log.debug("REST request to save MensajePrivado : {}", mensajePrivado);
        if (mensajePrivado.getId() != null) {
            throw new BadRequestAlertException("A new mensajePrivado cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MensajePrivado result = mensajePrivadoRepository.save(mensajePrivado);
        return ResponseEntity
            .created(new URI("/api/mensaje-privados/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mensaje-privados/:id} : Updates an existing mensajePrivado.
     *
     * @param id the id of the mensajePrivado to save.
     * @param mensajePrivado the mensajePrivado to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mensajePrivado,
     * or with status {@code 400 (Bad Request)} if the mensajePrivado is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mensajePrivado couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mensaje-privados/{id}")
    public ResponseEntity<MensajePrivado> updateMensajePrivado(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MensajePrivado mensajePrivado
    ) throws URISyntaxException {
        log.debug("REST request to update MensajePrivado : {}, {}", id, mensajePrivado);
        if (mensajePrivado.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mensajePrivado.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mensajePrivadoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MensajePrivado result = mensajePrivadoRepository.save(mensajePrivado);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mensajePrivado.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mensaje-privados/:id} : Partial updates given fields of an existing mensajePrivado, field will ignore if it is null
     *
     * @param id the id of the mensajePrivado to save.
     * @param mensajePrivado the mensajePrivado to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mensajePrivado,
     * or with status {@code 400 (Bad Request)} if the mensajePrivado is not valid,
     * or with status {@code 404 (Not Found)} if the mensajePrivado is not found,
     * or with status {@code 500 (Internal Server Error)} if the mensajePrivado couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mensaje-privados/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MensajePrivado> partialUpdateMensajePrivado(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MensajePrivado mensajePrivado
    ) throws URISyntaxException {
        log.debug("REST request to partial update MensajePrivado partially : {}, {}", id, mensajePrivado);
        if (mensajePrivado.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mensajePrivado.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mensajePrivadoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MensajePrivado> result = mensajePrivadoRepository
            .findById(mensajePrivado.getId())
            .map(existingMensajePrivado -> {
                if (mensajePrivado.getTexto() != null) {
                    existingMensajePrivado.setTexto(mensajePrivado.getTexto());
                }
                if (mensajePrivado.getFecha() != null) {
                    existingMensajePrivado.setFecha(mensajePrivado.getFecha());
                }

                return existingMensajePrivado;
            })
            .map(mensajePrivadoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mensajePrivado.getId().toString())
        );
    }

    /**
     * {@code GET  /mensaje-privados} : get all the mensajePrivados.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mensajePrivados in body.
     */
    @GetMapping("/mensaje-privados")
    public List<MensajePrivado> getAllMensajePrivados(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all MensajePrivados");
        if (eagerload) {
            return mensajePrivadoRepository.findAllWithEagerRelationships();
        } else {
            return mensajePrivadoRepository.findAll();
        }
    }

    /**
     * {@code GET  /mensaje-privados/:id} : get the "id" mensajePrivado.
     *
     * @param id the id of the mensajePrivado to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mensajePrivado, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mensaje-privados/{id}")
    public ResponseEntity<MensajePrivado> getMensajePrivado(@PathVariable Long id) {
        log.debug("REST request to get MensajePrivado : {}", id);
        Optional<MensajePrivado> mensajePrivado = mensajePrivadoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(mensajePrivado);
    }

    /**
     * {@code DELETE  /mensaje-privados/:id} : delete the "id" mensajePrivado.
     *
     * @param id the id of the mensajePrivado to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mensaje-privados/{id}")
    public ResponseEntity<Void> deleteMensajePrivado(@PathVariable Long id) {
        log.debug("REST request to delete MensajePrivado : {}", id);
        mensajePrivadoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
