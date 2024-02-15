package com.nbu.logisticcompany.entities.dtos;

import com.nbu.logisticcompany.entities.Company;

public class TariffUpdateDto {

    private int id;
    private float pricePerKG;

    private float officeDiscount;

    private Company companyID;

    public TariffUpdateDto() {
    }

    public TariffUpdateDto(int id, float pricePerKG, float officeDiscount, Company companyID) {
        this.id = id;
        this.pricePerKG = pricePerKG;
        this.officeDiscount = officeDiscount;
        this.companyID = companyID;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public float getPricePerKG() {
        return pricePerKG;
    }

    public void setPricePerKG(float pricePerKG) {
        this.pricePerKG = pricePerKG;
    }

    public float getOfficeDiscount() {
        return officeDiscount;
    }

    public void setOfficeDiscount(float officeDiscount) {
        this.officeDiscount = officeDiscount;
    }

    public Company getCompanyID() {
        return companyID;
    }

    public void setCompanyID(Company companyID) {
        this.companyID = companyID;
    }
}
