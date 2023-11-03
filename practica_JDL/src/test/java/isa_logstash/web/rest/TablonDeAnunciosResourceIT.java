package isa_logstash.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import isa_logstash.IntegrationTest;
import isa_logstash.domain.TablonDeAnuncios;
import isa_logstash.repository.TablonDeAnunciosRepository;
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
 * Integration tests for the {@link TablonDeAnunciosResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TablonDeAnunciosResourceIT {

    private static final String ENTITY_API_URL = "/api/tablon-de-anuncios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TablonDeAnunciosRepository tablonDeAnunciosRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTablonDeAnunciosMockMvc;

    private TablonDeAnuncios tablonDeAnuncios;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TablonDeAnuncios createEntity(EntityManager em) {
        TablonDeAnuncios tablonDeAnuncios = new TablonDeAnuncios();
        return tablonDeAnuncios;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TablonDeAnuncios createUpdatedEntity(EntityManager em) {
        TablonDeAnuncios tablonDeAnuncios = new TablonDeAnuncios();
        return tablonDeAnuncios;
    }

    @BeforeEach
    public void initTest() {
        tablonDeAnuncios = createEntity(em);
    }

    @Test
    @Transactional
    void createTablonDeAnuncios() throws Exception {
        int databaseSizeBeforeCreate = tablonDeAnunciosRepository.findAll().size();
        // Create the TablonDeAnuncios
        restTablonDeAnunciosMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tablonDeAnuncios))
            )
            .andExpect(status().isCreated());

        // Validate the TablonDeAnuncios in the database
        List<TablonDeAnuncios> tablonDeAnunciosList = tablonDeAnunciosRepository.findAll();
        assertThat(tablonDeAnunciosList).hasSize(databaseSizeBeforeCreate + 1);
        TablonDeAnuncios testTablonDeAnuncios = tablonDeAnunciosList.get(tablonDeAnunciosList.size() - 1);
    }

    @Test
    @Transactional
    void createTablonDeAnunciosWithExistingId() throws Exception {
        // Create the TablonDeAnuncios with an existing ID
        tablonDeAnuncios.setId(1L);

        int databaseSizeBeforeCreate = tablonDeAnunciosRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTablonDeAnunciosMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tablonDeAnuncios))
            )
            .andExpect(status().isBadRequest());

        // Validate the TablonDeAnuncios in the database
        List<TablonDeAnuncios> tablonDeAnunciosList = tablonDeAnunciosRepository.findAll();
        assertThat(tablonDeAnunciosList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTablonDeAnuncios() throws Exception {
        // Initialize the database
        tablonDeAnunciosRepository.saveAndFlush(tablonDeAnuncios);

        // Get all the tablonDeAnunciosList
        restTablonDeAnunciosMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tablonDeAnuncios.getId().intValue())));
    }

    @Test
    @Transactional
    void getTablonDeAnuncios() throws Exception {
        // Initialize the database
        tablonDeAnunciosRepository.saveAndFlush(tablonDeAnuncios);

        // Get the tablonDeAnuncios
        restTablonDeAnunciosMockMvc
            .perform(get(ENTITY_API_URL_ID, tablonDeAnuncios.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tablonDeAnuncios.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingTablonDeAnuncios() throws Exception {
        // Get the tablonDeAnuncios
        restTablonDeAnunciosMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTablonDeAnuncios() throws Exception {
        // Initialize the database
        tablonDeAnunciosRepository.saveAndFlush(tablonDeAnuncios);

        int databaseSizeBeforeUpdate = tablonDeAnunciosRepository.findAll().size();

        // Update the tablonDeAnuncios
        TablonDeAnuncios updatedTablonDeAnuncios = tablonDeAnunciosRepository.findById(tablonDeAnuncios.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTablonDeAnuncios are not directly saved in db
        em.detach(updatedTablonDeAnuncios);

        restTablonDeAnunciosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTablonDeAnuncios.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTablonDeAnuncios))
            )
            .andExpect(status().isOk());

        // Validate the TablonDeAnuncios in the database
        List<TablonDeAnuncios> tablonDeAnunciosList = tablonDeAnunciosRepository.findAll();
        assertThat(tablonDeAnunciosList).hasSize(databaseSizeBeforeUpdate);
        TablonDeAnuncios testTablonDeAnuncios = tablonDeAnunciosList.get(tablonDeAnunciosList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingTablonDeAnuncios() throws Exception {
        int databaseSizeBeforeUpdate = tablonDeAnunciosRepository.findAll().size();
        tablonDeAnuncios.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTablonDeAnunciosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tablonDeAnuncios.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tablonDeAnuncios))
            )
            .andExpect(status().isBadRequest());

        // Validate the TablonDeAnuncios in the database
        List<TablonDeAnuncios> tablonDeAnunciosList = tablonDeAnunciosRepository.findAll();
        assertThat(tablonDeAnunciosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTablonDeAnuncios() throws Exception {
        int databaseSizeBeforeUpdate = tablonDeAnunciosRepository.findAll().size();
        tablonDeAnuncios.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTablonDeAnunciosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tablonDeAnuncios))
            )
            .andExpect(status().isBadRequest());

        // Validate the TablonDeAnuncios in the database
        List<TablonDeAnuncios> tablonDeAnunciosList = tablonDeAnunciosRepository.findAll();
        assertThat(tablonDeAnunciosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTablonDeAnuncios() throws Exception {
        int databaseSizeBeforeUpdate = tablonDeAnunciosRepository.findAll().size();
        tablonDeAnuncios.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTablonDeAnunciosMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tablonDeAnuncios))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TablonDeAnuncios in the database
        List<TablonDeAnuncios> tablonDeAnunciosList = tablonDeAnunciosRepository.findAll();
        assertThat(tablonDeAnunciosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTablonDeAnunciosWithPatch() throws Exception {
        // Initialize the database
        tablonDeAnunciosRepository.saveAndFlush(tablonDeAnuncios);

        int databaseSizeBeforeUpdate = tablonDeAnunciosRepository.findAll().size();

        // Update the tablonDeAnuncios using partial update
        TablonDeAnuncios partialUpdatedTablonDeAnuncios = new TablonDeAnuncios();
        partialUpdatedTablonDeAnuncios.setId(tablonDeAnuncios.getId());

        restTablonDeAnunciosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTablonDeAnuncios.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTablonDeAnuncios))
            )
            .andExpect(status().isOk());

        // Validate the TablonDeAnuncios in the database
        List<TablonDeAnuncios> tablonDeAnunciosList = tablonDeAnunciosRepository.findAll();
        assertThat(tablonDeAnunciosList).hasSize(databaseSizeBeforeUpdate);
        TablonDeAnuncios testTablonDeAnuncios = tablonDeAnunciosList.get(tablonDeAnunciosList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateTablonDeAnunciosWithPatch() throws Exception {
        // Initialize the database
        tablonDeAnunciosRepository.saveAndFlush(tablonDeAnuncios);

        int databaseSizeBeforeUpdate = tablonDeAnunciosRepository.findAll().size();

        // Update the tablonDeAnuncios using partial update
        TablonDeAnuncios partialUpdatedTablonDeAnuncios = new TablonDeAnuncios();
        partialUpdatedTablonDeAnuncios.setId(tablonDeAnuncios.getId());

        restTablonDeAnunciosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTablonDeAnuncios.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTablonDeAnuncios))
            )
            .andExpect(status().isOk());

        // Validate the TablonDeAnuncios in the database
        List<TablonDeAnuncios> tablonDeAnunciosList = tablonDeAnunciosRepository.findAll();
        assertThat(tablonDeAnunciosList).hasSize(databaseSizeBeforeUpdate);
        TablonDeAnuncios testTablonDeAnuncios = tablonDeAnunciosList.get(tablonDeAnunciosList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingTablonDeAnuncios() throws Exception {
        int databaseSizeBeforeUpdate = tablonDeAnunciosRepository.findAll().size();
        tablonDeAnuncios.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTablonDeAnunciosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tablonDeAnuncios.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tablonDeAnuncios))
            )
            .andExpect(status().isBadRequest());

        // Validate the TablonDeAnuncios in the database
        List<TablonDeAnuncios> tablonDeAnunciosList = tablonDeAnunciosRepository.findAll();
        assertThat(tablonDeAnunciosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTablonDeAnuncios() throws Exception {
        int databaseSizeBeforeUpdate = tablonDeAnunciosRepository.findAll().size();
        tablonDeAnuncios.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTablonDeAnunciosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tablonDeAnuncios))
            )
            .andExpect(status().isBadRequest());

        // Validate the TablonDeAnuncios in the database
        List<TablonDeAnuncios> tablonDeAnunciosList = tablonDeAnunciosRepository.findAll();
        assertThat(tablonDeAnunciosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTablonDeAnuncios() throws Exception {
        int databaseSizeBeforeUpdate = tablonDeAnunciosRepository.findAll().size();
        tablonDeAnuncios.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTablonDeAnunciosMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tablonDeAnuncios))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TablonDeAnuncios in the database
        List<TablonDeAnuncios> tablonDeAnunciosList = tablonDeAnunciosRepository.findAll();
        assertThat(tablonDeAnunciosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTablonDeAnuncios() throws Exception {
        // Initialize the database
        tablonDeAnunciosRepository.saveAndFlush(tablonDeAnuncios);

        int databaseSizeBeforeDelete = tablonDeAnunciosRepository.findAll().size();

        // Delete the tablonDeAnuncios
        restTablonDeAnunciosMockMvc
            .perform(delete(ENTITY_API_URL_ID, tablonDeAnuncios.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TablonDeAnuncios> tablonDeAnunciosList = tablonDeAnunciosRepository.findAll();
        assertThat(tablonDeAnunciosList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
