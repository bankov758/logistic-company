"use client";
import React, {Fragment, useEffect, useState} from "react";
import { categories, tableColumns } from "@/data/employee/ordersTableData";
import {getSession, Session} from "@/lib/auth";
import axios from "@/lib/axios";

import FilterOrders, {FilterOptions} from "./FilterOrders";
import Table, { item } from "../Table";
import Button from "../../UI/BaseButton";
import BaseDialog from "../../UI/BaseDialog";
import Notification from "@/components/UI/Notification";
import CreateAnOrderForm from "@/components/home/EmployeeInterface/CreateAnOrderForm";
import SelfDeleteUserForm from "@/components/home/ClientInterface/SelfDeleteUserForm";
import useHttp from "@/hooks/useHttp";
import SkeletonLoadingAnimation from "@/components/UI/SkeletonLoadingAnimation";

const EmployeeInterface: React.FC = () => {
    const [showCreateOrderDialog, setShowCreateOrderDialog] = useState<boolean>(false)
    
    const [session, setSession] = useState<null | Session>(null);

    const [data, setData] = useState<item[] | null>(null);
    const [unfilteredData, setUnfilteredData] = useState<item[] | null>(null);

    const [tryAgain, setTryAgain] = useState<boolean>(false);

    const [showSelfDeleteDialog, setShowSelfDeleteDialog] = useState<boolean>(false);

    const {
        isLoading,
        error,
        sendRequest
    } = useHttp();

    useEffect(() => {
        getSession()
            .then(async (response) => {
                setSession(response)

                const responseData = await sendRequest({
                    url: "/shipments/logged-company"
                });

                if( responseData && responseData.data ) {
                    setData(responseData.data);
                    setUnfilteredData(responseData.data);
                };

            })
    }, [sendRequest, tryAgain]);

    const onFilterOrders = (filterOptions: FilterOptions) => {
        setData(prevState => {

            if( unfilteredData ) {

                return unfilteredData.filter((item) => {
                    if( filterOptions.clientName && !filterOptions.employeeName && !filterOptions.orderType ) {
                        return item.sender === filterOptions.clientName;

                    } else if( filterOptions.clientName && filterOptions.employeeName && !filterOptions.orderType ) {
                        return item.sender === filterOptions.clientName && item.employee === filterOptions.employeeName;

                    } else if( !filterOptions.clientName && filterOptions.employeeName && !filterOptions.orderType ) {
                        return item.employee === filterOptions.employeeName;

                    } else if( filterOptions.clientName && !filterOptions.employeeName && filterOptions.orderType ) {
                        return item.sender === filterOptions.clientName && item.status === filterOptions.orderType.title;

                    } else if( filterOptions.clientName && filterOptions.employeeName && filterOptions.orderType ) {
                        return item.sender === filterOptions.clientName && item.employee === filterOptions.employeeName && item.status === filterOptions.orderType.title;

                    } else if( !filterOptions.clientName && filterOptions.employeeName && filterOptions.orderType ) {
                        return item.employee === filterOptions.employeeName && item.status === filterOptions.orderType.title;

                    } else if( !filterOptions.clientName && !filterOptions.employeeName && filterOptions.orderType ) {
                        return item.status === filterOptions.orderType.title;
                    }
                })
            }

            prevState = unfilteredData;
            return prevState;
        });
    }

    return (
        <>
            {showCreateOrderDialog && session &&
                <BaseDialog title="NEW ORDER" tryClose={() => setShowCreateOrderDialog(false)}>
                    <CreateAnOrderForm employeeId={session.id}/>
                </BaseDialog>
            }
            {error ?
                <Notification status='error'>
                    <div className='flex flex-col justify-center items-center w-full'>
                        <p>{error?.message}</p>
                        <button className='base-btn-blue' onClick={() => setTryAgain(!tryAgain)}>Try again</button>
                    </div>
                </Notification> :
                isLoading ?
                    <SkeletonLoadingAnimation header="tabs" layoutItems={5}/> :
                    <Fragment>
                        <div className='flex justify-start items-center gap-x-4'>
                            <h3>Welcome, {session?.username || "user"}! You&apos;re logged in as employee.</h3>
                            <br/>
                            <Button fill onClick={() => setShowCreateOrderDialog(true)}>Create an order</Button>
                        </div>
                        <FilterOrders onFilterOrders={onFilterOrders}/>
                        {data ?
                                <Table
                                    columns={tableColumns}
                                    categories={categories}
                                    session={session}
                                    data={data.map((item) => ({
                                        ...item,
                                        category: "registered"
                                    }))}
                                /> :
                            <p>No Data available!</p>
                         }
                    </Fragment>
            }
            {showSelfDeleteDialog &&
                (<BaseDialog title="Self deletion" tryClose={() => setShowSelfDeleteDialog(false)}>
                    <SelfDeleteUserForm
                        session={session}
                        onClick={(setAction) => {setShowSelfDeleteDialog(setAction)}}
                    />
                </BaseDialog>)
            }
            <div className="p-4 bottom-0 right-0 flex justify-center items-center z-50">
                <h3 className="mr-2">Delete your account here: </h3>
                <Button className="bg-red-600 text-white font-bold py-2 px-4" fill={true}
                        onClick={() => setShowSelfDeleteDialog(true)}>Delete User</Button>
            </div>
        </>
    )
};

export default EmployeeInterface;