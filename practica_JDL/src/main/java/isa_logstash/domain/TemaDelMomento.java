package isa_logstash.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TemaDelMomento.
 */
@Entity
@Table(name = "tema_del_momento")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TemaDelMomento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "etiqueta")
    private String etiqueta;

    @Column(name = "numero_repeticiones")
    private Integer numeroRepeticiones;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TemaDelMomento id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEtiqueta() {
        return this.etiqueta;
    }

    public TemaDelMomento etiqueta(String etiqueta) {
        this.setEtiqueta(etiqueta);
        return this;
    }

    public void setEtiqueta(String etiqueta) {
        this.etiqueta = etiqueta;
    }

    public Integer getNumeroRepeticiones() {
        return this.numeroRepeticiones;
    }

    public TemaDelMomento numeroRepeticiones(Integer numeroRepeticiones) {
        this.setNumeroRepeticiones(numeroRepeticiones);
        return this;
    }

    public void setNumeroRepeticiones(Integer numeroRepeticiones) {
        this.numeroRepeticiones = numeroRepeticiones;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TemaDelMomento)) {
            return false;
        }
        return getId() != null && getId().equals(((TemaDelMomento) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TemaDelMomento{" +
            "id=" + getId() +
            ", etiqueta='" + getEtiqueta() + "'" +
            ", numeroRepeticiones=" + getNumeroRepeticiones() +
            "}";
    }
}
