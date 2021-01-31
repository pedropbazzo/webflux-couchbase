package tech.jhipster.sample.repository;

import com.couchbase.client.java.query.QueryScanConsistency;
import org.springframework.data.couchbase.repository.Query;
import org.springframework.data.couchbase.repository.ScanConsistency;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import tech.jhipster.sample.domain.DocumentBankAccount;

/**
 * Spring Data Couchbase reactive repository for the DocumentBankAccount entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DocumentBankAccountRepository extends ReactiveSortingRepository<DocumentBankAccount, String> {}
