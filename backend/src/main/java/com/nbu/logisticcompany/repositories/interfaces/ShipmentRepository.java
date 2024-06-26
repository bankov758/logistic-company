package com.nbu.logisticcompany.repositories.interfaces;

import com.nbu.logisticcompany.entities.OfficeEmployee;
import com.nbu.logisticcompany.entities.Shipment;
import com.nbu.logisticcompany.entities.User;

import java.util.List;
import java.util.Optional;

public interface ShipmentRepository extends BaseCRUDRepository<Shipment> {

    Shipment getBySenderId(int senderId);

    Shipment getByReceiverId(int receiverId);

    Shipment getByEmployeeId(int employeeId);

    List<Shipment> getNotDelivered(int companyId);

    List<Shipment> getBySenderOrReceiver(int userId);

    List<Shipment> getByCompanyId(int companyId);

    List<Shipment> filter(Optional<Integer> senderId, Optional<Integer> receiverId,
                          Optional<Integer> employeeId, Optional<String> shipmentStatus);

    User getSender(int shipmentId);

    User getReceiver(int shipmentId);

    OfficeEmployee getEmployee(int shipmentId);

}
