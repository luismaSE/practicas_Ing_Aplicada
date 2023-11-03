package um.ing_soft.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A MensajePrivado.
 */
@Entity
@Table(name = "mensaje_privado")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MensajePrivado implements Serializable {

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

    @JsonIgnoreProperties(
        value = { "siguiendos", "mensajePublicado", "mensajePrivadoEnviado", "mensajePrivadoRecibido", "mensajeMencionado", "seguidores" },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private Usuario destino;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public MensajePrivado id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTexto() {
        return this.texto;
    }

    public MensajePrivado texto(String texto) {
        this.setTexto(texto);
        return this;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public LocalDate getFecha() {
        return this.fecha;
    }

    public MensajePrivado fecha(LocalDate fecha) {
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

    public MensajePrivado autor(Usuario usuario) {
        this.setAutor(usuario);
        return this;
    }

    public Usuario getDestino() {
        return this.destino;
    }

    public void setDestino(Usuario usuario) {
        this.destino = usuario;
    }

    public MensajePrivado destino(Usuario usuario) {
        this.setDestino(usuario);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MensajePrivado)) {
            return false;
        }
        return id != null && id.equals(((MensajePrivado) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MensajePrivado{" +
            "id=" + getId() +
            ", texto='" + getTexto() + "'" +
            ", fecha='" + getFecha() + "'" +
            "}";
    }
}
