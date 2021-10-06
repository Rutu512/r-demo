package com.rutu.rdemo.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Resident.
 */
@Entity
@Table(name = "resident")
public class Resident implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 3, max = 20)
    @Column(name = "residentnamr", length = 20, nullable = false)
    private String residentnamr;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Resident id(Long id) {
        this.id = id;
        return this;
    }

    public String getResidentnamr() {
        return this.residentnamr;
    }

    public Resident residentnamr(String residentnamr) {
        this.residentnamr = residentnamr;
        return this;
    }

    public void setResidentnamr(String residentnamr) {
        this.residentnamr = residentnamr;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Resident)) {
            return false;
        }
        return id != null && id.equals(((Resident) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Resident{" +
            "id=" + getId() +
            ", residentnamr='" + getResidentnamr() + "'" +
            "}";
    }
}
