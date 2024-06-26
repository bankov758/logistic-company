import React, {useEffect, useState} from "react";
import {getSession, Session} from "@/lib/auth";
import {useFormState} from "react-dom";

import {createAnOrder, getCouriers, getUsers} from "@/lib/actions";
import {getCompanyId} from "@/lib/actions";

import DataSelectorWrapper, {selectorItem} from "@/components/UI/DataSelectorWrapper";
import SubmitButton from "@/components/UI/SubmitButton";

import { AxiosError } from "axios";

const CreateAnOrderForm: React.FC<{ employeeId: number; onActionSuccess: (data: {  message: string; errors: string; }) => void }> = ({ employeeId, onActionSuccess }) => {

    const [error, setError] = useState<Error | null | string>(null);

    const [users, setUsers] = useState<selectorItem[]>([]);
    const [couriers, setCouriers] = useState<selectorItem[]>([]);

    const [selectedSender, setSelectedSender] = useState<selectorItem | null>(null);
    const [selectedReceiver, setSelectedReceiver] = useState<selectorItem | null>(null);
    const [selectedCourier, setSelectedCourier] = useState<selectorItem | null> (null);

    const [createAnOrderState, createAnOrderAction] = useFormState(createAnOrder.bind(null,
            employeeId,
            selectedSender?.id,
            selectedReceiver?.id,
            selectedCourier?.id),
        {message: '', errors: ''}
    );

    useEffect(() => {

        if( createAnOrderState.message) onActionSuccess(createAnOrderState)

    }, [createAnOrderState]);

    useEffect(() => {

        const fetchDropdownData = async () => {
            try {
                const users = await getUsers();

                const companyId = await getCompanyId();
                const couriers = await getCouriers(companyId);

                if( users ) {
                    setUsers(users);
                }
                if ( couriers ) {
                    setCouriers(couriers);
                }

                //TODO: fix and compare by companyName
                // if( couriers ) {
                //     const courierCompanyIds = couriers
                //         .filter((courier: any) => courier.companyName === companyId)
                //
                //     setCouriers(courierCompanyIds);
                // }

            } catch (err) {
                if( err instanceof AxiosError ) {
                    setError(err)
                }
            }
        }

        fetchDropdownData();
    }, []);


    function handleSelect(data:selectorItem, targetState:string) {
        switch (targetState) {
            case 'sender' : setSelectedSender(data); break;
            case 'receiver' : setSelectedReceiver(data); break;
            case 'courier' :  setSelectedCourier(data); break;
            default: break;
        }
    }

    return (
        <>
            <h3 className="flex justify-center">Create a new order:</h3>
            <br/>
            <form action={createAnOrderAction}>
                <div className="order-div">
                    <label className="block text-gray-500">Sender:</label>
                    { users &&
                        <DataSelectorWrapper
                            hasInitialPlaceholderValue
                            placeholderValue={selectedSender && Object.keys(selectedSender).length > 0 ? selectedSender.title : "Select user"}
                            selectorData={users}
                            onResubForNewData={(data) => handleSelect(data, 'sender')}
                        />
                    }
                </div>
                <div className="order-div">
                    <label className="block text-gray-500">Receiver:</label>
                    { users &&
                        <DataSelectorWrapper
                            hasInitialPlaceholderValue
                            placeholderValue={selectedReceiver && Object.keys(selectedReceiver).length > 0 ? selectedReceiver.title : "Select user"}
                            selectorData={users}
                            onResubForNewData={(data) => handleSelect(data, 'receiver')}
                        />
                    }
                </div>
                <div className="order-div">
                    <label htmlFor="departure_place" className="block  text-gray-500">Departure location:</label>
                    <input type="text" id="departure_place" name="departureAddress" className="input-info-dialog"
                           placeholder="Sofia "></input><br/>
                </div>
                <div className="order-div">
                    <label htmlFor="arrival_location" className="block  text-gray-500">Arrival location:</label>
                    <input type="text" id="arrival_location" name="arrivalAddress" className="input-info-dialog"
                           placeholder="Varna "></input><br/>
                </div>
                <div className="order-div">
                    <label htmlFor="weight" className="block  text-gray-500">Weight (in kg.):</label>
                    <input type="text" id="weight" name="weight" className="input-info-dialog"
                           placeholder="40 "></input><br/>
                </div>
                <div className="order-div">
                    <label htmlFor="date" className="block text-gray-500">Date:</label>
                    <input type="date" id="date" name="sentDate"
                           className="block text-gray-500 rounded-xl border-2 py-1.5  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6 whitespace-pre-line"
                           placeholder="DD:MM:YYYY"></input><br/>
                </div>
                <div className="order-div">
                    <label className="block  text-gray-500">Courier:</label>
                    { couriers &&
                        <DataSelectorWrapper
                            hasInitialPlaceholderValue
                            placeholderValue={selectedCourier && Object.keys(selectedCourier).length > 0 ? selectedCourier.title : "Select courier"}
                            selectorData={couriers}
                            onResubForNewData={(data) => handleSelect(data, 'courier')}
                        />
                    }
                </div>
                <div className='flex justify-center py-3 text-gray-500'>
                    <SubmitButton formState={createAnOrderState}/>
                </div>
            </form>
        </>
    )
};

export default CreateAnOrderForm;