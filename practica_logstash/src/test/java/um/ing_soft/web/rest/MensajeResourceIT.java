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
import um.ing_soft.domain.Mensaje;
import um.ing_soft.repository.MensajeRepository;

/**
 * Integration tests for the {@link MensajeResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MensajeResourceIT {

    private static final String DEFAULT_TEXTO = "AAAAAAAAAA";
    private static final String UPDATED_TEXTO = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_FECHA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FECHA = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/mensajes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MensajeRepository mensajeRepository;

    @Mock
    private MensajeRepository mensajeRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMensajeMockMvc;

    private Mensaje mensaje;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mensaje createEntity(EntityManager em) {
        Mensaje mensaje = new Mensaje().texto(DEFAULT_TEXTO).fecha(DEFAULT_FECHA);
        return mensaje;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mensaje createUpdatedEntity(EntityManager em) {
        Mensaje mensaje = new Mensaje().texto(UPDATED_TEXTO).fecha(UPDATED_FECHA);
        return mensaje;
    }

    @BeforeEach
    public void initTest() {
        mensaje = createEntity(em);
    }

    @Test
    @Transactional
    void createMensaje() throws Exception {
        int databaseSizeBeforeCreate = mensajeRepository.findAll().size();
        // Create the Mensaje
        restMensajeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mensaje)))
            .andExpect(status().isCreated());

        // Validate the Mensaje in the database
        List<Mensaje> mensajeList = mensajeRepository.findAll();
        assertThat(mensajeList).hasSize(databaseSizeBeforeCreate + 1);
        Mensaje testMensaje = mensajeList.get(mensajeList.size() - 1);
        assertThat(testMensaje.getTexto()).isEqualTo(DEFAULT_TEXTO);
        assertThat(testMensaje.getFecha()).isEqualTo(DEFAULT_FECHA);
    }

    @Test
    @Transactional
    void createMensajeWithExistingId() throws Exception {
        // Create the Mensaje with an existing ID
        mensaje.setId(1L);

        int databaseSizeBeforeCreate = mensajeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMensajeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mensaje)))
            .andExpect(status().isBadRequest());

        // Validate the Mensaje in the database
        List<Mensaje> mensajeList = mensajeRepository.findAll();
        assertThat(mensajeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMensajes() throws Exception {
        // Initialize the database
        mensajeRepository.saveAndFlush(mensaje);

        // Get all the mensajeList
        restMensajeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mensaje.getId().intValue())))
            .andExpect(jsonPath("$.[*].texto").value(hasItem(DEFAULT_TEXTO)))
            .andExpect(jsonPath("$.[*].fecha").value(hasItem(DEFAULT_FECHA.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMensajesWithEagerRelationshipsIsEnabled() throws Exception {
        when(mensajeRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMensajeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(mensajeRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMensajesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(mensajeRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMensajeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(mensajeRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getMensaje() throws Exception {
        // Initialize the database
        mensajeRepository.saveAndFlush(mensaje);

        // Get the mensaje
        restMensajeMockMvc
            .perform(get(ENTITY_API_URL_ID, mensaje.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mensaje.getId().intValue()))
            .andExpect(jsonPath("$.texto").value(DEFAULT_TEXTO))
            .andExpect(jsonPath("$.fecha").value(DEFAULT_FECHA.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMensaje() throws Exception {
        // Get the mensaje
        restMensajeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMensaje() throws Exception {
        // Initialize the database
        mensajeRepository.saveAndFlush(mensaje);

        int databaseSizeBeforeUpdate = mensajeRepository.findAll().size();

        // Update the mensaje
        Mensaje updatedMensaje = mensajeRepository.findById(mensaje.getId()).get();
        // Disconnect from session so that the updates on updatedMensaje are not directly saved in db
        em.detach(updatedMensaje);
        updatedMensaje.texto(UPDATED_TEXTO).fecha(UPDATED_FECHA);

        restMensajeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMensaje.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMensaje))
            )
            .andExpect(status().isOk());

        // Validate the Mensaje in the database
        List<Mensaje> mensajeList = mensajeRepository.findAll();
        assertThat(mensajeList).hasSize(databaseSizeBeforeUpdate);
        Mensaje testMensaje = mensajeList.get(mensajeList.size() - 1);
        assertThat(testMensaje.getTexto()).isEqualTo(UPDATED_TEXTO);
        assertThat(testMensaje.getFecha()).isEqualTo(UPDATED_FECHA);
    }

    @Test
    @Transactional
    void putNonExistingMensaje() throws Exception {
        int databaseSizeBeforeUpdate = mensajeRepository.findAll().size();
        mensaje.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMensajeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mensaje.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mensaje))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mensaje in the database
        List<Mensaje> mensajeList = mensajeRepository.findAll();
        assertThat(mensajeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMensaje() throws Exception {
        int databaseSizeBeforeUpdate = mensajeRepository.findAll().size();
        mensaje.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMensajeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mensaje))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mensaje in the database
        List<Mensaje> mensajeList = mensajeRepository.findAll();
        assertThat(mensajeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMensaje() throws Exception {
        int databaseSizeBeforeUpdate = mensajeRepository.findAll().size();
        mensaje.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMensajeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mensaje)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mensaje in the database
        List<Mensaje> mensajeList = mensajeRepository.findAll();
        assertThat(mensajeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMensajeWithPatch() throws Exception {
        // Initialize the database
        mensajeRepository.saveAndFlush(mensaje);

        int databaseSizeBeforeUpdate = mensajeRepository.findAll().size();

        // Update the mensaje using partial update
        Mensaje partialUpdatedMensaje = new Mensaje();
        partialUpdatedMensaje.setId(mensaje.getId());

        restMensajeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMensaje.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMensaje))
            )
            .andExpect(status().isOk());

        // Validate the Mensaje in the database
        List<Mensaje> mensajeList = mensajeRepository.findAll();
        assertThat(mensajeList).hasSize(databaseSizeBeforeUpdate);
        Mensaje testMensaje = mensajeList.get(mensajeList.size() - 1);
        assertThat(testMensaje.getTexto()).isEqualTo(DEFAULT_TEXTO);
        assertThat(testMensaje.getFecha()).isEqualTo(DEFAULT_FECHA);
    }

    @Test
    @Transactional
    void fullUpdateMensajeWithPatch() throws Exception {
        // Initialize the database
        mensajeRepository.saveAndFlush(mensaje);

        int databaseSizeBeforeUpdate = mensajeRepository.findAll().size();

        // Update the mensaje using partial update
        Mensaje partialUpdatedMensaje = new Mensaje();
        partialUpdatedMensaje.setId(mensaje.getId());

        partialUpdatedMensaje.texto(UPDATED_TEXTO).fecha(UPDATED_FECHA);

        restMensajeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMensaje.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMensaje))
            )
            .andExpect(status().isOk());

        // Validate the Mensaje in the database
        List<Mensaje> mensajeList = mensajeRepository.findAll();
        assertThat(mensajeList).hasSize(databaseSizeBeforeUpdate);
        Mensaje testMensaje = mensajeList.get(mensajeList.size() - 1);
        assertThat(testMensaje.getTexto()).isEqualTo(UPDATED_TEXTO);
        assertThat(testMensaje.getFecha()).isEqualTo(UPDATED_FECHA);
    }

    @Test
    @Transactional
    void patchNonExistingMensaje() throws Exception {
        int databaseSizeBeforeUpdate = mensajeRepository.findAll().size();
        mensaje.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMensajeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mensaje.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mensaje))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mensaje in the database
        List<Mensaje> mensajeList = mensajeRepository.findAll();
        assertThat(mensajeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMensaje() throws Exception {
        int databaseSizeBeforeUpdate = mensajeRepository.findAll().size();
        mensaje.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMensajeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mensaje))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mensaje in the database
        List<Mensaje> mensajeList = mensajeRepository.findAll();
        assertThat(mensajeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMensaje() throws Exception {
        int databaseSizeBeforeUpdate = mensajeRepository.findAll().size();
        mensaje.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMensajeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(mensaje)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mensaje in the database
        List<Mensaje> mensajeList = mensajeRepository.findAll();
        assertThat(mensajeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMensaje() throws Exception {
        // Initialize the database
        mensajeRepository.saveAndFlush(mensaje);

        int databaseSizeBeforeDelete = mensajeRepository.findAll().size();

        // Delete the mensaje
        restMensajeMockMvc
            .perform(delete(ENTITY_API_URL_ID, mensaje.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Mensaje> mensajeList = mensajeRepository.findAll();
        assertThat(mensajeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
