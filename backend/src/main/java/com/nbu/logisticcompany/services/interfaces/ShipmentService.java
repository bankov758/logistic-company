package com.nbu.logisticcompany.services.interfaces;

import com.nbu.logisticcompany.entities.OfficeEmployee;
import com.nbu.logisticcompany.entities.Shipment;
import com.nbu.logisticcompany.entities.User;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface ShipmentService {

    Shipment getById(int id);

    List<Shipment> getNotDelivered(int companyId);

    List<Shipment> getBySenderOrReceiver(int userId);

    List<Shipment> getByCompanyId(int companyId);

    List<Shipment> getAll();

    List<Shipment> filter(Optional<Integer> senderId, Optional<Integer> receiverId,
                          Optional<Integer> employeeId, Optional<String> shipmentStatus);

    User getSender(int shipmentId);

    User getReceiver(int shipmentId);

    OfficeEmployee getEmployee(int shipmentId);

    void create(Shipment shipment, User creator) throws IOException;

    void update(Shipment shipment, User updater);

    void delete(int shipmentId, User destroyer);
}
