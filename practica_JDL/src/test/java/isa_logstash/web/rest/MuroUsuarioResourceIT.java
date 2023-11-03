package isa_logstash.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import isa_logstash.IntegrationTest;
import isa_logstash.domain.MuroUsuario;
import isa_logstash.repository.MuroUsuarioRepository;
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
 * Integration tests for the {@link MuroUsuarioResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MuroUsuarioResourceIT {

    private static final String DEFAULT_USUARIO = "AAAAAAAAAA";
    private static final String UPDATED_USUARIO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/muro-usuarios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MuroUsuarioRepository muroUsuarioRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMuroUsuarioMockMvc;

    private MuroUsuario muroUsuario;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MuroUsuario createEntity(EntityManager em) {
        MuroUsuario muroUsuario = new MuroUsuario().usuario(DEFAULT_USUARIO);
        return muroUsuario;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MuroUsuario createUpdatedEntity(EntityManager em) {
        MuroUsuario muroUsuario = new MuroUsuario().usuario(UPDATED_USUARIO);
        return muroUsuario;
    }

    @BeforeEach
    public void initTest() {
        muroUsuario = createEntity(em);
    }

    @Test
    @Transactional
    void createMuroUsuario() throws Exception {
        int databaseSizeBeforeCreate = muroUsuarioRepository.findAll().size();
        // Create the MuroUsuario
        restMuroUsuarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(muroUsuario)))
            .andExpect(status().isCreated());

        // Validate the MuroUsuario in the database
        List<MuroUsuario> muroUsuarioList = muroUsuarioRepository.findAll();
        assertThat(muroUsuarioList).hasSize(databaseSizeBeforeCreate + 1);
        MuroUsuario testMuroUsuario = muroUsuarioList.get(muroUsuarioList.size() - 1);
        assertThat(testMuroUsuario.getUsuario()).isEqualTo(DEFAULT_USUARIO);
    }

    @Test
    @Transactional
    void createMuroUsuarioWithExistingId() throws Exception {
        // Create the MuroUsuario with an existing ID
        muroUsuario.setId(1L);

        int databaseSizeBeforeCreate = muroUsuarioRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMuroUsuarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(muroUsuario)))
            .andExpect(status().isBadRequest());

        // Validate the MuroUsuario in the database
        List<MuroUsuario> muroUsuarioList = muroUsuarioRepository.findAll();
        assertThat(muroUsuarioList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMuroUsuarios() throws Exception {
        // Initialize the database
        muroUsuarioRepository.saveAndFlush(muroUsuario);

        // Get all the muroUsuarioList
        restMuroUsuarioMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(muroUsuario.getId().intValue())))
            .andExpect(jsonPath("$.[*].usuario").value(hasItem(DEFAULT_USUARIO)));
    }

    @Test
    @Transactional
    void getMuroUsuario() throws Exception {
        // Initialize the database
        muroUsuarioRepository.saveAndFlush(muroUsuario);

        // Get the muroUsuario
        restMuroUsuarioMockMvc
            .perform(get(ENTITY_API_URL_ID, muroUsuario.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(muroUsuario.getId().intValue()))
            .andExpect(jsonPath("$.usuario").value(DEFAULT_USUARIO));
    }

    @Test
    @Transactional
    void getNonExistingMuroUsuario() throws Exception {
        // Get the muroUsuario
        restMuroUsuarioMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMuroUsuario() throws Exception {
        // Initialize the database
        muroUsuarioRepository.saveAndFlush(muroUsuario);

        int databaseSizeBeforeUpdate = muroUsuarioRepository.findAll().size();

        // Update the muroUsuario
        MuroUsuario updatedMuroUsuario = muroUsuarioRepository.findById(muroUsuario.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedMuroUsuario are not directly saved in db
        em.detach(updatedMuroUsuario);
        updatedMuroUsuario.usuario(UPDATED_USUARIO);

        restMuroUsuarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMuroUsuario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMuroUsuario))
            )
            .andExpect(status().isOk());

        // Validate the MuroUsuario in the database
        List<MuroUsuario> muroUsuarioList = muroUsuarioRepository.findAll();
        assertThat(muroUsuarioList).hasSize(databaseSizeBeforeUpdate);
        MuroUsuario testMuroUsuario = muroUsuarioList.get(muroUsuarioList.size() - 1);
        assertThat(testMuroUsuario.getUsuario()).isEqualTo(UPDATED_USUARIO);
    }

    @Test
    @Transactional
    void putNonExistingMuroUsuario() throws Exception {
        int databaseSizeBeforeUpdate = muroUsuarioRepository.findAll().size();
        muroUsuario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMuroUsuarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, muroUsuario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(muroUsuario))
            )
            .andExpect(status().isBadRequest());

        // Validate the MuroUsuario in the database
        List<MuroUsuario> muroUsuarioList = muroUsuarioRepository.findAll();
        assertThat(muroUsuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMuroUsuario() throws Exception {
        int databaseSizeBeforeUpdate = muroUsuarioRepository.findAll().size();
        muroUsuario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMuroUsuarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(muroUsuario))
            )
            .andExpect(status().isBadRequest());

        // Validate the MuroUsuario in the database
        List<MuroUsuario> muroUsuarioList = muroUsuarioRepository.findAll();
        assertThat(muroUsuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMuroUsuario() throws Exception {
        int databaseSizeBeforeUpdate = muroUsuarioRepository.findAll().size();
        muroUsuario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMuroUsuarioMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(muroUsuario)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MuroUsuario in the database
        List<MuroUsuario> muroUsuarioList = muroUsuarioRepository.findAll();
        assertThat(muroUsuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMuroUsuarioWithPatch() throws Exception {
        // Initialize the database
        muroUsuarioRepository.saveAndFlush(muroUsuario);

        int databaseSizeBeforeUpdate = muroUsuarioRepository.findAll().size();

        // Update the muroUsuario using partial update
        MuroUsuario partialUpdatedMuroUsuario = new MuroUsuario();
        partialUpdatedMuroUsuario.setId(muroUsuario.getId());

        restMuroUsuarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMuroUsuario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMuroUsuario))
            )
            .andExpect(status().isOk());

        // Validate the MuroUsuario in the database
        List<MuroUsuario> muroUsuarioList = muroUsuarioRepository.findAll();
        assertThat(muroUsuarioList).hasSize(databaseSizeBeforeUpdate);
        MuroUsuario testMuroUsuario = muroUsuarioList.get(muroUsuarioList.size() - 1);
        assertThat(testMuroUsuario.getUsuario()).isEqualTo(DEFAULT_USUARIO);
    }

    @Test
    @Transactional
    void fullUpdateMuroUsuarioWithPatch() throws Exception {
        // Initialize the database
        muroUsuarioRepository.saveAndFlush(muroUsuario);

        int databaseSizeBeforeUpdate = muroUsuarioRepository.findAll().size();

        // Update the muroUsuario using partial update
        MuroUsuario partialUpdatedMuroUsuario = new MuroUsuario();
        partialUpdatedMuroUsuario.setId(muroUsuario.getId());

        partialUpdatedMuroUsuario.usuario(UPDATED_USUARIO);

        restMuroUsuarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMuroUsuario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMuroUsuario))
            )
            .andExpect(status().isOk());

        // Validate the MuroUsuario in the database
        List<MuroUsuario> muroUsuarioList = muroUsuarioRepository.findAll();
        assertThat(muroUsuarioList).hasSize(databaseSizeBeforeUpdate);
        MuroUsuario testMuroUsuario = muroUsuarioList.get(muroUsuarioList.size() - 1);
        assertThat(testMuroUsuario.getUsuario()).isEqualTo(UPDATED_USUARIO);
    }

    @Test
    @Transactional
    void patchNonExistingMuroUsuario() throws Exception {
        int databaseSizeBeforeUpdate = muroUsuarioRepository.findAll().size();
        muroUsuario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMuroUsuarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, muroUsuario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(muroUsuario))
            )
            .andExpect(status().isBadRequest());

        // Validate the MuroUsuario in the database
        List<MuroUsuario> muroUsuarioList = muroUsuarioRepository.findAll();
        assertThat(muroUsuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMuroUsuario() throws Exception {
        int databaseSizeBeforeUpdate = muroUsuarioRepository.findAll().size();
        muroUsuario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMuroUsuarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(muroUsuario))
            )
            .andExpect(status().isBadRequest());

        // Validate the MuroUsuario in the database
        List<MuroUsuario> muroUsuarioList = muroUsuarioRepository.findAll();
        assertThat(muroUsuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMuroUsuario() throws Exception {
        int databaseSizeBeforeUpdate = muroUsuarioRepository.findAll().size();
        muroUsuario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMuroUsuarioMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(muroUsuario))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MuroUsuario in the database
        List<MuroUsuario> muroUsuarioList = muroUsuarioRepository.findAll();
        assertThat(muroUsuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMuroUsuario() throws Exception {
        // Initialize the database
        muroUsuarioRepository.saveAndFlush(muroUsuario);

        int databaseSizeBeforeDelete = muroUsuarioRepository.findAll().size();

        // Delete the muroUsuario
        restMuroUsuarioMockMvc
            .perform(delete(ENTITY_API_URL_ID, muroUsuario.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MuroUsuario> muroUsuarioList = muroUsuarioRepository.findAll();
        assertThat(muroUsuarioList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
