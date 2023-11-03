package isa_logstash.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Etiqueta.
 */
@Entity
@Table(name = "etiqueta")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Etiqueta implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre_etiqueta")
    private String nombreEtiqueta;

    @Column(name = "mensajes")
    private String mensajes;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "etiquetas")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "autor", "etiquetas" }, allowSetters = true)
    private Set<Mensaje> mensajes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Etiqueta id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreEtiqueta() {
        return this.nombreEtiqueta;
    }

    public Etiqueta nombreEtiqueta(String nombreEtiqueta) {
        this.setNombreEtiqueta(nombreEtiqueta);
        return this;
    }

    public void setNombreEtiqueta(String nombreEtiqueta) {
        this.nombreEtiqueta = nombreEtiqueta;
    }

    public String getMensajes() {
        return this.mensajes;
    }

    public Etiqueta mensajes(String mensajes) {
        this.setMensajes(mensajes);
        return this;
    }

    public void setMensajes(String mensajes) {
        this.mensajes = mensajes;
    }

    public Set<Mensaje> getMensajes() {
        return this.mensajes;
    }

    public void setMensajes(Set<Mensaje> mensajes) {
        if (this.mensajes != null) {
            this.mensajes.forEach(i -> i.removeEtiquetas(this));
        }
        if (mensajes != null) {
            mensajes.forEach(i -> i.addEtiquetas(this));
        }
        this.mensajes = mensajes;
    }

    public Etiqueta mensajes(Set<Mensaje> mensajes) {
        this.setMensajes(mensajes);
        return this;
    }

    public Etiqueta addMensajes(Mensaje mensaje) {
        this.mensajes.add(mensaje);
        mensaje.getEtiquetas().add(this);
        return this;
    }

    public Etiqueta removeMensajes(Mensaje mensaje) {
        this.mensajes.remove(mensaje);
        mensaje.getEtiquetas().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Etiqueta)) {
            return false;
        }
        return getId() != null && getId().equals(((Etiqueta) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Etiqueta{" +
            "id=" + getId() +
            ", nombreEtiqueta='" + getNombreEtiqueta() + "'" +
            ", mensajes='" + getMensajes() + "'" +
            "}";
    }
}
