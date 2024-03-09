"use client";
import React, { useEffect, useState } from "react";
import { categories, tableColumns } from "@/data/employee/ordersTableData";
import {getSession, Session} from "@/lib/auth";

import FilterOrders from "./FilterOrders";
import Table, { item } from "../Table";
import Button from "../../UI/BaseButton";
import BaseDialog from "../../UI/BaseDialog";
import Notification from "@/components/UI/Notification";
import CreateAnOrderForm from "@/components/home/EmployeeInterface/CreateAnOrderForm";

const EmployeeInterface: React.FC = () => {
    const [showCreateOrderDialog, setShowCreateOrderDialog] = useState<boolean>(false)
    
    const [session, setSession] = useState<null | Session>(null);
    const [data, setData] = useState<item[] | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [tryAgain, setTryAgain] = useState<boolean>(false);

    useEffect(() => {
        getSession()
            .then((response) => {
                setSession(response)
                setError(null);

                fetch("http://localhost:8080/api/shipments", {
                    headers: {
                        "Authorization": response?.username || "",
                        "Content-Type": "application/json",
                        Accept: "*/*"
                    }
                })
                .then(response => response.json())
                .then(data => setData(data))
                .catch(error => setError(error));
            })
    }, []);

    return (
        <>
            {error &&
                <Notification status='error'>
                    <div className='flex flex-col justify-center items-center w-full'>
                        <p>{error?.message}</p>
                        <button className='base-btn-blue' onClick={() => setTryAgain(!tryAgain)}>Try again</button>
                    </div>
                </Notification>
            }
            <h3>Welcome, {session?.username || "user"}! You&apos;re logged in as employee.</h3>
            <div className="flex gap-x-4">
                <Button fill onClick={() => setShowCreateOrderDialog(true)}>Create an order</Button>
            </div>
            {showCreateOrderDialog &&
                (<BaseDialog title="New order" tryClose={() => setShowCreateOrderDialog(false)}>
                    <CreateAnOrderForm />
                </BaseDialog>)
            }
            {/*TODO: Filter logic assigned to Antoan */}
            <FilterOrders />
            {data &&
                <Table
                    columns={tableColumns}
                    categories={categories}
                    session={session}
                    data={data.map((item) => {
                           return {
                               ...item,
                               category: "registered"
                           }
                    })}
                />
            }
        </>
    )
};

export default EmployeeInterface;