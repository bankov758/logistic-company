package com.nbu.logisticcompany.services;

import com.nbu.logisticcompany.entities.Company;
import com.nbu.logisticcompany.entities.Role;
import com.nbu.logisticcompany.entities.User;
import com.nbu.logisticcompany.entities.dtos.company.CompanyOutDto;
import com.nbu.logisticcompany.exceptions.DuplicateEntityException;
import com.nbu.logisticcompany.exceptions.EntityNotFoundException;
import com.nbu.logisticcompany.exceptions.UnauthorizedOperationException;
import com.nbu.logisticcompany.repositories.interfaces.CompanyRepository;
import com.nbu.logisticcompany.services.interfaces.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CompanyServiceImpl implements CompanyService {

    private static final String UNAUTHORIZED_CREATE = "Only Admins can create companies";
    private static final String UNAUTHORIZED_UPDATE = "Only Admins can update companies";
    private static final String UNAUTHORIZED_DELETE = "Only Admins can delete companies";

    private final CompanyRepository companyRepository;

    @Autowired
    public CompanyServiceImpl(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    public Company getById(int id) {
        return companyRepository.getById(id);
    }

    @Override
    public Company getByName(String name) {
        return companyRepository.getByField("name", name);
    }

    @Override
    public List<Company> getAll(Optional<String> search) {
        return companyRepository.getAll();
    }

    @Override
    public List<CompanyOutDto> getCompanyIncome(int companyId, LocalDateTime periodStart, LocalDateTime periodEnd) {
        return companyRepository.getCompanyIncome(companyId, periodStart, periodEnd);
    }

    @Override
    public void create(Company company, User creator) {
        if (!creator.getRoles().contains(Role.ADMIN)) {
            throw new UnauthorizedOperationException(UNAUTHORIZED_CREATE);
        }
        boolean duplicateCompany = true;
        try {
            companyRepository.getByField("name", company.getName());
        } catch (EntityNotFoundException e) {
            duplicateCompany = false;
        }
        if (duplicateCompany) {
            throw new DuplicateEntityException(Company.class.getSimpleName(), "name", company.getName());
        }
        companyRepository.create(company);
    }

    @Override
    public void update(Company companyToUpdate, User user) {
        if (!user.getRoles().contains(Role.ADMIN)) {
            throw new UnauthorizedOperationException(UNAUTHORIZED_UPDATE);
        }
        companyRepository.update(companyToUpdate);
    }

    @Override
    public void delete(int companyId, User user) {
        if (!user.getRoles().contains(Role.ADMIN)) {
            throw new UnauthorizedOperationException(UNAUTHORIZED_DELETE);
        }
        companyRepository.delete(companyId);
    }

}
