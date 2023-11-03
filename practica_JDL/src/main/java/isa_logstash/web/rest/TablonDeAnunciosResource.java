package isa_logstash.web.rest;

import isa_logstash.domain.TablonDeAnuncios;
import isa_logstash.repository.TablonDeAnunciosRepository;
import isa_logstash.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link isa_logstash.domain.TablonDeAnuncios}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TablonDeAnunciosResource {

    private final Logger log = LoggerFactory.getLogger(TablonDeAnunciosResource.class);

    private static final String ENTITY_NAME = "tablonDeAnuncios";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TablonDeAnunciosRepository tablonDeAnunciosRepository;

    public TablonDeAnunciosResource(TablonDeAnunciosRepository tablonDeAnunciosRepository) {
        this.tablonDeAnunciosRepository = tablonDeAnunciosRepository;
    }

    /**
     * {@code POST  /tablon-de-anuncios} : Create a new tablonDeAnuncios.
     *
     * @param tablonDeAnuncios the tablonDeAnuncios to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tablonDeAnuncios, or with status {@code 400 (Bad Request)} if the tablonDeAnuncios has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tablon-de-anuncios")
    public ResponseEntity<TablonDeAnuncios> createTablonDeAnuncios(@RequestBody TablonDeAnuncios tablonDeAnuncios)
        throws URISyntaxException {
        log.debug("REST request to save TablonDeAnuncios : {}", tablonDeAnuncios);
        if (tablonDeAnuncios.getId() != null) {
            throw new BadRequestAlertException("A new tablonDeAnuncios cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TablonDeAnuncios result = tablonDeAnunciosRepository.save(tablonDeAnuncios);
        return ResponseEntity
            .created(new URI("/api/tablon-de-anuncios/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tablon-de-anuncios/:id} : Updates an existing tablonDeAnuncios.
     *
     * @param id the id of the tablonDeAnuncios to save.
     * @param tablonDeAnuncios the tablonDeAnuncios to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tablonDeAnuncios,
     * or with status {@code 400 (Bad Request)} if the tablonDeAnuncios is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tablonDeAnuncios couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tablon-de-anuncios/{id}")
    public ResponseEntity<TablonDeAnuncios> updateTablonDeAnuncios(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TablonDeAnuncios tablonDeAnuncios
    ) throws URISyntaxException {
        log.debug("REST request to update TablonDeAnuncios : {}, {}", id, tablonDeAnuncios);
        if (tablonDeAnuncios.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tablonDeAnuncios.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tablonDeAnunciosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        // no save call needed as we have no fields that can be updated
        TablonDeAnuncios result = tablonDeAnuncios;
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tablonDeAnuncios.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tablon-de-anuncios/:id} : Partial updates given fields of an existing tablonDeAnuncios, field will ignore if it is null
     *
     * @param id the id of the tablonDeAnuncios to save.
     * @param tablonDeAnuncios the tablonDeAnuncios to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tablonDeAnuncios,
     * or with status {@code 400 (Bad Request)} if the tablonDeAnuncios is not valid,
     * or with status {@code 404 (Not Found)} if the tablonDeAnuncios is not found,
     * or with status {@code 500 (Internal Server Error)} if the tablonDeAnuncios couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tablon-de-anuncios/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TablonDeAnuncios> partialUpdateTablonDeAnuncios(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TablonDeAnuncios tablonDeAnuncios
    ) throws URISyntaxException {
        log.debug("REST request to partial update TablonDeAnuncios partially : {}, {}", id, tablonDeAnuncios);
        if (tablonDeAnuncios.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tablonDeAnuncios.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tablonDeAnunciosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TablonDeAnuncios> result = tablonDeAnunciosRepository.findById(
            tablonDeAnuncios.getId()
        )// .map(tablonDeAnunciosRepository::save)
        ;

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tablonDeAnuncios.getId().toString())
        );
    }

    /**
     * {@code GET  /tablon-de-anuncios} : get all the tablonDeAnuncios.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tablonDeAnuncios in body.
     */
    @GetMapping("/tablon-de-anuncios")
    public List<TablonDeAnuncios> getAllTablonDeAnuncios() {
        log.debug("REST request to get all TablonDeAnuncios");
        return tablonDeAnunciosRepository.findAll();
    }

    /**
     * {@code GET  /tablon-de-anuncios/:id} : get the "id" tablonDeAnuncios.
     *
     * @param id the id of the tablonDeAnuncios to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tablonDeAnuncios, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tablon-de-anuncios/{id}")
    public ResponseEntity<TablonDeAnuncios> getTablonDeAnuncios(@PathVariable Long id) {
        log.debug("REST request to get TablonDeAnuncios : {}", id);
        Optional<TablonDeAnuncios> tablonDeAnuncios = tablonDeAnunciosRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tablonDeAnuncios);
    }

    /**
     * {@code DELETE  /tablon-de-anuncios/:id} : delete the "id" tablonDeAnuncios.
     *
     * @param id the id of the tablonDeAnuncios to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tablon-de-anuncios/{id}")
    public ResponseEntity<Void> deleteTablonDeAnuncios(@PathVariable Long id) {
        log.debug("REST request to delete TablonDeAnuncios : {}", id);
        tablonDeAnunciosRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
