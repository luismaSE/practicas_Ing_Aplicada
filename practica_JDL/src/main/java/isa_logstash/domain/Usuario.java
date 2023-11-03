package isa_logstash.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Usuario.
 */
@Entity
@Table(name = "usuario")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Usuario implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nombre_usuario", nullable = false)
    private String nombreUsuario;

    @Column(name = "correo")
    private String correo;

    @Column(name = "clave")
    private String clave;

    @Column(name = "nombre_completo")
    private String nombreCompleto;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "seguidos")
    private String seguidos;

    @Column(name = "seguidores")
    private Integer seguidores;

    @Column(name = "muro")
    private String muro;

    @Column(name = "mensajes")
    private String mensajes;

    @JsonIgnoreProperties(value = { "usuario" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private MuroUsuario muro;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_usuario__seguidos",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "seguidos_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "muro", "seguidos", "mensajes", "seguidores" }, allowSetters = true)
    private Set<Usuario> seguidos = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "autor")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "autor", "etiquetas" }, allowSetters = true)
    private Set<Mensaje> mensajes = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "seguidos")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "muro", "seguidos", "mensajes", "seguidores" }, allowSetters = true)
    private Set<Usuario> seguidores = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Usuario id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreUsuario() {
        return this.nombreUsuario;
    }

    public Usuario nombreUsuario(String nombreUsuario) {
        this.setNombreUsuario(nombreUsuario);
        return this;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getCorreo() {
        return this.correo;
    }

    public Usuario correo(String correo) {
        this.setCorreo(correo);
        return this;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getClave() {
        return this.clave;
    }

    public Usuario clave(String clave) {
        this.setClave(clave);
        return this;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public String getNombreCompleto() {
        return this.nombreCompleto;
    }

    public Usuario nombreCompleto(String nombreCompleto) {
        this.setNombreCompleto(nombreCompleto);
        return this;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public Usuario descripcion(String descripcion) {
        this.setDescripcion(descripcion);
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getSeguidos() {
        return this.seguidos;
    }

    public Usuario seguidos(String seguidos) {
        this.setSeguidos(seguidos);
        return this;
    }

    public void setSeguidos(String seguidos) {
        this.seguidos = seguidos;
    }

    public Integer getSeguidores() {
        return this.seguidores;
    }

    public Usuario seguidores(Integer seguidores) {
        this.setSeguidores(seguidores);
        return this;
    }

    public void setSeguidores(Integer seguidores) {
        this.seguidores = seguidores;
    }

    public String getMuro() {
        return this.muro;
    }

    public Usuario muro(String muro) {
        this.setMuro(muro);
        return this;
    }

    public void setMuro(String muro) {
        this.muro = muro;
    }

    public String getMensajes() {
        return this.mensajes;
    }

    public Usuario mensajes(String mensajes) {
        this.setMensajes(mensajes);
        return this;
    }

    public void setMensajes(String mensajes) {
        this.mensajes = mensajes;
    }

    public MuroUsuario getMuro() {
        return this.muro;
    }

    public void setMuro(MuroUsuario muroUsuario) {
        this.muro = muroUsuario;
    }

    public Usuario muro(MuroUsuario muroUsuario) {
        this.setMuro(muroUsuario);
        return this;
    }

    public Set<Usuario> getSeguidos() {
        return this.seguidos;
    }

    public void setSeguidos(Set<Usuario> usuarios) {
        this.seguidos = usuarios;
    }

    public Usuario seguidos(Set<Usuario> usuarios) {
        this.setSeguidos(usuarios);
        return this;
    }

    public Usuario addSeguidos(Usuario usuario) {
        this.seguidos.add(usuario);
        usuario.getSeguidores().add(this);
        return this;
    }

    public Usuario removeSeguidos(Usuario usuario) {
        this.seguidos.remove(usuario);
        usuario.getSeguidores().remove(this);
        return this;
    }

    public Set<Mensaje> getMensajes() {
        return this.mensajes;
    }

    public void setMensajes(Set<Mensaje> mensajes) {
        if (this.mensajes != null) {
            this.mensajes.forEach(i -> i.setAutor(null));
        }
        if (mensajes != null) {
            mensajes.forEach(i -> i.setAutor(this));
        }
        this.mensajes = mensajes;
    }

    public Usuario mensajes(Set<Mensaje> mensajes) {
        this.setMensajes(mensajes);
        return this;
    }

    public Usuario addMensajes(Mensaje mensaje) {
        this.mensajes.add(mensaje);
        mensaje.setAutor(this);
        return this;
    }

    public Usuario removeMensajes(Mensaje mensaje) {
        this.mensajes.remove(mensaje);
        mensaje.setAutor(null);
        return this;
    }

    public Set<Usuario> getSeguidores() {
        return this.seguidores;
    }

    public void setSeguidores(Set<Usuario> usuarios) {
        if (this.seguidores != null) {
            this.seguidores.forEach(i -> i.removeSeguidos(this));
        }
        if (usuarios != null) {
            usuarios.forEach(i -> i.addSeguidos(this));
        }
        this.seguidores = usuarios;
    }

    public Usuario seguidores(Set<Usuario> usuarios) {
        this.setSeguidores(usuarios);
        return this;
    }

    public Usuario addSeguidores(Usuario usuario) {
        this.seguidores.add(usuario);
        usuario.getSeguidos().add(this);
        return this;
    }

    public Usuario removeSeguidores(Usuario usuario) {
        this.seguidores.remove(usuario);
        usuario.getSeguidos().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Usuario)) {
            return false;
        }
        return getId() != null && getId().equals(((Usuario) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Usuario{" +
            "id=" + getId() +
            ", nombreUsuario='" + getNombreUsuario() + "'" +
            ", correo='" + getCorreo() + "'" +
            ", clave='" + getClave() + "'" +
            ", nombreCompleto='" + getNombreCompleto() + "'" +
            ", descripcion='" + getDescripcion() + "'" +
            ", seguidos='" + getSeguidos() + "'" +
            ", seguidores=" + getSeguidores() +
            ", muro='" + getMuro() + "'" +
            ", mensajes='" + getMensajes() + "'" +
            "}";
    }
}
