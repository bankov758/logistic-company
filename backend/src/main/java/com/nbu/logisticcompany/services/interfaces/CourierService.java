package com.nbu.logisticcompany.services.interfaces;

import com.nbu.logisticcompany.entities.Courier;
import com.nbu.logisticcompany.entities.User;

import java.util.List;
import java.util.Optional;

public interface CourierService {

    Courier getById(int id);

    Courier getByUsername(String username);

    List<Courier> getAll(Optional<String> search);

    void create(Courier courier);

    void update(Courier courierToUpdate, User updater);

    void delete(int courierToDeleteId, User deleter);
    
}