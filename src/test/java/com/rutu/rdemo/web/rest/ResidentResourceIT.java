package com.rutu.rdemo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.rutu.rdemo.IntegrationTest;
import com.rutu.rdemo.domain.Resident;
import com.rutu.rdemo.repository.ResidentRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ResidentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ResidentResourceIT {

    private static final String DEFAULT_RESIDENTNAMR = "AAAAAAAAAA";
    private static final String UPDATED_RESIDENTNAMR = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/residents";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ResidentRepository residentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restResidentMockMvc;

    private Resident resident;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Resident createEntity(EntityManager em) {
        Resident resident = new Resident().residentnamr(DEFAULT_RESIDENTNAMR);
        return resident;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Resident createUpdatedEntity(EntityManager em) {
        Resident resident = new Resident().residentnamr(UPDATED_RESIDENTNAMR);
        return resident;
    }

    @BeforeEach
    public void initTest() {
        resident = createEntity(em);
    }

    @Test
    @Transactional
    void createResident() throws Exception {
        int databaseSizeBeforeCreate = residentRepository.findAll().size();
        // Create the Resident
        restResidentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resident)))
            .andExpect(status().isCreated());

        // Validate the Resident in the database
        List<Resident> residentList = residentRepository.findAll();
        assertThat(residentList).hasSize(databaseSizeBeforeCreate + 1);
        Resident testResident = residentList.get(residentList.size() - 1);
        assertThat(testResident.getResidentnamr()).isEqualTo(DEFAULT_RESIDENTNAMR);
    }

    @Test
    @Transactional
    void createResidentWithExistingId() throws Exception {
        // Create the Resident with an existing ID
        resident.setId(1L);

        int databaseSizeBeforeCreate = residentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restResidentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resident)))
            .andExpect(status().isBadRequest());

        // Validate the Resident in the database
        List<Resident> residentList = residentRepository.findAll();
        assertThat(residentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkResidentnamrIsRequired() throws Exception {
        int databaseSizeBeforeTest = residentRepository.findAll().size();
        // set the field null
        resident.setResidentnamr(null);

        // Create the Resident, which fails.

        restResidentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resident)))
            .andExpect(status().isBadRequest());

        List<Resident> residentList = residentRepository.findAll();
        assertThat(residentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllResidents() throws Exception {
        // Initialize the database
        residentRepository.saveAndFlush(resident);

        // Get all the residentList
        restResidentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resident.getId().intValue())))
            .andExpect(jsonPath("$.[*].residentnamr").value(hasItem(DEFAULT_RESIDENTNAMR)));
    }

    @Test
    @Transactional
    void getResident() throws Exception {
        // Initialize the database
        residentRepository.saveAndFlush(resident);

        // Get the resident
        restResidentMockMvc
            .perform(get(ENTITY_API_URL_ID, resident.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(resident.getId().intValue()))
            .andExpect(jsonPath("$.residentnamr").value(DEFAULT_RESIDENTNAMR));
    }

    @Test
    @Transactional
    void getNonExistingResident() throws Exception {
        // Get the resident
        restResidentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewResident() throws Exception {
        // Initialize the database
        residentRepository.saveAndFlush(resident);

        int databaseSizeBeforeUpdate = residentRepository.findAll().size();

        // Update the resident
        Resident updatedResident = residentRepository.findById(resident.getId()).get();
        // Disconnect from session so that the updates on updatedResident are not directly saved in db
        em.detach(updatedResident);
        updatedResident.residentnamr(UPDATED_RESIDENTNAMR);

        restResidentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedResident.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedResident))
            )
            .andExpect(status().isOk());

        // Validate the Resident in the database
        List<Resident> residentList = residentRepository.findAll();
        assertThat(residentList).hasSize(databaseSizeBeforeUpdate);
        Resident testResident = residentList.get(residentList.size() - 1);
        assertThat(testResident.getResidentnamr()).isEqualTo(UPDATED_RESIDENTNAMR);
    }

    @Test
    @Transactional
    void putNonExistingResident() throws Exception {
        int databaseSizeBeforeUpdate = residentRepository.findAll().size();
        resident.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResidentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, resident.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(resident))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resident in the database
        List<Resident> residentList = residentRepository.findAll();
        assertThat(residentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchResident() throws Exception {
        int databaseSizeBeforeUpdate = residentRepository.findAll().size();
        resident.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResidentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(resident))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resident in the database
        List<Resident> residentList = residentRepository.findAll();
        assertThat(residentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamResident() throws Exception {
        int databaseSizeBeforeUpdate = residentRepository.findAll().size();
        resident.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResidentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resident)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Resident in the database
        List<Resident> residentList = residentRepository.findAll();
        assertThat(residentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateResidentWithPatch() throws Exception {
        // Initialize the database
        residentRepository.saveAndFlush(resident);

        int databaseSizeBeforeUpdate = residentRepository.findAll().size();

        // Update the resident using partial update
        Resident partialUpdatedResident = new Resident();
        partialUpdatedResident.setId(resident.getId());

        restResidentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedResident.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedResident))
            )
            .andExpect(status().isOk());

        // Validate the Resident in the database
        List<Resident> residentList = residentRepository.findAll();
        assertThat(residentList).hasSize(databaseSizeBeforeUpdate);
        Resident testResident = residentList.get(residentList.size() - 1);
        assertThat(testResident.getResidentnamr()).isEqualTo(DEFAULT_RESIDENTNAMR);
    }

    @Test
    @Transactional
    void fullUpdateResidentWithPatch() throws Exception {
        // Initialize the database
        residentRepository.saveAndFlush(resident);

        int databaseSizeBeforeUpdate = residentRepository.findAll().size();

        // Update the resident using partial update
        Resident partialUpdatedResident = new Resident();
        partialUpdatedResident.setId(resident.getId());

        partialUpdatedResident.residentnamr(UPDATED_RESIDENTNAMR);

        restResidentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedResident.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedResident))
            )
            .andExpect(status().isOk());

        // Validate the Resident in the database
        List<Resident> residentList = residentRepository.findAll();
        assertThat(residentList).hasSize(databaseSizeBeforeUpdate);
        Resident testResident = residentList.get(residentList.size() - 1);
        assertThat(testResident.getResidentnamr()).isEqualTo(UPDATED_RESIDENTNAMR);
    }

    @Test
    @Transactional
    void patchNonExistingResident() throws Exception {
        int databaseSizeBeforeUpdate = residentRepository.findAll().size();
        resident.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResidentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, resident.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(resident))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resident in the database
        List<Resident> residentList = residentRepository.findAll();
        assertThat(residentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchResident() throws Exception {
        int databaseSizeBeforeUpdate = residentRepository.findAll().size();
        resident.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResidentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(resident))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resident in the database
        List<Resident> residentList = residentRepository.findAll();
        assertThat(residentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamResident() throws Exception {
        int databaseSizeBeforeUpdate = residentRepository.findAll().size();
        resident.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResidentMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(resident)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Resident in the database
        List<Resident> residentList = residentRepository.findAll();
        assertThat(residentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteResident() throws Exception {
        // Initialize the database
        residentRepository.saveAndFlush(resident);

        int databaseSizeBeforeDelete = residentRepository.findAll().size();

        // Delete the resident
        restResidentMockMvc
            .perform(delete(ENTITY_API_URL_ID, resident.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Resident> residentList = residentRepository.findAll();
        assertThat(residentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
