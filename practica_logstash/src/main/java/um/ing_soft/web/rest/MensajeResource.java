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
import um.ing_soft.domain.Mensaje;
import um.ing_soft.repository.MensajeRepository;
import um.ing_soft.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link um.ing_soft.domain.Mensaje}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MensajeResource {

    private final Logger log = LoggerFactory.getLogger(MensajeResource.class);

    private static final String ENTITY_NAME = "mensaje";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MensajeRepository mensajeRepository;

    public MensajeResource(MensajeRepository mensajeRepository) {
        this.mensajeRepository = mensajeRepository;
    }

    /**
     * {@code POST  /mensajes} : Create a new mensaje.
     *
     * @param mensaje the mensaje to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mensaje, or with status {@code 400 (Bad Request)} if the mensaje has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mensajes")
    public ResponseEntity<Mensaje> createMensaje(@RequestBody Mensaje mensaje) throws URISyntaxException {
        log.debug("REST request to save Mensaje : {}", mensaje);
        if (mensaje.getId() != null) {
            throw new BadRequestAlertException("A new mensaje cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Mensaje result = mensajeRepository.save(mensaje);
        return ResponseEntity
            .created(new URI("/api/mensajes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mensajes/:id} : Updates an existing mensaje.
     *
     * @param id the id of the mensaje to save.
     * @param mensaje the mensaje to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mensaje,
     * or with status {@code 400 (Bad Request)} if the mensaje is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mensaje couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mensajes/{id}")
    public ResponseEntity<Mensaje> updateMensaje(@PathVariable(value = "id", required = false) final Long id, @RequestBody Mensaje mensaje)
        throws URISyntaxException {
        log.debug("REST request to update Mensaje : {}, {}", id, mensaje);
        if (mensaje.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mensaje.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mensajeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Mensaje result = mensajeRepository.save(mensaje);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mensaje.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mensajes/:id} : Partial updates given fields of an existing mensaje, field will ignore if it is null
     *
     * @param id the id of the mensaje to save.
     * @param mensaje the mensaje to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mensaje,
     * or with status {@code 400 (Bad Request)} if the mensaje is not valid,
     * or with status {@code 404 (Not Found)} if the mensaje is not found,
     * or with status {@code 500 (Internal Server Error)} if the mensaje couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mensajes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Mensaje> partialUpdateMensaje(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Mensaje mensaje
    ) throws URISyntaxException {
        log.debug("REST request to partial update Mensaje partially : {}, {}", id, mensaje);
        if (mensaje.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mensaje.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mensajeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Mensaje> result = mensajeRepository
            .findById(mensaje.getId())
            .map(existingMensaje -> {
                if (mensaje.getTexto() != null) {
                    existingMensaje.setTexto(mensaje.getTexto());
                }
                if (mensaje.getFecha() != null) {
                    existingMensaje.setFecha(mensaje.getFecha());
                }

                return existingMensaje;
            })
            .map(mensajeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mensaje.getId().toString())
        );
    }

    /**
     * {@code GET  /mensajes} : get all the mensajes.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mensajes in body.
     */
    @GetMapping("/mensajes")
    public List<Mensaje> getAllMensajes(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Mensajes");
        if (eagerload) {
            return mensajeRepository.findAllWithEagerRelationships();
        } else {
            return mensajeRepository.findAll();
        }
    }

    /**
     * {@code GET  /mensajes/:id} : get the "id" mensaje.
     *
     * @param id the id of the mensaje to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mensaje, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mensajes/{id}")
    public ResponseEntity<Mensaje> getMensaje(@PathVariable Long id) {
        log.debug("REST request to get Mensaje : {}", id);
        Optional<Mensaje> mensaje = mensajeRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(mensaje);
    }

    /**
     * {@code DELETE  /mensajes/:id} : delete the "id" mensaje.
     *
     * @param id the id of the mensaje to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mensajes/{id}")
    public ResponseEntity<Void> deleteMensaje(@PathVariable Long id) {
        log.debug("REST request to delete Mensaje : {}", id);
        mensajeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
