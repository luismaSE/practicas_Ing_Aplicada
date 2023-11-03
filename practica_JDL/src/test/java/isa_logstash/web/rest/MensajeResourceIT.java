package isa_logstash.web.rest;

import static isa_logstash.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import isa_logstash.IntegrationTest;
import isa_logstash.domain.Mensaje;
import isa_logstash.repository.MensajeRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MensajeResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MensajeResourceIT {

    private static final String DEFAULT_AUTOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTOR = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_FECHA_PUBLICACION = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_FECHA_PUBLICACION = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_TEXTO_MENSAJE = "AAAAAAAAAA";
    private static final String UPDATED_TEXTO_MENSAJE = "BBBBBBBBBB";

    private static final String DEFAULT_ETIQUETAS = "AAAAAAAAAA";
    private static final String UPDATED_ETIQUETAS = "BBBBBBBBBB";

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
        Mensaje mensaje = new Mensaje()
            .autor(DEFAULT_AUTOR)
            .fechaPublicacion(DEFAULT_FECHA_PUBLICACION)
            .textoMensaje(DEFAULT_TEXTO_MENSAJE)
            .etiquetas(DEFAULT_ETIQUETAS);
        return mensaje;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mensaje createUpdatedEntity(EntityManager em) {
        Mensaje mensaje = new Mensaje()
            .autor(UPDATED_AUTOR)
            .fechaPublicacion(UPDATED_FECHA_PUBLICACION)
            .textoMensaje(UPDATED_TEXTO_MENSAJE)
            .etiquetas(UPDATED_ETIQUETAS);
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
        assertThat(testMensaje.getAutor()).isEqualTo(DEFAULT_AUTOR);
        assertThat(testMensaje.getFechaPublicacion()).isEqualTo(DEFAULT_FECHA_PUBLICACION);
        assertThat(testMensaje.getTextoMensaje()).isEqualTo(DEFAULT_TEXTO_MENSAJE);
        assertThat(testMensaje.getEtiquetas()).isEqualTo(DEFAULT_ETIQUETAS);
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
            .andExpect(jsonPath("$.[*].autor").value(hasItem(DEFAULT_AUTOR)))
            .andExpect(jsonPath("$.[*].fechaPublicacion").value(hasItem(sameInstant(DEFAULT_FECHA_PUBLICACION))))
            .andExpect(jsonPath("$.[*].textoMensaje").value(hasItem(DEFAULT_TEXTO_MENSAJE)))
            .andExpect(jsonPath("$.[*].etiquetas").value(hasItem(DEFAULT_ETIQUETAS)));
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
            .andExpect(jsonPath("$.autor").value(DEFAULT_AUTOR))
            .andExpect(jsonPath("$.fechaPublicacion").value(sameInstant(DEFAULT_FECHA_PUBLICACION)))
            .andExpect(jsonPath("$.textoMensaje").value(DEFAULT_TEXTO_MENSAJE))
            .andExpect(jsonPath("$.etiquetas").value(DEFAULT_ETIQUETAS));
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
        Mensaje updatedMensaje = mensajeRepository.findById(mensaje.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedMensaje are not directly saved in db
        em.detach(updatedMensaje);
        updatedMensaje
            .autor(UPDATED_AUTOR)
            .fechaPublicacion(UPDATED_FECHA_PUBLICACION)
            .textoMensaje(UPDATED_TEXTO_MENSAJE)
            .etiquetas(UPDATED_ETIQUETAS);

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
        assertThat(testMensaje.getAutor()).isEqualTo(UPDATED_AUTOR);
        assertThat(testMensaje.getFechaPublicacion()).isEqualTo(UPDATED_FECHA_PUBLICACION);
        assertThat(testMensaje.getTextoMensaje()).isEqualTo(UPDATED_TEXTO_MENSAJE);
        assertThat(testMensaje.getEtiquetas()).isEqualTo(UPDATED_ETIQUETAS);
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

        partialUpdatedMensaje.textoMensaje(UPDATED_TEXTO_MENSAJE);

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
        assertThat(testMensaje.getAutor()).isEqualTo(DEFAULT_AUTOR);
        assertThat(testMensaje.getFechaPublicacion()).isEqualTo(DEFAULT_FECHA_PUBLICACION);
        assertThat(testMensaje.getTextoMensaje()).isEqualTo(UPDATED_TEXTO_MENSAJE);
        assertThat(testMensaje.getEtiquetas()).isEqualTo(DEFAULT_ETIQUETAS);
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

        partialUpdatedMensaje
            .autor(UPDATED_AUTOR)
            .fechaPublicacion(UPDATED_FECHA_PUBLICACION)
            .textoMensaje(UPDATED_TEXTO_MENSAJE)
            .etiquetas(UPDATED_ETIQUETAS);

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
        assertThat(testMensaje.getAutor()).isEqualTo(UPDATED_AUTOR);
        assertThat(testMensaje.getFechaPublicacion()).isEqualTo(UPDATED_FECHA_PUBLICACION);
        assertThat(testMensaje.getTextoMensaje()).isEqualTo(UPDATED_TEXTO_MENSAJE);
        assertThat(testMensaje.getEtiquetas()).isEqualTo(UPDATED_ETIQUETAS);
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
