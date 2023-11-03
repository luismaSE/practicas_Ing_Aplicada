package isa_logstash.web.rest;

import isa_logstash.domain.TemaDelMomento;
import isa_logstash.repository.TemaDelMomentoRepository;
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
 * REST controller for managing {@link isa_logstash.domain.TemaDelMomento}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TemaDelMomentoResource {

    private final Logger log = LoggerFactory.getLogger(TemaDelMomentoResource.class);

    private static final String ENTITY_NAME = "temaDelMomento";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TemaDelMomentoRepository temaDelMomentoRepository;

    public TemaDelMomentoResource(TemaDelMomentoRepository temaDelMomentoRepository) {
        this.temaDelMomentoRepository = temaDelMomentoRepository;
    }

    /**
     * {@code POST  /tema-del-momentos} : Create a new temaDelMomento.
     *
     * @param temaDelMomento the temaDelMomento to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new temaDelMomento, or with status {@code 400 (Bad Request)} if the temaDelMomento has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tema-del-momentos")
    public ResponseEntity<TemaDelMomento> createTemaDelMomento(@RequestBody TemaDelMomento temaDelMomento) throws URISyntaxException {
        log.debug("REST request to save TemaDelMomento : {}", temaDelMomento);
        if (temaDelMomento.getId() != null) {
            throw new BadRequestAlertException("A new temaDelMomento cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TemaDelMomento result = temaDelMomentoRepository.save(temaDelMomento);
        return ResponseEntity
            .created(new URI("/api/tema-del-momentos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tema-del-momentos/:id} : Updates an existing temaDelMomento.
     *
     * @param id the id of the temaDelMomento to save.
     * @param temaDelMomento the temaDelMomento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated temaDelMomento,
     * or with status {@code 400 (Bad Request)} if the temaDelMomento is not valid,
     * or with status {@code 500 (Internal Server Error)} if the temaDelMomento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tema-del-momentos/{id}")
    public ResponseEntity<TemaDelMomento> updateTemaDelMomento(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TemaDelMomento temaDelMomento
    ) throws URISyntaxException {
        log.debug("REST request to update TemaDelMomento : {}, {}", id, temaDelMomento);
        if (temaDelMomento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, temaDelMomento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!temaDelMomentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TemaDelMomento result = temaDelMomentoRepository.save(temaDelMomento);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, temaDelMomento.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tema-del-momentos/:id} : Partial updates given fields of an existing temaDelMomento, field will ignore if it is null
     *
     * @param id the id of the temaDelMomento to save.
     * @param temaDelMomento the temaDelMomento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated temaDelMomento,
     * or with status {@code 400 (Bad Request)} if the temaDelMomento is not valid,
     * or with status {@code 404 (Not Found)} if the temaDelMomento is not found,
     * or with status {@code 500 (Internal Server Error)} if the temaDelMomento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tema-del-momentos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TemaDelMomento> partialUpdateTemaDelMomento(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TemaDelMomento temaDelMomento
    ) throws URISyntaxException {
        log.debug("REST request to partial update TemaDelMomento partially : {}, {}", id, temaDelMomento);
        if (temaDelMomento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, temaDelMomento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!temaDelMomentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TemaDelMomento> result = temaDelMomentoRepository
            .findById(temaDelMomento.getId())
            .map(existingTemaDelMomento -> {
                if (temaDelMomento.getEtiqueta() != null) {
                    existingTemaDelMomento.setEtiqueta(temaDelMomento.getEtiqueta());
                }
                if (temaDelMomento.getNumeroRepeticiones() != null) {
                    existingTemaDelMomento.setNumeroRepeticiones(temaDelMomento.getNumeroRepeticiones());
                }

                return existingTemaDelMomento;
            })
            .map(temaDelMomentoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, temaDelMomento.getId().toString())
        );
    }

    /**
     * {@code GET  /tema-del-momentos} : get all the temaDelMomentos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of temaDelMomentos in body.
     */
    @GetMapping("/tema-del-momentos")
    public List<TemaDelMomento> getAllTemaDelMomentos() {
        log.debug("REST request to get all TemaDelMomentos");
        return temaDelMomentoRepository.findAll();
    }

    /**
     * {@code GET  /tema-del-momentos/:id} : get the "id" temaDelMomento.
     *
     * @param id the id of the temaDelMomento to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the temaDelMomento, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tema-del-momentos/{id}")
    public ResponseEntity<TemaDelMomento> getTemaDelMomento(@PathVariable Long id) {
        log.debug("REST request to get TemaDelMomento : {}", id);
        Optional<TemaDelMomento> temaDelMomento = temaDelMomentoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(temaDelMomento);
    }

    /**
     * {@code DELETE  /tema-del-momentos/:id} : delete the "id" temaDelMomento.
     *
     * @param id the id of the temaDelMomento to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tema-del-momentos/{id}")
    public ResponseEntity<Void> deleteTemaDelMomento(@PathVariable Long id) {
        log.debug("REST request to delete TemaDelMomento : {}", id);
        temaDelMomentoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
