package com.nbu.logisticcompany.repositories.interfaces;

import com.nbu.logisticcompany.entities.Company;
import com.nbu.logisticcompany.entities.User;

public interface UserRepository extends BaseCRUDRepository<User> {

    Company getEmployeeCompany(int employeeId);

}
