package um.ing_soft.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "alias")
    private String alias;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "correo")
    private String correo;

    @Column(name = "contrasenia")
    private String contrasenia;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "admin")
    private Boolean admin;

    @ManyToMany
    @JoinTable(
        name = "rel_usuario__siguiendo",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "siguiendo_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "siguiendos", "mensajePublicado", "mensajePrivadoEnviado", "mensajePrivadoRecibido", "mensajeMencionado", "seguidores" },
        allowSetters = true
    )
    private Set<Usuario> siguiendos = new HashSet<>();

    @JsonIgnoreProperties(value = { "autor", "menciones" }, allowSetters = true)
    @OneToOne(mappedBy = "autor")
    private Mensaje mensajePublicado;

    @JsonIgnoreProperties(value = { "autor", "destino" }, allowSetters = true)
    @OneToOne(mappedBy = "autor")
    private MensajePrivado mensajePrivadoEnviado;

    @JsonIgnoreProperties(value = { "autor", "destino" }, allowSetters = true)
    @OneToOne(mappedBy = "destino")
    private MensajePrivado mensajePrivadoRecibido;

    @ManyToOne
    @JsonIgnoreProperties(value = { "autor", "menciones" }, allowSetters = true)
    private Mensaje mensajeMencionado;

    @ManyToMany(mappedBy = "siguiendos")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "siguiendos", "mensajePublicado", "mensajePrivadoEnviado", "mensajePrivadoRecibido", "mensajeMencionado", "seguidores" },
        allowSetters = true
    )
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

    public String getAlias() {
        return this.alias;
    }

    public Usuario alias(String alias) {
        this.setAlias(alias);
        return this;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Usuario nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
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

    public String getContrasenia() {
        return this.contrasenia;
    }

    public Usuario contrasenia(String contrasenia) {
        this.setContrasenia(contrasenia);
        return this;
    }

    public void setContrasenia(String contrasenia) {
        this.contrasenia = contrasenia;
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

    public Boolean getAdmin() {
        return this.admin;
    }

    public Usuario admin(Boolean admin) {
        this.setAdmin(admin);
        return this;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

    public Set<Usuario> getSiguiendos() {
        return this.siguiendos;
    }

    public void setSiguiendos(Set<Usuario> usuarios) {
        this.siguiendos = usuarios;
    }

    public Usuario siguiendos(Set<Usuario> usuarios) {
        this.setSiguiendos(usuarios);
        return this;
    }

    public Usuario addSiguiendo(Usuario usuario) {
        this.siguiendos.add(usuario);
        usuario.getSeguidores().add(this);
        return this;
    }

    public Usuario removeSiguiendo(Usuario usuario) {
        this.siguiendos.remove(usuario);
        usuario.getSeguidores().remove(this);
        return this;
    }

    public Mensaje getMensajePublicado() {
        return this.mensajePublicado;
    }

    public void setMensajePublicado(Mensaje mensaje) {
        if (this.mensajePublicado != null) {
            this.mensajePublicado.setAutor(null);
        }
        if (mensaje != null) {
            mensaje.setAutor(this);
        }
        this.mensajePublicado = mensaje;
    }

    public Usuario mensajePublicado(Mensaje mensaje) {
        this.setMensajePublicado(mensaje);
        return this;
    }

    public MensajePrivado getMensajePrivadoEnviado() {
        return this.mensajePrivadoEnviado;
    }

    public void setMensajePrivadoEnviado(MensajePrivado mensajePrivado) {
        if (this.mensajePrivadoEnviado != null) {
            this.mensajePrivadoEnviado.setAutor(null);
        }
        if (mensajePrivado != null) {
            mensajePrivado.setAutor(this);
        }
        this.mensajePrivadoEnviado = mensajePrivado;
    }

    public Usuario mensajePrivadoEnviado(MensajePrivado mensajePrivado) {
        this.setMensajePrivadoEnviado(mensajePrivado);
        return this;
    }

    public MensajePrivado getMensajePrivadoRecibido() {
        return this.mensajePrivadoRecibido;
    }

    public void setMensajePrivadoRecibido(MensajePrivado mensajePrivado) {
        if (this.mensajePrivadoRecibido != null) {
            this.mensajePrivadoRecibido.setDestino(null);
        }
        if (mensajePrivado != null) {
            mensajePrivado.setDestino(this);
        }
        this.mensajePrivadoRecibido = mensajePrivado;
    }

    public Usuario mensajePrivadoRecibido(MensajePrivado mensajePrivado) {
        this.setMensajePrivadoRecibido(mensajePrivado);
        return this;
    }

    public Mensaje getMensajeMencionado() {
        return this.mensajeMencionado;
    }

    public void setMensajeMencionado(Mensaje mensaje) {
        this.mensajeMencionado = mensaje;
    }

    public Usuario mensajeMencionado(Mensaje mensaje) {
        this.setMensajeMencionado(mensaje);
        return this;
    }

    public Set<Usuario> getSeguidores() {
        return this.seguidores;
    }

    public void setSeguidores(Set<Usuario> usuarios) {
        if (this.seguidores != null) {
            this.seguidores.forEach(i -> i.removeSiguiendo(this));
        }
        if (usuarios != null) {
            usuarios.forEach(i -> i.addSiguiendo(this));
        }
        this.seguidores = usuarios;
    }

    public Usuario seguidores(Set<Usuario> usuarios) {
        this.setSeguidores(usuarios);
        return this;
    }

    public Usuario addSeguidores(Usuario usuario) {
        this.seguidores.add(usuario);
        usuario.getSiguiendos().add(this);
        return this;
    }

    public Usuario removeSeguidores(Usuario usuario) {
        this.seguidores.remove(usuario);
        usuario.getSiguiendos().remove(this);
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
        return id != null && id.equals(((Usuario) o).id);
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
            ", alias='" + getAlias() + "'" +
            ", nombre='" + getNombre() + "'" +
            ", correo='" + getCorreo() + "'" +
            ", contrasenia='" + getContrasenia() + "'" +
            ", descripcion='" + getDescripcion() + "'" +
            ", admin='" + getAdmin() + "'" +
            "}";
    }
}
