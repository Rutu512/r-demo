package com.rutu.rdemo.service;

import com.rutu.rdemo.domain.Resident;
import com.rutu.rdemo.repository.ResidentRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Resident}.
 */
@Service
@Transactional
public class ResidentService {

    private final Logger log = LoggerFactory.getLogger(ResidentService.class);

    private final ResidentRepository residentRepository;

    public ResidentService(ResidentRepository residentRepository) {
        this.residentRepository = residentRepository;
    }

    /**
     * Save a resident.
     *
     * @param resident the entity to save.
     * @return the persisted entity.
     */
    public Resident save(Resident resident) {
        log.debug("Request to save Resident : {}", resident);
        return residentRepository.save(resident);
    }

    /**
     * Partially update a resident.
     *
     * @param resident the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Resident> partialUpdate(Resident resident) {
        log.debug("Request to partially update Resident : {}", resident);

        return residentRepository
            .findById(resident.getId())
            .map(
                existingResident -> {
                    if (resident.getResidentnamr() != null) {
                        existingResident.setResidentnamr(resident.getResidentnamr());
                    }

                    return existingResident;
                }
            )
            .map(residentRepository::save);
    }

    /**
     * Get all the residents.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Resident> findAll() {
        log.debug("Request to get all Residents");
        return residentRepository.findAll();
    }

    /**
     * Get one resident by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Resident> findOne(Long id) {
        log.debug("Request to get Resident : {}", id);
        return residentRepository.findById(id);
    }

    /**
     * Delete the resident by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Resident : {}", id);
        residentRepository.deleteById(id);
    }
}
