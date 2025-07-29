package com.esprit.springjwt.repository;

import java.util.Date;
import java.util.List;

import com.esprit.springjwt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.esprit.springjwt.entity.Session;
import org.springframework.data.jpa.repository.Query;

public interface SessionRepository extends JpaRepository<Session,Long> {
	List<Session> findByStartDate(Date date);
	List<Session> findByStartDateBetween(Date startDate, Date endDate);
	 List<Session> findByGroups_Id(Long groupId);


	 //query requette get session by generated link

	@Query("SELECT s FROM Session s WHERE s.GeneratedLink = ?1")
	Session findByGeneratedLink(String generatedLink);



	@Query(value = "SELECT s.* " +
			"FROM session s " +

			"JOIN request r ON r.formation_id = s.formation_id " +
			"JOIN user u ON u.username = r.email " +
			"WHERE r.email = :email  AND r.request_status = 'PAID'",
			nativeQuery = true)
	List<Session> getSessionsForUserByRequest( String email);


	@Query(value="select * from session where formation_id =:id",nativeQuery=true)
	List<Session> getSessionByFromationId(Long id);

}
