package isa_logstash.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "autor")
    private String autor;

    @Column(name = "fecha_publicacion")
    private ZonedDateTime fechaPublicacion;

    @Column(name = "texto_mensaje")
    private String textoMensaje;

    @Column(name = "etiquetas")
    private String etiquetas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "muro", "seguidos", "mensajes", "seguidores" }, allowSetters = true)
    private Usuario autor;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_mensaje__etiquetas",
        joinColumns = @JoinColumn(name = "mensaje_id"),
        inverseJoinColumns = @JoinColumn(name = "etiquetas_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "mensajes" }, allowSetters = true)
    private Set<Etiqueta> etiquetas = new HashSet<>();

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

    public String getAutor() {
        return this.autor;
    }

    public Mensaje autor(String autor) {
        this.setAutor(autor);
        return this;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public ZonedDateTime getFechaPublicacion() {
        return this.fechaPublicacion;
    }

    public Mensaje fechaPublicacion(ZonedDateTime fechaPublicacion) {
        this.setFechaPublicacion(fechaPublicacion);
        return this;
    }

    public void setFechaPublicacion(ZonedDateTime fechaPublicacion) {
        this.fechaPublicacion = fechaPublicacion;
    }

    public String getTextoMensaje() {
        return this.textoMensaje;
    }

    public Mensaje textoMensaje(String textoMensaje) {
        this.setTextoMensaje(textoMensaje);
        return this;
    }

    public void setTextoMensaje(String textoMensaje) {
        this.textoMensaje = textoMensaje;
    }

    public String getEtiquetas() {
        return this.etiquetas;
    }

    public Mensaje etiquetas(String etiquetas) {
        this.setEtiquetas(etiquetas);
        return this;
    }

    public void setEtiquetas(String etiquetas) {
        this.etiquetas = etiquetas;
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

    public Set<Etiqueta> getEtiquetas() {
        return this.etiquetas;
    }

    public void setEtiquetas(Set<Etiqueta> etiquetas) {
        this.etiquetas = etiquetas;
    }

    public Mensaje etiquetas(Set<Etiqueta> etiquetas) {
        this.setEtiquetas(etiquetas);
        return this;
    }

    public Mensaje addEtiquetas(Etiqueta etiqueta) {
        this.etiquetas.add(etiqueta);
        etiqueta.getMensajes().add(this);
        return this;
    }

    public Mensaje removeEtiquetas(Etiqueta etiqueta) {
        this.etiquetas.remove(etiqueta);
        etiqueta.getMensajes().remove(this);
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
        return getId() != null && getId().equals(((Mensaje) o).getId());
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
            ", autor='" + getAutor() + "'" +
            ", fechaPublicacion='" + getFechaPublicacion() + "'" +
            ", textoMensaje='" + getTextoMensaje() + "'" +
            ", etiquetas='" + getEtiquetas() + "'" +
            "}";
    }
}
