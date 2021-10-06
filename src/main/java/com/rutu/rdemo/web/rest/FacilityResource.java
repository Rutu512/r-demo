package com.rutu.rdemo.web.rest;

import com.rutu.rdemo.domain.Facility;
import com.rutu.rdemo.repository.FacilityRepository;
import com.rutu.rdemo.service.FacilityService;
import com.rutu.rdemo.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.rutu.rdemo.domain.Facility}.
 */
@RestController
@RequestMapping("/api")
public class FacilityResource {

    private final Logger log = LoggerFactory.getLogger(FacilityResource.class);

    private static final String ENTITY_NAME = "facility";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FacilityService facilityService;

    private final FacilityRepository facilityRepository;

    public FacilityResource(FacilityService facilityService, FacilityRepository facilityRepository) {
        this.facilityService = facilityService;
        this.facilityRepository = facilityRepository;
    }

    /**
     * {@code POST  /facilities} : Create a new facility.
     *
     * @param facility the facility to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new facility, or with status {@code 400 (Bad Request)} if the facility has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/facilities")
    public ResponseEntity<Facility> createFacility(@Valid @RequestBody Facility facility) throws URISyntaxException {
        log.debug("REST request to save Facility : {}", facility);
        if (facility.getId() != null) {
            throw new BadRequestAlertException("A new facility cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Facility result = facilityService.save(facility);
        return ResponseEntity
            .created(new URI("/api/facilities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /facilities/:id} : Updates an existing facility.
     *
     * @param id the id of the facility to save.
     * @param facility the facility to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated facility,
     * or with status {@code 400 (Bad Request)} if the facility is not valid,
     * or with status {@code 500 (Internal Server Error)} if the facility couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/facilities/{id}")
    public ResponseEntity<Facility> updateFacility(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Facility facility
    ) throws URISyntaxException {
        log.debug("REST request to update Facility : {}, {}", id, facility);
        if (facility.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, facility.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!facilityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Facility result = facilityService.save(facility);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, facility.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /facilities/:id} : Partial updates given fields of an existing facility, field will ignore if it is null
     *
     * @param id the id of the facility to save.
     * @param facility the facility to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated facility,
     * or with status {@code 400 (Bad Request)} if the facility is not valid,
     * or with status {@code 404 (Not Found)} if the facility is not found,
     * or with status {@code 500 (Internal Server Error)} if the facility couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/facilities/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Facility> partialUpdateFacility(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Facility facility
    ) throws URISyntaxException {
        log.debug("REST request to partial update Facility partially : {}, {}", id, facility);
        if (facility.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, facility.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!facilityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Facility> result = facilityService.partialUpdate(facility);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, facility.getId().toString())
        );
    }

    /**
     * {@code GET  /facilities} : get all the facilities.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of facilities in body.
     */
    @GetMapping("/facilities")
    public List<Facility> getAllFacilities() {
        log.debug("REST request to get all Facilities");
        return facilityService.findAll();
    }

    /**
     * {@code GET  /facilities/:id} : get the "id" facility.
     *
     * @param id the id of the facility to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the facility, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/facilities/{id}")
    public ResponseEntity<Facility> getFacility(@PathVariable Long id) {
        log.debug("REST request to get Facility : {}", id);
        Optional<Facility> facility = facilityService.findOne(id);
        return ResponseUtil.wrapOrNotFound(facility);
    }

    /**
     * {@code DELETE  /facilities/:id} : delete the "id" facility.
     *
     * @param id the id of the facility to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/facilities/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable Long id) {
        log.debug("REST request to delete Facility : {}", id);
        facilityService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
