package um.ing_soft.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import um.ing_soft.IntegrationTest;
import um.ing_soft.domain.MensajePrivado;
import um.ing_soft.repository.MensajePrivadoRepository;

/**
 * Integration tests for the {@link MensajePrivadoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MensajePrivadoResourceIT {

    private static final String DEFAULT_TEXTO = "AAAAAAAAAA";
    private static final String UPDATED_TEXTO = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_FECHA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FECHA = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/mensaje-privados";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MensajePrivadoRepository mensajePrivadoRepository;

    @Mock
    private MensajePrivadoRepository mensajePrivadoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMensajePrivadoMockMvc;

    private MensajePrivado mensajePrivado;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MensajePrivado createEntity(EntityManager em) {
        MensajePrivado mensajePrivado = new MensajePrivado().texto(DEFAULT_TEXTO).fecha(DEFAULT_FECHA);
        return mensajePrivado;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MensajePrivado createUpdatedEntity(EntityManager em) {
        MensajePrivado mensajePrivado = new MensajePrivado().texto(UPDATED_TEXTO).fecha(UPDATED_FECHA);
        return mensajePrivado;
    }

    @BeforeEach
    public void initTest() {
        mensajePrivado = createEntity(em);
    }

    @Test
    @Transactional
    void createMensajePrivado() throws Exception {
        int databaseSizeBeforeCreate = mensajePrivadoRepository.findAll().size();
        // Create the MensajePrivado
        restMensajePrivadoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mensajePrivado))
            )
            .andExpect(status().isCreated());

        // Validate the MensajePrivado in the database
        List<MensajePrivado> mensajePrivadoList = mensajePrivadoRepository.findAll();
        assertThat(mensajePrivadoList).hasSize(databaseSizeBeforeCreate + 1);
        MensajePrivado testMensajePrivado = mensajePrivadoList.get(mensajePrivadoList.size() - 1);
        assertThat(testMensajePrivado.getTexto()).isEqualTo(DEFAULT_TEXTO);
        assertThat(testMensajePrivado.getFecha()).isEqualTo(DEFAULT_FECHA);
    }

    @Test
    @Transactional
    void createMensajePrivadoWithExistingId() throws Exception {
        // Create the MensajePrivado with an existing ID
        mensajePrivado.setId(1L);

        int databaseSizeBeforeCreate = mensajePrivadoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMensajePrivadoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mensajePrivado))
            )
            .andExpect(status().isBadRequest());

        // Validate the MensajePrivado in the database
        List<MensajePrivado> mensajePrivadoList = mensajePrivadoRepository.findAll();
        assertThat(mensajePrivadoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMensajePrivados() throws Exception {
        // Initialize the database
        mensajePrivadoRepository.saveAndFlush(mensajePrivado);

        // Get all the mensajePrivadoList
        restMensajePrivadoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mensajePrivado.getId().intValue())))
            .andExpect(jsonPath("$.[*].texto").value(hasItem(DEFAULT_TEXTO)))
            .andExpect(jsonPath("$.[*].fecha").value(hasItem(DEFAULT_FECHA.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMensajePrivadosWithEagerRelationshipsIsEnabled() throws Exception {
        when(mensajePrivadoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMensajePrivadoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(mensajePrivadoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMensajePrivadosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(mensajePrivadoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMensajePrivadoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(mensajePrivadoRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getMensajePrivado() throws Exception {
        // Initialize the database
        mensajePrivadoRepository.saveAndFlush(mensajePrivado);

        // Get the mensajePrivado
        restMensajePrivadoMockMvc
            .perform(get(ENTITY_API_URL_ID, mensajePrivado.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mensajePrivado.getId().intValue()))
            .andExpect(jsonPath("$.texto").value(DEFAULT_TEXTO))
            .andExpect(jsonPath("$.fecha").value(DEFAULT_FECHA.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMensajePrivado() throws Exception {
        // Get the mensajePrivado
        restMensajePrivadoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMensajePrivado() throws Exception {
        // Initialize the database
        mensajePrivadoRepository.saveAndFlush(mensajePrivado);

        int databaseSizeBeforeUpdate = mensajePrivadoRepository.findAll().size();

        // Update the mensajePrivado
        MensajePrivado updatedMensajePrivado = mensajePrivadoRepository.findById(mensajePrivado.getId()).get();
        // Disconnect from session so that the updates on updatedMensajePrivado are not directly saved in db
        em.detach(updatedMensajePrivado);
        updatedMensajePrivado.texto(UPDATED_TEXTO).fecha(UPDATED_FECHA);

        restMensajePrivadoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMensajePrivado.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMensajePrivado))
            )
            .andExpect(status().isOk());

        // Validate the MensajePrivado in the database
        List<MensajePrivado> mensajePrivadoList = mensajePrivadoRepository.findAll();
        assertThat(mensajePrivadoList).hasSize(databaseSizeBeforeUpdate);
        MensajePrivado testMensajePrivado = mensajePrivadoList.get(mensajePrivadoList.size() - 1);
        assertThat(testMensajePrivado.getTexto()).isEqualTo(UPDATED_TEXTO);
        assertThat(testMensajePrivado.getFecha()).isEqualTo(UPDATED_FECHA);
    }

    @Test
    @Transactional
    void putNonExistingMensajePrivado() throws Exception {
        int databaseSizeBeforeUpdate = mensajePrivadoRepository.findAll().size();
        mensajePrivado.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMensajePrivadoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mensajePrivado.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mensajePrivado))
            )
            .andExpect(status().isBadRequest());

        // Validate the MensajePrivado in the database
        List<MensajePrivado> mensajePrivadoList = mensajePrivadoRepository.findAll();
        assertThat(mensajePrivadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMensajePrivado() throws Exception {
        int databaseSizeBeforeUpdate = mensajePrivadoRepository.findAll().size();
        mensajePrivado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMensajePrivadoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mensajePrivado))
            )
            .andExpect(status().isBadRequest());

        // Validate the MensajePrivado in the database
        List<MensajePrivado> mensajePrivadoList = mensajePrivadoRepository.findAll();
        assertThat(mensajePrivadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMensajePrivado() throws Exception {
        int databaseSizeBeforeUpdate = mensajePrivadoRepository.findAll().size();
        mensajePrivado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMensajePrivadoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mensajePrivado)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MensajePrivado in the database
        List<MensajePrivado> mensajePrivadoList = mensajePrivadoRepository.findAll();
        assertThat(mensajePrivadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMensajePrivadoWithPatch() throws Exception {
        // Initialize the database
        mensajePrivadoRepository.saveAndFlush(mensajePrivado);

        int databaseSizeBeforeUpdate = mensajePrivadoRepository.findAll().size();

        // Update the mensajePrivado using partial update
        MensajePrivado partialUpdatedMensajePrivado = new MensajePrivado();
        partialUpdatedMensajePrivado.setId(mensajePrivado.getId());

        partialUpdatedMensajePrivado.texto(UPDATED_TEXTO).fecha(UPDATED_FECHA);

        restMensajePrivadoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMensajePrivado.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMensajePrivado))
            )
            .andExpect(status().isOk());

        // Validate the MensajePrivado in the database
        List<MensajePrivado> mensajePrivadoList = mensajePrivadoRepository.findAll();
        assertThat(mensajePrivadoList).hasSize(databaseSizeBeforeUpdate);
        MensajePrivado testMensajePrivado = mensajePrivadoList.get(mensajePrivadoList.size() - 1);
        assertThat(testMensajePrivado.getTexto()).isEqualTo(UPDATED_TEXTO);
        assertThat(testMensajePrivado.getFecha()).isEqualTo(UPDATED_FECHA);
    }

    @Test
    @Transactional
    void fullUpdateMensajePrivadoWithPatch() throws Exception {
        // Initialize the database
        mensajePrivadoRepository.saveAndFlush(mensajePrivado);

        int databaseSizeBeforeUpdate = mensajePrivadoRepository.findAll().size();

        // Update the mensajePrivado using partial update
        MensajePrivado partialUpdatedMensajePrivado = new MensajePrivado();
        partialUpdatedMensajePrivado.setId(mensajePrivado.getId());

        partialUpdatedMensajePrivado.texto(UPDATED_TEXTO).fecha(UPDATED_FECHA);

        restMensajePrivadoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMensajePrivado.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMensajePrivado))
            )
            .andExpect(status().isOk());

        // Validate the MensajePrivado in the database
        List<MensajePrivado> mensajePrivadoList = mensajePrivadoRepository.findAll();
        assertThat(mensajePrivadoList).hasSize(databaseSizeBeforeUpdate);
        MensajePrivado testMensajePrivado = mensajePrivadoList.get(mensajePrivadoList.size() - 1);
        assertThat(testMensajePrivado.getTexto()).isEqualTo(UPDATED_TEXTO);
        assertThat(testMensajePrivado.getFecha()).isEqualTo(UPDATED_FECHA);
    }

    @Test
    @Transactional
    void patchNonExistingMensajePrivado() throws Exception {
        int databaseSizeBeforeUpdate = mensajePrivadoRepository.findAll().size();
        mensajePrivado.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMensajePrivadoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mensajePrivado.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mensajePrivado))
            )
            .andExpect(status().isBadRequest());

        // Validate the MensajePrivado in the database
        List<MensajePrivado> mensajePrivadoList = mensajePrivadoRepository.findAll();
        assertThat(mensajePrivadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMensajePrivado() throws Exception {
        int databaseSizeBeforeUpdate = mensajePrivadoRepository.findAll().size();
        mensajePrivado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMensajePrivadoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mensajePrivado))
            )
            .andExpect(status().isBadRequest());

        // Validate the MensajePrivado in the database
        List<MensajePrivado> mensajePrivadoList = mensajePrivadoRepository.findAll();
        assertThat(mensajePrivadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMensajePrivado() throws Exception {
        int databaseSizeBeforeUpdate = mensajePrivadoRepository.findAll().size();
        mensajePrivado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMensajePrivadoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(mensajePrivado))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MensajePrivado in the database
        List<MensajePrivado> mensajePrivadoList = mensajePrivadoRepository.findAll();
        assertThat(mensajePrivadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMensajePrivado() throws Exception {
        // Initialize the database
        mensajePrivadoRepository.saveAndFlush(mensajePrivado);

        int databaseSizeBeforeDelete = mensajePrivadoRepository.findAll().size();

        // Delete the mensajePrivado
        restMensajePrivadoMockMvc
            .perform(delete(ENTITY_API_URL_ID, mensajePrivado.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MensajePrivado> mensajePrivadoList = mensajePrivadoRepository.findAll();
        assertThat(mensajePrivadoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
