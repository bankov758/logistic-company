package com.nbu.logisticcompany.entities.dtos.shipment;

import java.time.LocalDateTime;

public class ShipmentOutDto {

    private int id;
    private String departureAddress;
    private String arrivalAddress;
    private String sender;
    private String receiver;
    private String employee;
    private boolean isSentFromOffice;
    private boolean isReceivedFromOffice;
    private double price;
    private double weight;
    private LocalDateTime sentDate;
    private LocalDateTime receivedDate;
    private String courier;

    public ShipmentOutDto() {
    }

    public ShipmentOutDto(int id, String departureAddress, String arrivalAddress, String sender, String receiver,
                          String employee, boolean isSentFromOffice, boolean isReceivedFromOffice, double price,
                          double weight, LocalDateTime sentDate, LocalDateTime receivedDate, String courier) {
        this.id = id;
        this.departureAddress = departureAddress;
        this.arrivalAddress = arrivalAddress;
        this.sender = sender;
        this.receiver = receiver;
        this.employee = employee;
        this.isSentFromOffice = isSentFromOffice;
        this.isReceivedFromOffice = isReceivedFromOffice;
        this.price = price;
        this.weight = weight;
        this.sentDate = sentDate;
        this.receivedDate = receivedDate;
        this.courier = courier;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDepartureAddress() {
        return departureAddress;
    }

    public void setDepartureAddress(String departureAddress) {
        this.departureAddress = departureAddress;
    }

    public String getArrivalAddress() {
        return arrivalAddress;
    }

    public void setArrivalAddress(String arrivalAddress) {
        this.arrivalAddress = arrivalAddress;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getEmployee() {
        return employee;
    }

    public void setEmployee(String employee) {
        this.employee = employee;
    }

    public boolean isSentFromOffice() {
        return isSentFromOffice;
    }

    public void setSentFromOffice(boolean sentFromOffice) {
        isSentFromOffice = sentFromOffice;
    }

    public boolean isReceivedFromOffice() {
        return isReceivedFromOffice;
    }

    public void setReceivedFromOffice(boolean receivedFromOffice) {
        isReceivedFromOffice = receivedFromOffice;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public LocalDateTime getSentDate() {
        return sentDate;
    }

    public void setSentDate(LocalDateTime sentDate) {
        this.sentDate = sentDate;
    }

    public LocalDateTime getReceivedDate() {
        return receivedDate;
    }

    public void setReceivedDate(LocalDateTime receivedDate) {
        this.receivedDate = receivedDate;
    }

    public String getCourier() {
        return courier;
    }

    public void setCourier(String courier) {
        this.courier = courier;
    }
}
