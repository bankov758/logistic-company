package com.nbu.logisticcompany.services;

import com.nbu.logisticcompany.entities.Company;
import com.nbu.logisticcompany.entities.User;
import com.nbu.logisticcompany.exceptions.DuplicateEntityException;
import com.nbu.logisticcompany.exceptions.EntityNotFoundException;
import com.nbu.logisticcompany.mock.UserMockData;
import com.nbu.logisticcompany.repositories.interfaces.CompanyRepository;
import com.nbu.logisticcompany.utils.Action;
import com.nbu.logisticcompany.utils.ValidationUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class CompanyServiceImplTests {

    @Mock
    CompanyRepository companyRepository;

    @InjectMocks
    CompanyServiceImpl companyService;

    @Test
    void getByIdShouldCallRepository() {
        companyService.getById(Mockito.anyInt());

        Mockito.verify(companyRepository, Mockito.times(1))
            .getById(Mockito.anyInt());
    }

    @Test
    void getByNameShouldCallRepository() {
        companyService.getByName("name");

        Mockito.verify(companyRepository, Mockito.times(1))
            .getByField(Mockito.anyString(), Mockito.eq("name"));
    }

    @Test
    void getAllShouldCallRepository() {
        companyService.getAll(Optional.empty());

        Mockito.verify(companyRepository, Mockito.times(1))
            .getAll();
    }

    @Test
    void getCompanyIncomeShouldCallRepository() {
        companyService.getCompanyIncome(1, LocalDateTime.of(1, 1, 1, 1, 1),
                                        LocalDateTime.of(1, 1, 1, 1, 1));

        Mockito.verify(companyRepository, Mockito.times(1))
            .getCompanyIncome(1, LocalDateTime.of(1, 1, 1, 1, 1),
                              LocalDateTime.of(1, 1, 1, 1, 1));
    }

    @Test
    void getCompanyEmployeesShouldCallRepository() {
        companyService.getCompanyEmployees(1, new User());

        Mockito.verify(companyRepository, Mockito.times(1))
            .getCompanyEmployees(1, new User());
    }

    @Test
    void getCompanyClientsShouldCallRepository() {
        companyService.getCompanyClients(1, new User());

        Mockito.verify(companyRepository, Mockito.times(1))
            .getCompanyClients(1, new User());
    }

    @Test
    void getCompanyCouriersShouldCallRepository() {
        companyService.getCompanyCouriers(1, new User());

        Mockito.verify(companyRepository, Mockito.times(1))
            .getCompanyCouriers(1, new User());
    }

    @Test
    void createShouldCallValidateAdminAction() {
        try (MockedStatic<ValidationUtil> mockedStatic = Mockito.mockStatic(ValidationUtil.class)) {
            Mockito.when(companyRepository.getByField("name", null)).thenThrow(EntityNotFoundException.class);

            companyService.create(new Company(), UserMockData.createMockAdmin());

            mockedStatic.verify(() -> ValidationUtil.validateAdminAction(Mockito.any(User.class),
                                                                         Mockito.eq(Company.class), Mockito.eq(Action.CREATE)),
                                Mockito.times(1));
        }
    }

    @Test
    void createShouldThrowIfNameAlreadyExists() {
        Mockito.when(companyRepository.getByField("name", null)).thenReturn(new Company());

        Assertions.assertThrows(DuplicateEntityException.class,
                                () -> companyService.create(new Company(), UserMockData.createMockAdmin()));
    }

    @Test
    void createShouldCallRepository() {
        Mockito.when(companyRepository.getByField("name", null)).thenThrow(EntityNotFoundException.class);

        companyService.create(new Company(), UserMockData.createMockAdmin());

        Mockito.verify(companyRepository, Mockito.times(1))
            .create(new Company());
    }

    @Test
    void updateShouldCallValidateAdminAction() {
        try (MockedStatic<ValidationUtil> mockedStatic = Mockito.mockStatic(ValidationUtil.class)) {
            Mockito.when(companyRepository.getByField("name", null)).thenThrow(EntityNotFoundException.class);

            companyService.update(new Company(), UserMockData.createMockAdmin());

            mockedStatic.verify(() -> ValidationUtil.validateAdminAction(Mockito.any(User.class),
                                                                         Mockito.eq(Company.class), Mockito.eq(Action.UPDATE)),
                                Mockito.times(1));
        }
    }

    @Test
    void updateShouldThrowIfNameAlreadyExists() {
        Mockito.when(companyRepository.getByField("name", null)).thenReturn(new Company());

        Assertions.assertThrows(DuplicateEntityException.class,
                                () -> companyService.update(new Company(), UserMockData.createMockAdmin()));
    }

    @Test
    void updateShouldCallRepository() {
        Mockito.when(companyRepository.getByField("name", null)).thenThrow(EntityNotFoundException.class);

        companyService.update(new Company(), UserMockData.createMockAdmin());

        Mockito.verify(companyRepository, Mockito.times(1))
            .update(Mockito.any(Company.class));
    }

    @Test
    void deleteShouldCallValidateAdminAction() {
        try (MockedStatic<ValidationUtil> mockedStatic = Mockito.mockStatic(ValidationUtil.class)) {
            companyService.delete(1, UserMockData.createMockAdmin());

            mockedStatic.verify(() -> ValidationUtil.validateAdminAction(Mockito.any(User.class),
                                                                         Mockito.eq(Company.class), Mockito.eq(Action.DELETE)),
                                Mockito.times(1));
        }
    }


    @Test
    void deleteShouldCallRepository() {
        companyService.delete(Mockito.anyInt(), UserMockData.createMockAdmin());

        Mockito.verify(companyRepository, Mockito.times(1))
            .delete(Mockito.anyInt());
    }

}
