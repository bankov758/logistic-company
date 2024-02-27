package com.nbu.logisticcompany.repositories;

import com.nbu.logisticcompany.entities.Shipment;
import com.nbu.logisticcompany.entities.dtos.shipment.ShipmentOutDto;
import com.nbu.logisticcompany.exceptions.EntityNotFoundException;
import com.nbu.logisticcompany.repositories.interfaces.ShipmentRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ShipmentRepositoryImpl extends AbstractRepository<Shipment> implements ShipmentRepository {

    public ShipmentRepositoryImpl(SessionFactory sessionFactory) {
        super(Shipment.class, sessionFactory);
    }

    @Override
    public Shipment getBySenderId(int senderId) {
        try (Session session = sessionFactory.openSession()) {
            return session
                    .createQuery(" from Shipment where sender.id = :senderId ", Shipment.class)
                    .setParameter("senderId", senderId)
                    .uniqueResultOptional()
                    .orElseThrow(() -> new EntityNotFoundException(Shipment.class.getSimpleName(),
                            "senderId", String.valueOf(senderId)));
        }
    }

    @Override
    public Shipment getByReceiverId(int receiverId) {
        try (Session session = sessionFactory.openSession()) {
            return session
                    .createQuery(" from Shipment where receiver.id = :receiverId ", Shipment.class)
                    .setParameter("receiverId", receiverId)
                    .uniqueResultOptional()
                    .orElseThrow(() -> new EntityNotFoundException(Shipment.class.getSimpleName(),
                            "receiverId", String.valueOf(receiverId)));
        }
    }

    @Override
    public Shipment getByEmployeeId(int employeeId) {
        try (Session session = sessionFactory.openSession()) {
            return session
                    .createQuery(" from Shipment where employee.id = :employeeId ", Shipment.class)
                    .setParameter("employeeId", employeeId)
                    .uniqueResultOptional()
                    .orElseThrow(() -> new EntityNotFoundException(Shipment.class.getSimpleName(),
                            "employeeId", String.valueOf(employeeId)));
        }
    }

    @Override
    public List<Shipment> getNotDelivered(int companyId) {
        try (Session session = sessionFactory.openSession()) {
            return session
                    .createQuery(" from Shipment shipment where company.id = :companyId " +
                                             "  and receivedDate is null  "
                            , Shipment.class)
                    .setParameter("companyId", companyId).getResultList()


                    ;
        }
    }

}
