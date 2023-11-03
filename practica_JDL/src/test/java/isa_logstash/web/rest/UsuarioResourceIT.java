package isa_logstash.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import isa_logstash.IntegrationTest;
import isa_logstash.domain.Usuario;
import isa_logstash.repository.UsuarioRepository;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link UsuarioResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class UsuarioResourceIT {

    private static final String DEFAULT_NOMBRE_USUARIO = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE_USUARIO = "BBBBBBBBBB";

    private static final String DEFAULT_CORREO = "AAAAAAAAAA";
    private static final String UPDATED_CORREO = "BBBBBBBBBB";

    private static final String DEFAULT_CLAVE = "AAAAAAAAAA";
    private static final String UPDATED_CLAVE = "BBBBBBBBBB";

    private static final String DEFAULT_NOMBRE_COMPLETO = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE_COMPLETO = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final String DEFAULT_SEGUIDOS = "AAAAAAAAAA";
    private static final String UPDATED_SEGUIDOS = "BBBBBBBBBB";

    private static final Integer DEFAULT_SEGUIDORES = 1;
    private static final Integer UPDATED_SEGUIDORES = 2;

    private static final String DEFAULT_MURO = "AAAAAAAAAA";
    private static final String UPDATED_MURO = "BBBBBBBBBB";

    private static final String DEFAULT_MENSAJES = "AAAAAAAAAA";
    private static final String UPDATED_MENSAJES = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/usuarios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Mock
    private UsuarioRepository usuarioRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUsuarioMockMvc;

    private Usuario usuario;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Usuario createEntity(EntityManager em) {
        Usuario usuario = new Usuario()
            .nombreUsuario(DEFAULT_NOMBRE_USUARIO)
            .correo(DEFAULT_CORREO)
            .clave(DEFAULT_CLAVE)
            .nombreCompleto(DEFAULT_NOMBRE_COMPLETO)
            .descripcion(DEFAULT_DESCRIPCION)
            .seguidos(DEFAULT_SEGUIDOS)
            .seguidores(DEFAULT_SEGUIDORES)
            .muro(DEFAULT_MURO)
            .mensajes(DEFAULT_MENSAJES);
        return usuario;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Usuario createUpdatedEntity(EntityManager em) {
        Usuario usuario = new Usuario()
            .nombreUsuario(UPDATED_NOMBRE_USUARIO)
            .correo(UPDATED_CORREO)
            .clave(UPDATED_CLAVE)
            .nombreCompleto(UPDATED_NOMBRE_COMPLETO)
            .descripcion(UPDATED_DESCRIPCION)
            .seguidos(UPDATED_SEGUIDOS)
            .seguidores(UPDATED_SEGUIDORES)
            .muro(UPDATED_MURO)
            .mensajes(UPDATED_MENSAJES);
        return usuario;
    }

    @BeforeEach
    public void initTest() {
        usuario = createEntity(em);
    }

    @Test
    @Transactional
    void createUsuario() throws Exception {
        int databaseSizeBeforeCreate = usuarioRepository.findAll().size();
        // Create the Usuario
        restUsuarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(usuario)))
            .andExpect(status().isCreated());

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll();
        assertThat(usuarioList).hasSize(databaseSizeBeforeCreate + 1);
        Usuario testUsuario = usuarioList.get(usuarioList.size() - 1);
        assertThat(testUsuario.getNombreUsuario()).isEqualTo(DEFAULT_NOMBRE_USUARIO);
        assertThat(testUsuario.getCorreo()).isEqualTo(DEFAULT_CORREO);
        assertThat(testUsuario.getClave()).isEqualTo(DEFAULT_CLAVE);
        assertThat(testUsuario.getNombreCompleto()).isEqualTo(DEFAULT_NOMBRE_COMPLETO);
        assertThat(testUsuario.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
        assertThat(testUsuario.getSeguidos()).isEqualTo(DEFAULT_SEGUIDOS);
        assertThat(testUsuario.getSeguidores()).isEqualTo(DEFAULT_SEGUIDORES);
        assertThat(testUsuario.getMuro()).isEqualTo(DEFAULT_MURO);
        assertThat(testUsuario.getMensajes()).isEqualTo(DEFAULT_MENSAJES);
    }

    @Test
    @Transactional
    void createUsuarioWithExistingId() throws Exception {
        // Create the Usuario with an existing ID
        usuario.setId(1L);

        int databaseSizeBeforeCreate = usuarioRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUsuarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(usuario)))
            .andExpect(status().isBadRequest());

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll();
        assertThat(usuarioList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreUsuarioIsRequired() throws Exception {
        int databaseSizeBeforeTest = usuarioRepository.findAll().size();
        // set the field null
        usuario.setNombreUsuario(null);

        // Create the Usuario, which fails.

        restUsuarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(usuario)))
            .andExpect(status().isBadRequest());

        List<Usuario> usuarioList = usuarioRepository.findAll();
        assertThat(usuarioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUsuarios() throws Exception {
        // Initialize the database
        usuarioRepository.saveAndFlush(usuario);

        // Get all the usuarioList
        restUsuarioMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(usuario.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombreUsuario").value(hasItem(DEFAULT_NOMBRE_USUARIO)))
            .andExpect(jsonPath("$.[*].correo").value(hasItem(DEFAULT_CORREO)))
            .andExpect(jsonPath("$.[*].clave").value(hasItem(DEFAULT_CLAVE)))
            .andExpect(jsonPath("$.[*].nombreCompleto").value(hasItem(DEFAULT_NOMBRE_COMPLETO)))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)))
            .andExpect(jsonPath("$.[*].seguidos").value(hasItem(DEFAULT_SEGUIDOS)))
            .andExpect(jsonPath("$.[*].seguidores").value(hasItem(DEFAULT_SEGUIDORES)))
            .andExpect(jsonPath("$.[*].muro").value(hasItem(DEFAULT_MURO)))
            .andExpect(jsonPath("$.[*].mensajes").value(hasItem(DEFAULT_MENSAJES)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUsuariosWithEagerRelationshipsIsEnabled() throws Exception {
        when(usuarioRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUsuarioMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(usuarioRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUsuariosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(usuarioRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUsuarioMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(usuarioRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getUsuario() throws Exception {
        // Initialize the database
        usuarioRepository.saveAndFlush(usuario);

        // Get the usuario
        restUsuarioMockMvc
            .perform(get(ENTITY_API_URL_ID, usuario.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(usuario.getId().intValue()))
            .andExpect(jsonPath("$.nombreUsuario").value(DEFAULT_NOMBRE_USUARIO))
            .andExpect(jsonPath("$.correo").value(DEFAULT_CORREO))
            .andExpect(jsonPath("$.clave").value(DEFAULT_CLAVE))
            .andExpect(jsonPath("$.nombreCompleto").value(DEFAULT_NOMBRE_COMPLETO))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION))
            .andExpect(jsonPath("$.seguidos").value(DEFAULT_SEGUIDOS))
            .andExpect(jsonPath("$.seguidores").value(DEFAULT_SEGUIDORES))
            .andExpect(jsonPath("$.muro").value(DEFAULT_MURO))
            .andExpect(jsonPath("$.mensajes").value(DEFAULT_MENSAJES));
    }

    @Test
    @Transactional
    void getNonExistingUsuario() throws Exception {
        // Get the usuario
        restUsuarioMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUsuario() throws Exception {
        // Initialize the database
        usuarioRepository.saveAndFlush(usuario);

        int databaseSizeBeforeUpdate = usuarioRepository.findAll().size();

        // Update the usuario
        Usuario updatedUsuario = usuarioRepository.findById(usuario.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedUsuario are not directly saved in db
        em.detach(updatedUsuario);
        updatedUsuario
            .nombreUsuario(UPDATED_NOMBRE_USUARIO)
            .correo(UPDATED_CORREO)
            .clave(UPDATED_CLAVE)
            .nombreCompleto(UPDATED_NOMBRE_COMPLETO)
            .descripcion(UPDATED_DESCRIPCION)
            .seguidos(UPDATED_SEGUIDOS)
            .seguidores(UPDATED_SEGUIDORES)
            .muro(UPDATED_MURO)
            .mensajes(UPDATED_MENSAJES);

        restUsuarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUsuario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUsuario))
            )
            .andExpect(status().isOk());

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
        Usuario testUsuario = usuarioList.get(usuarioList.size() - 1);
        assertThat(testUsuario.getNombreUsuario()).isEqualTo(UPDATED_NOMBRE_USUARIO);
        assertThat(testUsuario.getCorreo()).isEqualTo(UPDATED_CORREO);
        assertThat(testUsuario.getClave()).isEqualTo(UPDATED_CLAVE);
        assertThat(testUsuario.getNombreCompleto()).isEqualTo(UPDATED_NOMBRE_COMPLETO);
        assertThat(testUsuario.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
        assertThat(testUsuario.getSeguidos()).isEqualTo(UPDATED_SEGUIDOS);
        assertThat(testUsuario.getSeguidores()).isEqualTo(UPDATED_SEGUIDORES);
        assertThat(testUsuario.getMuro()).isEqualTo(UPDATED_MURO);
        assertThat(testUsuario.getMensajes()).isEqualTo(UPDATED_MENSAJES);
    }

    @Test
    @Transactional
    void putNonExistingUsuario() throws Exception {
        int databaseSizeBeforeUpdate = usuarioRepository.findAll().size();
        usuario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUsuarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, usuario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(usuario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUsuario() throws Exception {
        int databaseSizeBeforeUpdate = usuarioRepository.findAll().size();
        usuario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsuarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(usuario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUsuario() throws Exception {
        int databaseSizeBeforeUpdate = usuarioRepository.findAll().size();
        usuario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsuarioMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(usuario)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUsuarioWithPatch() throws Exception {
        // Initialize the database
        usuarioRepository.saveAndFlush(usuario);

        int databaseSizeBeforeUpdate = usuarioRepository.findAll().size();

        // Update the usuario using partial update
        Usuario partialUpdatedUsuario = new Usuario();
        partialUpdatedUsuario.setId(usuario.getId());

        partialUpdatedUsuario
            .nombreUsuario(UPDATED_NOMBRE_USUARIO)
            .clave(UPDATED_CLAVE)
            .descripcion(UPDATED_DESCRIPCION)
            .muro(UPDATED_MURO);

        restUsuarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUsuario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUsuario))
            )
            .andExpect(status().isOk());

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
        Usuario testUsuario = usuarioList.get(usuarioList.size() - 1);
        assertThat(testUsuario.getNombreUsuario()).isEqualTo(UPDATED_NOMBRE_USUARIO);
        assertThat(testUsuario.getCorreo()).isEqualTo(DEFAULT_CORREO);
        assertThat(testUsuario.getClave()).isEqualTo(UPDATED_CLAVE);
        assertThat(testUsuario.getNombreCompleto()).isEqualTo(DEFAULT_NOMBRE_COMPLETO);
        assertThat(testUsuario.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
        assertThat(testUsuario.getSeguidos()).isEqualTo(DEFAULT_SEGUIDOS);
        assertThat(testUsuario.getSeguidores()).isEqualTo(DEFAULT_SEGUIDORES);
        assertThat(testUsuario.getMuro()).isEqualTo(UPDATED_MURO);
        assertThat(testUsuario.getMensajes()).isEqualTo(DEFAULT_MENSAJES);
    }

    @Test
    @Transactional
    void fullUpdateUsuarioWithPatch() throws Exception {
        // Initialize the database
        usuarioRepository.saveAndFlush(usuario);

        int databaseSizeBeforeUpdate = usuarioRepository.findAll().size();

        // Update the usuario using partial update
        Usuario partialUpdatedUsuario = new Usuario();
        partialUpdatedUsuario.setId(usuario.getId());

        partialUpdatedUsuario
            .nombreUsuario(UPDATED_NOMBRE_USUARIO)
            .correo(UPDATED_CORREO)
            .clave(UPDATED_CLAVE)
            .nombreCompleto(UPDATED_NOMBRE_COMPLETO)
            .descripcion(UPDATED_DESCRIPCION)
            .seguidos(UPDATED_SEGUIDOS)
            .seguidores(UPDATED_SEGUIDORES)
            .muro(UPDATED_MURO)
            .mensajes(UPDATED_MENSAJES);

        restUsuarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUsuario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUsuario))
            )
            .andExpect(status().isOk());

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
        Usuario testUsuario = usuarioList.get(usuarioList.size() - 1);
        assertThat(testUsuario.getNombreUsuario()).isEqualTo(UPDATED_NOMBRE_USUARIO);
        assertThat(testUsuario.getCorreo()).isEqualTo(UPDATED_CORREO);
        assertThat(testUsuario.getClave()).isEqualTo(UPDATED_CLAVE);
        assertThat(testUsuario.getNombreCompleto()).isEqualTo(UPDATED_NOMBRE_COMPLETO);
        assertThat(testUsuario.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
        assertThat(testUsuario.getSeguidos()).isEqualTo(UPDATED_SEGUIDOS);
        assertThat(testUsuario.getSeguidores()).isEqualTo(UPDATED_SEGUIDORES);
        assertThat(testUsuario.getMuro()).isEqualTo(UPDATED_MURO);
        assertThat(testUsuario.getMensajes()).isEqualTo(UPDATED_MENSAJES);
    }

    @Test
    @Transactional
    void patchNonExistingUsuario() throws Exception {
        int databaseSizeBeforeUpdate = usuarioRepository.findAll().size();
        usuario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUsuarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, usuario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(usuario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUsuario() throws Exception {
        int databaseSizeBeforeUpdate = usuarioRepository.findAll().size();
        usuario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsuarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(usuario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUsuario() throws Exception {
        int databaseSizeBeforeUpdate = usuarioRepository.findAll().size();
        usuario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsuarioMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(usuario)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUsuario() throws Exception {
        // Initialize the database
        usuarioRepository.saveAndFlush(usuario);

        int databaseSizeBeforeDelete = usuarioRepository.findAll().size();

        // Delete the usuario
        restUsuarioMockMvc
            .perform(delete(ENTITY_API_URL_ID, usuario.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Usuario> usuarioList = usuarioRepository.findAll();
        assertThat(usuarioList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
