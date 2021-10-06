package com.rutu.rdemo.service;

import com.rutu.rdemo.domain.Facility;
import com.rutu.rdemo.repository.FacilityRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Facility}.
 */
@Service
@Transactional
public class FacilityService {

    private final Logger log = LoggerFactory.getLogger(FacilityService.class);

    private final FacilityRepository facilityRepository;

    public FacilityService(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    /**
     * Save a facility.
     *
     * @param facility the entity to save.
     * @return the persisted entity.
     */
    public Facility save(Facility facility) {
        log.debug("Request to save Facility : {}", facility);
        return facilityRepository.save(facility);
    }

    /**
     * Partially update a facility.
     *
     * @param facility the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Facility> partialUpdate(Facility facility) {
        log.debug("Request to partially update Facility : {}", facility);

        return facilityRepository
            .findById(facility.getId())
            .map(
                existingFacility -> {
                    if (facility.getFacilityname() != null) {
                        existingFacility.setFacilityname(facility.getFacilityname());
                    }

                    return existingFacility;
                }
            )
            .map(facilityRepository::save);
    }

    /**
     * Get all the facilities.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Facility> findAll() {
        log.debug("Request to get all Facilities");
        return facilityRepository.findAll();
    }

    /**
     * Get one facility by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Facility> findOne(Long id) {
        log.debug("Request to get Facility : {}", id);
        return facilityRepository.findById(id);
    }

    /**
     * Delete the facility by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Facility : {}", id);
        facilityRepository.deleteById(id);
    }
}
