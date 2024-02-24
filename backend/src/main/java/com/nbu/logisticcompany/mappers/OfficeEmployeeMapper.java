package com.nbu.logisticcompany.mappers;

import com.nbu.logisticcompany.entities.OfficeEmployee;
import com.nbu.logisticcompany.entities.dtos.user.OfficeEmployeeOutDto;
import com.nbu.logisticcompany.entities.dtos.user.OfficeEmployeeRegisterDto;
import com.nbu.logisticcompany.entities.dtos.user.OfficeEmployeeUpdateDto;
import com.nbu.logisticcompany.services.interfaces.CompanyService;
import com.nbu.logisticcompany.services.interfaces.OfficeEmployeeService;
import com.nbu.logisticcompany.services.interfaces.OfficeService;
import com.nbu.logisticcompany.services.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OfficeEmployeeMapper extends UserMapper {

    private final CompanyService companyService;
    private final OfficeService officeService;
    private final OfficeEmployeeService officeEmployeeService;

    @Autowired
    public OfficeEmployeeMapper(CompanyService companyService, OfficeService officeService,
                                OfficeEmployeeService officeEmployeeService, UserService userService) {
        super(userService);
        this.companyService = companyService;
        this.officeService = officeService;
        this.officeEmployeeService = officeEmployeeService;
    }

    public OfficeEmployee DtoToObject(OfficeEmployeeRegisterDto officeEmployeeRegisterDto) {
        OfficeEmployee officeEmployee = new OfficeEmployee();
        setUserFieldsFromDto(officeEmployee, officeEmployeeRegisterDto);
        officeEmployee.setCompany(companyService.getByName(officeEmployeeRegisterDto.getCompanyName()));
        officeEmployee.setOffice(officeService.getByAddress(officeEmployeeRegisterDto.getOfficeAddress()));
        return officeEmployee;
    }

    public OfficeEmployeeOutDto ObjectToDto(OfficeEmployee officeEmployee) {
        OfficeEmployeeOutDto officeEmployeeOutDto = new OfficeEmployeeOutDto();
        setFieldsFormObjectToOutDto(officeEmployee, officeEmployeeOutDto);
        officeEmployeeOutDto.setCompanyName(officeEmployee.getCompany().getName());
        officeEmployeeOutDto.setOfficeAddress(officeEmployee.getOffice().getAddress());
        return officeEmployeeOutDto;
    }

    public OfficeEmployee UpdateDtoToOfficeEmployee(OfficeEmployeeUpdateDto officeEmployeeUpdateDto) {
        OfficeEmployee officeEmployee = officeEmployeeService.getById(officeEmployeeUpdateDto.getId());
        setFieldsFromUpdateDtoToObject(officeEmployeeUpdateDto, officeEmployee);
        officeEmployee.setCompany(companyService.getByName(officeEmployeeUpdateDto.getCompanyName()));
        officeEmployee.setOffice(officeService.getByAddress(officeEmployeeUpdateDto.getOfficeAddress()));
        return officeEmployee;
    }

}
