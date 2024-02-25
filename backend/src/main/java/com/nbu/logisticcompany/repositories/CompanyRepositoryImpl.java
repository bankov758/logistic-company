package com.nbu.logisticcompany.repositories;

import com.nbu.logisticcompany.entities.Company;
import com.nbu.logisticcompany.entities.User;
import com.nbu.logisticcompany.entities.dtos.company.CompanyOutDto;
import com.nbu.logisticcompany.entities.dtos.user.ClientOutDto;
import com.nbu.logisticcompany.entities.dtos.user.CompanyEmployeesDto;
import com.nbu.logisticcompany.repositories.interfaces.CompanyRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class CompanyRepositoryImpl extends AbstractRepository<Company> implements CompanyRepository {

    public CompanyRepositoryImpl(SessionFactory sessionFactory) {
        super(Company.class, sessionFactory);
    }

    public List<CompanyOutDto> getCompanyIncome(int companyId, LocalDateTime periodStart, LocalDateTime periodEnd) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery(" select new com.nbu.logisticcompany.entities.dtos.company.CompanyOutDto " +
                            " (company.id, company.name, SUM(coalesce(shipment.price, 0))) from Shipment shipment " +
                            " join shipment.company company " +
                            " WHERE shipment.receivedDate >= :periodStart " +
                            " AND shipment.receivedDate <= :periodEnd " +
                            " AND company.id = :companyId " +
                            " GROUP BY company.id, company.name ", CompanyOutDto.class)
                    .setParameter("periodStart", periodStart)
                    .setParameter("periodEnd", periodEnd)
                    .setParameter("companyId", companyId).getResultList();
        }
    }

    public List<CompanyEmployeesDto> getCompanyEmployees(int companyId, User user) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery(" select new com.nbu.logisticcompany.entities.dtos.user.CompanyEmployeesDto " +
                            " (employee.id, employee.username, employee.firstName," +
                            " employee.lastName, employee.company.name) from Employee employee " +
                            " where employee.company.id = :companyId", CompanyEmployeesDto.class)
                    .setParameter("companyId", companyId)
                    .getResultList();
        }
    }

    public List<ClientOutDto> getCompanyClients(int companyId, User user) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery(
                            " select new com.nbu.logisticcompany.entities.dtos.user.ClientOutDto   " +
                                    " (user.firstName, user.lastName ) from User user" +
                                    " where user.id in (select distinct shipment.sender.id from Shipment shipment where shipment.company.id =:companyId ) or " +
                                    " user.id in (select distinct shipment.receiver.id from Shipment shipment  where shipment.company.id =:companyId ) ", ClientOutDto.class)
                    .setParameter("companyId", companyId)
                    .getResultList();
        }
    }


}
