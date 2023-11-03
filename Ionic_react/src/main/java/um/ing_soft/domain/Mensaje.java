package um.ing_soft.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Mensaje.
 */
@Entity
@Table(name = "mensaje")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Mensaje implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "texto")
    private String texto;

    @Column(name = "fecha")
    private LocalDate fecha;

    @JsonIgnoreProperties(
        value = { "siguiendos", "mensajePublicado", "mensajePrivadoEnviado", "mensajePrivadoRecibido", "mensajeMencionado", "seguidores" },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private Usuario autor;

    @OneToMany(mappedBy = "mensajeMencionado")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "siguiendos", "mensajePublicado", "mensajePrivadoEnviado", "mensajePrivadoRecibido", "mensajeMencionado", "seguidores" },
        allowSetters = true
    )
    private Set<Usuario> menciones = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Mensaje id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTexto() {
        return this.texto;
    }

    public Mensaje texto(String texto) {
        this.setTexto(texto);
        return this;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public LocalDate getFecha() {
        return this.fecha;
    }

    public Mensaje fecha(LocalDate fecha) {
        this.setFecha(fecha);
        return this;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Usuario getAutor() {
        return this.autor;
    }

    public void setAutor(Usuario usuario) {
        this.autor = usuario;
    }

    public Mensaje autor(Usuario usuario) {
        this.setAutor(usuario);
        return this;
    }

    public Set<Usuario> getMenciones() {
        return this.menciones;
    }

    public void setMenciones(Set<Usuario> usuarios) {
        if (this.menciones != null) {
            this.menciones.forEach(i -> i.setMensajeMencionado(null));
        }
        if (usuarios != null) {
            usuarios.forEach(i -> i.setMensajeMencionado(this));
        }
        this.menciones = usuarios;
    }

    public Mensaje menciones(Set<Usuario> usuarios) {
        this.setMenciones(usuarios);
        return this;
    }

    public Mensaje addMenciones(Usuario usuario) {
        this.menciones.add(usuario);
        usuario.setMensajeMencionado(this);
        return this;
    }

    public Mensaje removeMenciones(Usuario usuario) {
        this.menciones.remove(usuario);
        usuario.setMensajeMencionado(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Mensaje)) {
            return false;
        }
        return id != null && id.equals(((Mensaje) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Mensaje{" +
            "id=" + getId() +
            ", texto='" + getTexto() + "'" +
            ", fecha='" + getFecha() + "'" +
            "}";
    }
}
