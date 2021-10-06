package com.rutu.rdemo.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Facility.
 */
@Entity
@Table(name = "facility")
public class Facility implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 3, max = 20)
    @Column(name = "facilityname", length = 20, nullable = false)
    private String facilityname;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Facility id(Long id) {
        this.id = id;
        return this;
    }

    public String getFacilityname() {
        return this.facilityname;
    }

    public Facility facilityname(String facilityname) {
        this.facilityname = facilityname;
        return this;
    }

    public void setFacilityname(String facilityname) {
        this.facilityname = facilityname;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Facility)) {
            return false;
        }
        return id != null && id.equals(((Facility) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Facility{" +
            "id=" + getId() +
            ", facilityname='" + getFacilityname() + "'" +
            "}";
    }
}
