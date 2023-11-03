package isa_logstash.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import isa_logstash.IntegrationTest;
import isa_logstash.domain.TemaDelMomento;
import isa_logstash.repository.TemaDelMomentoRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TemaDelMomentoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TemaDelMomentoResourceIT {

    private static final String DEFAULT_ETIQUETA = "AAAAAAAAAA";
    private static final String UPDATED_ETIQUETA = "BBBBBBBBBB";

    private static final Integer DEFAULT_NUMERO_REPETICIONES = 1;
    private static final Integer UPDATED_NUMERO_REPETICIONES = 2;

    private static final String ENTITY_API_URL = "/api/tema-del-momentos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TemaDelMomentoRepository temaDelMomentoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTemaDelMomentoMockMvc;

    private TemaDelMomento temaDelMomento;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TemaDelMomento createEntity(EntityManager em) {
        TemaDelMomento temaDelMomento = new TemaDelMomento().etiqueta(DEFAULT_ETIQUETA).numeroRepeticiones(DEFAULT_NUMERO_REPETICIONES);
        return temaDelMomento;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TemaDelMomento createUpdatedEntity(EntityManager em) {
        TemaDelMomento temaDelMomento = new TemaDelMomento().etiqueta(UPDATED_ETIQUETA).numeroRepeticiones(UPDATED_NUMERO_REPETICIONES);
        return temaDelMomento;
    }

    @BeforeEach
    public void initTest() {
        temaDelMomento = createEntity(em);
    }

    @Test
    @Transactional
    void createTemaDelMomento() throws Exception {
        int databaseSizeBeforeCreate = temaDelMomentoRepository.findAll().size();
        // Create the TemaDelMomento
        restTemaDelMomentoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(temaDelMomento))
            )
            .andExpect(status().isCreated());

        // Validate the TemaDelMomento in the database
        List<TemaDelMomento> temaDelMomentoList = temaDelMomentoRepository.findAll();
        assertThat(temaDelMomentoList).hasSize(databaseSizeBeforeCreate + 1);
        TemaDelMomento testTemaDelMomento = temaDelMomentoList.get(temaDelMomentoList.size() - 1);
        assertThat(testTemaDelMomento.getEtiqueta()).isEqualTo(DEFAULT_ETIQUETA);
        assertThat(testTemaDelMomento.getNumeroRepeticiones()).isEqualTo(DEFAULT_NUMERO_REPETICIONES);
    }

    @Test
    @Transactional
    void createTemaDelMomentoWithExistingId() throws Exception {
        // Create the TemaDelMomento with an existing ID
        temaDelMomento.setId(1L);

        int databaseSizeBeforeCreate = temaDelMomentoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTemaDelMomentoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(temaDelMomento))
            )
            .andExpect(status().isBadRequest());

        // Validate the TemaDelMomento in the database
        List<TemaDelMomento> temaDelMomentoList = temaDelMomentoRepository.findAll();
        assertThat(temaDelMomentoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTemaDelMomentos() throws Exception {
        // Initialize the database
        temaDelMomentoRepository.saveAndFlush(temaDelMomento);

        // Get all the temaDelMomentoList
        restTemaDelMomentoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(temaDelMomento.getId().intValue())))
            .andExpect(jsonPath("$.[*].etiqueta").value(hasItem(DEFAULT_ETIQUETA)))
            .andExpect(jsonPath("$.[*].numeroRepeticiones").value(hasItem(DEFAULT_NUMERO_REPETICIONES)));
    }

    @Test
    @Transactional
    void getTemaDelMomento() throws Exception {
        // Initialize the database
        temaDelMomentoRepository.saveAndFlush(temaDelMomento);

        // Get the temaDelMomento
        restTemaDelMomentoMockMvc
            .perform(get(ENTITY_API_URL_ID, temaDelMomento.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(temaDelMomento.getId().intValue()))
            .andExpect(jsonPath("$.etiqueta").value(DEFAULT_ETIQUETA))
            .andExpect(jsonPath("$.numeroRepeticiones").value(DEFAULT_NUMERO_REPETICIONES));
    }

    @Test
    @Transactional
    void getNonExistingTemaDelMomento() throws Exception {
        // Get the temaDelMomento
        restTemaDelMomentoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTemaDelMomento() throws Exception {
        // Initialize the database
        temaDelMomentoRepository.saveAndFlush(temaDelMomento);

        int databaseSizeBeforeUpdate = temaDelMomentoRepository.findAll().size();

        // Update the temaDelMomento
        TemaDelMomento updatedTemaDelMomento = temaDelMomentoRepository.findById(temaDelMomento.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTemaDelMomento are not directly saved in db
        em.detach(updatedTemaDelMomento);
        updatedTemaDelMomento.etiqueta(UPDATED_ETIQUETA).numeroRepeticiones(UPDATED_NUMERO_REPETICIONES);

        restTemaDelMomentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTemaDelMomento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTemaDelMomento))
            )
            .andExpect(status().isOk());

        // Validate the TemaDelMomento in the database
        List<TemaDelMomento> temaDelMomentoList = temaDelMomentoRepository.findAll();
        assertThat(temaDelMomentoList).hasSize(databaseSizeBeforeUpdate);
        TemaDelMomento testTemaDelMomento = temaDelMomentoList.get(temaDelMomentoList.size() - 1);
        assertThat(testTemaDelMomento.getEtiqueta()).isEqualTo(UPDATED_ETIQUETA);
        assertThat(testTemaDelMomento.getNumeroRepeticiones()).isEqualTo(UPDATED_NUMERO_REPETICIONES);
    }

    @Test
    @Transactional
    void putNonExistingTemaDelMomento() throws Exception {
        int databaseSizeBeforeUpdate = temaDelMomentoRepository.findAll().size();
        temaDelMomento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTemaDelMomentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, temaDelMomento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(temaDelMomento))
            )
            .andExpect(status().isBadRequest());

        // Validate the TemaDelMomento in the database
        List<TemaDelMomento> temaDelMomentoList = temaDelMomentoRepository.findAll();
        assertThat(temaDelMomentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTemaDelMomento() throws Exception {
        int databaseSizeBeforeUpdate = temaDelMomentoRepository.findAll().size();
        temaDelMomento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTemaDelMomentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(temaDelMomento))
            )
            .andExpect(status().isBadRequest());

        // Validate the TemaDelMomento in the database
        List<TemaDelMomento> temaDelMomentoList = temaDelMomentoRepository.findAll();
        assertThat(temaDelMomentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTemaDelMomento() throws Exception {
        int databaseSizeBeforeUpdate = temaDelMomentoRepository.findAll().size();
        temaDelMomento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTemaDelMomentoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(temaDelMomento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TemaDelMomento in the database
        List<TemaDelMomento> temaDelMomentoList = temaDelMomentoRepository.findAll();
        assertThat(temaDelMomentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTemaDelMomentoWithPatch() throws Exception {
        // Initialize the database
        temaDelMomentoRepository.saveAndFlush(temaDelMomento);

        int databaseSizeBeforeUpdate = temaDelMomentoRepository.findAll().size();

        // Update the temaDelMomento using partial update
        TemaDelMomento partialUpdatedTemaDelMomento = new TemaDelMomento();
        partialUpdatedTemaDelMomento.setId(temaDelMomento.getId());

        restTemaDelMomentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTemaDelMomento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTemaDelMomento))
            )
            .andExpect(status().isOk());

        // Validate the TemaDelMomento in the database
        List<TemaDelMomento> temaDelMomentoList = temaDelMomentoRepository.findAll();
        assertThat(temaDelMomentoList).hasSize(databaseSizeBeforeUpdate);
        TemaDelMomento testTemaDelMomento = temaDelMomentoList.get(temaDelMomentoList.size() - 1);
        assertThat(testTemaDelMomento.getEtiqueta()).isEqualTo(DEFAULT_ETIQUETA);
        assertThat(testTemaDelMomento.getNumeroRepeticiones()).isEqualTo(DEFAULT_NUMERO_REPETICIONES);
    }

    @Test
    @Transactional
    void fullUpdateTemaDelMomentoWithPatch() throws Exception {
        // Initialize the database
        temaDelMomentoRepository.saveAndFlush(temaDelMomento);

        int databaseSizeBeforeUpdate = temaDelMomentoRepository.findAll().size();

        // Update the temaDelMomento using partial update
        TemaDelMomento partialUpdatedTemaDelMomento = new TemaDelMomento();
        partialUpdatedTemaDelMomento.setId(temaDelMomento.getId());

        partialUpdatedTemaDelMomento.etiqueta(UPDATED_ETIQUETA).numeroRepeticiones(UPDATED_NUMERO_REPETICIONES);

        restTemaDelMomentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTemaDelMomento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTemaDelMomento))
            )
            .andExpect(status().isOk());

        // Validate the TemaDelMomento in the database
        List<TemaDelMomento> temaDelMomentoList = temaDelMomentoRepository.findAll();
        assertThat(temaDelMomentoList).hasSize(databaseSizeBeforeUpdate);
        TemaDelMomento testTemaDelMomento = temaDelMomentoList.get(temaDelMomentoList.size() - 1);
        assertThat(testTemaDelMomento.getEtiqueta()).isEqualTo(UPDATED_ETIQUETA);
        assertThat(testTemaDelMomento.getNumeroRepeticiones()).isEqualTo(UPDATED_NUMERO_REPETICIONES);
    }

    @Test
    @Transactional
    void patchNonExistingTemaDelMomento() throws Exception {
        int databaseSizeBeforeUpdate = temaDelMomentoRepository.findAll().size();
        temaDelMomento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTemaDelMomentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, temaDelMomento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(temaDelMomento))
            )
            .andExpect(status().isBadRequest());

        // Validate the TemaDelMomento in the database
        List<TemaDelMomento> temaDelMomentoList = temaDelMomentoRepository.findAll();
        assertThat(temaDelMomentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTemaDelMomento() throws Exception {
        int databaseSizeBeforeUpdate = temaDelMomentoRepository.findAll().size();
        temaDelMomento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTemaDelMomentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(temaDelMomento))
            )
            .andExpect(status().isBadRequest());

        // Validate the TemaDelMomento in the database
        List<TemaDelMomento> temaDelMomentoList = temaDelMomentoRepository.findAll();
        assertThat(temaDelMomentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTemaDelMomento() throws Exception {
        int databaseSizeBeforeUpdate = temaDelMomentoRepository.findAll().size();
        temaDelMomento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTemaDelMomentoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(temaDelMomento))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TemaDelMomento in the database
        List<TemaDelMomento> temaDelMomentoList = temaDelMomentoRepository.findAll();
        assertThat(temaDelMomentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTemaDelMomento() throws Exception {
        // Initialize the database
        temaDelMomentoRepository.saveAndFlush(temaDelMomento);

        int databaseSizeBeforeDelete = temaDelMomentoRepository.findAll().size();

        // Delete the temaDelMomento
        restTemaDelMomentoMockMvc
            .perform(delete(ENTITY_API_URL_ID, temaDelMomento.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TemaDelMomento> temaDelMomentoList = temaDelMomentoRepository.findAll();
        assertThat(temaDelMomentoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
