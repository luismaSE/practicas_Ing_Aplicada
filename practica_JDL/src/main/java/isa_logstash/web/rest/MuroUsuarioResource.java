package isa_logstash.web.rest;

import isa_logstash.domain.MuroUsuario;
import isa_logstash.repository.MuroUsuarioRepository;
import isa_logstash.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link isa_logstash.domain.MuroUsuario}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MuroUsuarioResource {

    private final Logger log = LoggerFactory.getLogger(MuroUsuarioResource.class);

    private static final String ENTITY_NAME = "muroUsuario";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MuroUsuarioRepository muroUsuarioRepository;

    public MuroUsuarioResource(MuroUsuarioRepository muroUsuarioRepository) {
        this.muroUsuarioRepository = muroUsuarioRepository;
    }

    /**
     * {@code POST  /muro-usuarios} : Create a new muroUsuario.
     *
     * @param muroUsuario the muroUsuario to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new muroUsuario, or with status {@code 400 (Bad Request)} if the muroUsuario has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/muro-usuarios")
    public ResponseEntity<MuroUsuario> createMuroUsuario(@RequestBody MuroUsuario muroUsuario) throws URISyntaxException {
        log.debug("REST request to save MuroUsuario : {}", muroUsuario);
        if (muroUsuario.getId() != null) {
            throw new BadRequestAlertException("A new muroUsuario cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MuroUsuario result = muroUsuarioRepository.save(muroUsuario);
        return ResponseEntity
            .created(new URI("/api/muro-usuarios/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /muro-usuarios/:id} : Updates an existing muroUsuario.
     *
     * @param id the id of the muroUsuario to save.
     * @param muroUsuario the muroUsuario to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated muroUsuario,
     * or with status {@code 400 (Bad Request)} if the muroUsuario is not valid,
     * or with status {@code 500 (Internal Server Error)} if the muroUsuario couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/muro-usuarios/{id}")
    public ResponseEntity<MuroUsuario> updateMuroUsuario(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MuroUsuario muroUsuario
    ) throws URISyntaxException {
        log.debug("REST request to update MuroUsuario : {}, {}", id, muroUsuario);
        if (muroUsuario.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, muroUsuario.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!muroUsuarioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MuroUsuario result = muroUsuarioRepository.save(muroUsuario);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, muroUsuario.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /muro-usuarios/:id} : Partial updates given fields of an existing muroUsuario, field will ignore if it is null
     *
     * @param id the id of the muroUsuario to save.
     * @param muroUsuario the muroUsuario to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated muroUsuario,
     * or with status {@code 400 (Bad Request)} if the muroUsuario is not valid,
     * or with status {@code 404 (Not Found)} if the muroUsuario is not found,
     * or with status {@code 500 (Internal Server Error)} if the muroUsuario couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/muro-usuarios/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MuroUsuario> partialUpdateMuroUsuario(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MuroUsuario muroUsuario
    ) throws URISyntaxException {
        log.debug("REST request to partial update MuroUsuario partially : {}, {}", id, muroUsuario);
        if (muroUsuario.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, muroUsuario.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!muroUsuarioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MuroUsuario> result = muroUsuarioRepository
            .findById(muroUsuario.getId())
            .map(existingMuroUsuario -> {
                if (muroUsuario.getUsuario() != null) {
                    existingMuroUsuario.setUsuario(muroUsuario.getUsuario());
                }

                return existingMuroUsuario;
            })
            .map(muroUsuarioRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, muroUsuario.getId().toString())
        );
    }

    /**
     * {@code GET  /muro-usuarios} : get all the muroUsuarios.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of muroUsuarios in body.
     */
    @GetMapping("/muro-usuarios")
    public List<MuroUsuario> getAllMuroUsuarios(@RequestParam(required = false) String filter) {
        if ("usuario-is-null".equals(filter)) {
            log.debug("REST request to get all MuroUsuarios where usuario is null");
            return StreamSupport
                .stream(muroUsuarioRepository.findAll().spliterator(), false)
                .filter(muroUsuario -> muroUsuario.getUsuario() == null)
                .toList();
        }
        log.debug("REST request to get all MuroUsuarios");
        return muroUsuarioRepository.findAll();
    }

    /**
     * {@code GET  /muro-usuarios/:id} : get the "id" muroUsuario.
     *
     * @param id the id of the muroUsuario to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the muroUsuario, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/muro-usuarios/{id}")
    public ResponseEntity<MuroUsuario> getMuroUsuario(@PathVariable Long id) {
        log.debug("REST request to get MuroUsuario : {}", id);
        Optional<MuroUsuario> muroUsuario = muroUsuarioRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(muroUsuario);
    }

    /**
     * {@code DELETE  /muro-usuarios/:id} : delete the "id" muroUsuario.
     *
     * @param id the id of the muroUsuario to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/muro-usuarios/{id}")
    public ResponseEntity<Void> deleteMuroUsuario(@PathVariable Long id) {
        log.debug("REST request to delete MuroUsuario : {}", id);
        muroUsuarioRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
