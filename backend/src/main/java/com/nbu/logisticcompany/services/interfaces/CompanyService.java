package com.nbu.logisticcompany.services.interfaces;

import com.nbu.logisticcompany.entities.Company;
import com.nbu.logisticcompany.entities.User;
import com.nbu.logisticcompany.entities.dtos.company.CompanyOutDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CompanyService {

    Company getById(int id);

    Company getByName(String name);

    List<Company> getAll(Optional<String> search);

    List<CompanyOutDto> getCompanyIncome(int companyId, LocalDateTime periodStart, LocalDateTime periodEnd);

    void create(Company company);

    void update(Company companyToUpdate, User user );

    void delete(int companyId, User user);

}
