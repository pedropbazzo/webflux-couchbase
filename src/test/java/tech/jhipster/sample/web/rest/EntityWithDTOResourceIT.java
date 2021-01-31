package tech.jhipster.sample.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import java.time.Duration;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.TestSecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;
import tech.jhipster.sample.IntegrationTest;
import tech.jhipster.sample.domain.EntityWithDTO;
import tech.jhipster.sample.repository.EntityWithDTORepository;
import tech.jhipster.sample.service.dto.EntityWithDTODTO;
import tech.jhipster.sample.service.mapper.EntityWithDTOMapper;

/**
 * Integration tests for the {@link EntityWithDTOResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class EntityWithDTOResourceIT {

    private static final String DEFAULT_EMMA = "AAAAAAAAAA";
    private static final String UPDATED_EMMA = "BBBBBBBBBB";

    @Autowired
    private EntityWithDTORepository entityWithDTORepository;

    @Autowired
    private EntityWithDTOMapper entityWithDTOMapper;

    @Autowired
    private WebTestClient webTestClient;

    private EntityWithDTO entityWithDTO;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EntityWithDTO createEntity() {
        EntityWithDTO entityWithDTO = new EntityWithDTO().emma(DEFAULT_EMMA);
        return entityWithDTO;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EntityWithDTO createUpdatedEntity() {
        EntityWithDTO entityWithDTO = new EntityWithDTO().emma(UPDATED_EMMA);
        return entityWithDTO;
    }

    @BeforeEach
    public void initTest() {
        entityWithDTORepository.deleteAll().block();
        entityWithDTO = createEntity();
    }

    @Test
    void createEntityWithDTO() throws Exception {
        int databaseSizeBeforeCreate = entityWithDTORepository.findAll().collectList().block().size();
        // Create the EntityWithDTO
        EntityWithDTODTO entityWithDTODTO = entityWithDTOMapper.toDto(entityWithDTO);
        webTestClient
            .post()
            .uri("/api/entity-with-dtos")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(entityWithDTODTO))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the EntityWithDTO in the database
        SecurityContextHolder.setContext(TestSecurityContextHolder.getContext());
        List<EntityWithDTO> entityWithDTOList = entityWithDTORepository.findAll().collectList().block();
        assertThat(entityWithDTOList).hasSize(databaseSizeBeforeCreate + 1);
        EntityWithDTO testEntityWithDTO = entityWithDTOList.get(entityWithDTOList.size() - 1);
        assertThat(testEntityWithDTO.getEmma()).isEqualTo(DEFAULT_EMMA);
    }

    @Test
    void createEntityWithDTOWithExistingId() throws Exception {
        // Create the EntityWithDTO with an existing ID
        entityWithDTO.setId("existing_id");
        EntityWithDTODTO entityWithDTODTO = entityWithDTOMapper.toDto(entityWithDTO);

        int databaseSizeBeforeCreate = entityWithDTORepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri("/api/entity-with-dtos")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(entityWithDTODTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the EntityWithDTO in the database
        SecurityContextHolder.setContext(TestSecurityContextHolder.getContext());
        List<EntityWithDTO> entityWithDTOList = entityWithDTORepository.findAll().collectList().block();
        assertThat(entityWithDTOList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllEntityWithDTOSAsStream() {
        // Initialize the database
        entityWithDTORepository.save(entityWithDTO).block();

        List<EntityWithDTO> entityWithDTOList = webTestClient
            .get()
            .uri("/api/entity-with-dtos")
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(EntityWithDTODTO.class)
            .getResponseBody()
            .map(entityWithDTOMapper::toEntity)
            .filter(entityWithDTO::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(entityWithDTOList).isNotNull();
        assertThat(entityWithDTOList).hasSize(1);
        EntityWithDTO testEntityWithDTO = entityWithDTOList.get(0);
        assertThat(testEntityWithDTO.getEmma()).isEqualTo(DEFAULT_EMMA);
    }

    @Test
    void getAllEntityWithDTOS() {
        // Initialize the database
        entityWithDTORepository.save(entityWithDTO).block();

        // Get all the entityWithDTOList
        webTestClient
            .get()
            .uri("/api/entity-with-dtos?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(entityWithDTO.getId()))
            .jsonPath("$.[*].emma")
            .value(hasItem(DEFAULT_EMMA));
    }

    @Test
    void getEntityWithDTO() {
        // Initialize the database
        entityWithDTORepository.save(entityWithDTO).block();

        // Get the entityWithDTO
        webTestClient
            .get()
            .uri("/api/entity-with-dtos/{id}", entityWithDTO.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(entityWithDTO.getId()))
            .jsonPath("$.emma")
            .value(is(DEFAULT_EMMA));
    }

    @Test
    void getNonExistingEntityWithDTO() {
        // Get the entityWithDTO
        webTestClient
            .get()
            .uri("/api/entity-with-dtos/{id}", Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void updateEntityWithDTO() throws Exception {
        // Initialize the database
        entityWithDTORepository.save(entityWithDTO).block();

        int databaseSizeBeforeUpdate = entityWithDTORepository.findAll().collectList().block().size();

        // Update the entityWithDTO
        EntityWithDTO updatedEntityWithDTO = entityWithDTORepository.findById(entityWithDTO.getId()).block();
        updatedEntityWithDTO.emma(UPDATED_EMMA);
        EntityWithDTODTO entityWithDTODTO = entityWithDTOMapper.toDto(updatedEntityWithDTO);

        webTestClient
            .put()
            .uri("/api/entity-with-dtos")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(entityWithDTODTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the EntityWithDTO in the database
        SecurityContextHolder.setContext(TestSecurityContextHolder.getContext());
        List<EntityWithDTO> entityWithDTOList = entityWithDTORepository.findAll().collectList().block();
        assertThat(entityWithDTOList).hasSize(databaseSizeBeforeUpdate);
        EntityWithDTO testEntityWithDTO = entityWithDTOList.get(entityWithDTOList.size() - 1);
        assertThat(testEntityWithDTO.getEmma()).isEqualTo(UPDATED_EMMA);
    }

    @Test
    void updateNonExistingEntityWithDTO() throws Exception {
        int databaseSizeBeforeUpdate = entityWithDTORepository.findAll().collectList().block().size();

        // Create the EntityWithDTO
        EntityWithDTODTO entityWithDTODTO = entityWithDTOMapper.toDto(entityWithDTO);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri("/api/entity-with-dtos")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(entityWithDTODTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the EntityWithDTO in the database
        SecurityContextHolder.setContext(TestSecurityContextHolder.getContext());
        List<EntityWithDTO> entityWithDTOList = entityWithDTORepository.findAll().collectList().block();
        assertThat(entityWithDTOList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateEntityWithDTOWithPatch() throws Exception {
        // Initialize the database
        entityWithDTORepository.save(entityWithDTO).block();

        int databaseSizeBeforeUpdate = entityWithDTORepository.findAll().collectList().block().size();

        // Update the entityWithDTO using partial update
        EntityWithDTO partialUpdatedEntityWithDTO = new EntityWithDTO();
        partialUpdatedEntityWithDTO.setId(entityWithDTO.getId());

        webTestClient
            .patch()
            .uri("/api/entity-with-dtos")
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedEntityWithDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the EntityWithDTO in the database
        SecurityContextHolder.setContext(TestSecurityContextHolder.getContext());
        List<EntityWithDTO> entityWithDTOList = entityWithDTORepository.findAll().collectList().block();
        assertThat(entityWithDTOList).hasSize(databaseSizeBeforeUpdate);
        EntityWithDTO testEntityWithDTO = entityWithDTOList.get(entityWithDTOList.size() - 1);
        assertThat(testEntityWithDTO.getEmma()).isEqualTo(DEFAULT_EMMA);
    }

    @Test
    void fullUpdateEntityWithDTOWithPatch() throws Exception {
        // Initialize the database
        entityWithDTORepository.save(entityWithDTO).block();

        int databaseSizeBeforeUpdate = entityWithDTORepository.findAll().collectList().block().size();

        // Update the entityWithDTO using partial update
        EntityWithDTO partialUpdatedEntityWithDTO = new EntityWithDTO();
        partialUpdatedEntityWithDTO.setId(entityWithDTO.getId());

        partialUpdatedEntityWithDTO.emma(UPDATED_EMMA);

        webTestClient
            .patch()
            .uri("/api/entity-with-dtos")
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedEntityWithDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the EntityWithDTO in the database
        SecurityContextHolder.setContext(TestSecurityContextHolder.getContext());
        List<EntityWithDTO> entityWithDTOList = entityWithDTORepository.findAll().collectList().block();
        assertThat(entityWithDTOList).hasSize(databaseSizeBeforeUpdate);
        EntityWithDTO testEntityWithDTO = entityWithDTOList.get(entityWithDTOList.size() - 1);
        assertThat(testEntityWithDTO.getEmma()).isEqualTo(UPDATED_EMMA);
    }

    @Test
    void partialUpdateEntityWithDTOShouldThrown() throws Exception {
        // Update the entityWithDTO without id should throw
        EntityWithDTO partialUpdatedEntityWithDTO = new EntityWithDTO();

        webTestClient
            .patch()
            .uri("/api/entity-with-dtos")
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedEntityWithDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();
    }

    @Test
    void deleteEntityWithDTO() {
        // Initialize the database
        entityWithDTORepository.save(entityWithDTO).block();

        int databaseSizeBeforeDelete = entityWithDTORepository.findAll().collectList().block().size();

        // Delete the entityWithDTO
        webTestClient
            .delete()
            .uri("/api/entity-with-dtos/{id}", entityWithDTO.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        SecurityContextHolder.setContext(TestSecurityContextHolder.getContext());
        List<EntityWithDTO> entityWithDTOList = entityWithDTORepository.findAll().collectList().block();
        assertThat(entityWithDTOList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
