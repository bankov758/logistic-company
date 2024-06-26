package com.nbu.logisticcompany.services.interfaces;

import com.nbu.logisticcompany.entities.Tariff;
import com.nbu.logisticcompany.entities.User;

import java.util.List;
public interface TariffsService {

    Tariff getById(int id);

    Tariff getByCompany(int companyId);

    List<Tariff> getAll();

    void create(Tariff tariff, User creator);

    void update(Tariff tariffToUpdate, User updater);

    void delete(int tariffId, User destroyer);

}
