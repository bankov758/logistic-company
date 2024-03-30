"use client";

import React, {Fragment, useState} from "react";
import {useFormState} from "react-dom";
import {Session} from "@/lib/auth";
import {
    deleteCourier,
    deleteEmployee,
    deleteOffice,
    deleteUser,
    demoteCourier,
    demoteEmployee, makeCourier, promoteCourier,
    promoteUser
} from "@/lib/adminActions";

import BaseDialog from "@/components/UI/BaseDialog";
import EditShipmentForm from "@/components/home/EmployeeInterface/EditShipmentForm";
import EditOfficeForm from "@/components/home/AdminInterface/EditOfficeForm";
import EmployeeInterfaceActionsButtons from "@/components/home/EmployeeInterface/EmployeeInterfaceActionsButtons";
import AdminInterfaceUserActionsButtons from "@/components/home/AdminInterface/AdminInterfaceUserActionButtons";
import AdminInterfaceEmployeeActionsButtons from "@/components/home/AdminInterface/AdminInterfaceEmployeeActionButtons";
import AdminInterfaceOfficeActionButtons from "@/components/home/AdminInterface/AdminInterfaceOfficeActionButtons";
import AdminInterfaceCourierActionsButtons from "@/components/home/AdminInterface/AdminInterfaceCourierActionButtons";
import {deleteShipment} from "@/lib/actions";

export type column = {
    title: string;
    code: string;
    hide?: boolean;
    id: number;
}

export type category = {
    title: string;
    code: string;
    id: number
}

export type item = Record<string, any> & {
    id: number;
    category: string;
};

export type ActionType = "demoteEmployee" | "promoteUser" | "deleteUser" | "deleteEmployee" | "deleteOffice" | "editShipment" | "editOffice" | "addRole" | "deleteShipment" | "deleteCourier" | "demoteCourier" | "makeOfficeEmployee" | "makeCourier";

type TableProps = {
    columns: column[];
    categories: category[];
    data: item[];
    session: Session | null;
    onEditOfficeSuccess: () => void;
};

const Table: React.FC<TableProps> = ({
    columns,
    categories,
    data,
    session,
    onEditOfficeSuccess
}) => {
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<item | null>(null);

    const [editShipment, setEditShipment] = useState<boolean>(false);
    const [editOffice, setEditOffice] = useState<boolean>(false);

    // user actions
    const [deleteUserState, deleteUserAction] = useFormState(deleteUser, { message: '', errors: '' });
    const [promoteUserState, promoteUserAction] = useFormState(promoteUser, { message: '', errors: '' });

    // employee actions
    const [deleteEmployeeState, deleteEmployeeAction] = useFormState(deleteEmployee, { message: '', errors: '' });
    const [demoteEmployeeState, demoteEmployeeAction] = useFormState(demoteEmployee, { message: '', errors: '' });
    const [makeCourierState, makeCourierAction] = useFormState(makeCourier, { message: '', errors: '' });

    // shipment actions
    const [deleteShipmentState, deleteShipmentAction] = useFormState(deleteShipment, { message: '', errors: '' });

    // office actions
    const [deleteOfficeState, deleteOfficeAction] = useFormState(deleteOffice, { message: '', errors: '' });

    // courier actions
    const [deleteCourierState, deleteCourierAction] = useFormState(deleteCourier, { message: '', errors: '' });
    const [demoteCourierState, demoteCourierAction] = useFormState(demoteCourier, { message: '', errors: '' });
    const [promoteCourierState, promoteCourierAction] = useFormState(promoteCourier, { message: '', errors: '' });


    const handleAction = async (item: item, type: ActionType | null) => {
        switch (type) {
            case "deleteUser": deleteUserAction(item.id); break;
            case "promoteUser": promoteUserAction(item.id); break;

            case "deleteEmployee": deleteEmployeeAction(item.id); break;
            case "demoteEmployee": demoteEmployeeAction(item.id); break;
            case "makeCourier": makeCourierAction(item.id); break;

            case "deleteShipment": deleteShipmentAction(item.id); break; // employee interface
            case "editShipment": // employee interface
                setEditShipment(true);
                setSelectedItem(item);
                setShowDialog(true);
                break;

            case 'deleteCourier': deleteCourierAction(item.id); break;
            case 'demoteCourier': demoteCourierAction(item.id); break;
            case "makeOfficeEmployee": promoteCourierAction(item.id); break;

            case "deleteOffice": deleteOfficeAction(item.id); break;
            case "editOffice":
                setEditOffice(true);
                setSelectedItem(item);
                setShowDialog(true);
                break;

            default: break;
        }
    };

    return (
        <div className="px-8 py-2 min-w-full">
            <table className="min-w-full">
                {showDialog && selectedItem && session &&
                    <BaseDialog
                        title="Edit item"
                        tryClose={() => {
                            setShowDialog(false);
                            setEditShipment(false);
                            setEditOffice(false);
                        }}
                    >
                        {editShipment &&
                            <EditShipmentForm selectedItem={selectedItem} employeeId={session.id}/>
                        }
                        {editOffice &&
                            <EditOfficeForm selectedItem={selectedItem} onEditOfficeSuccess={onEditOfficeSuccess}/>
                        }
                    </BaseDialog>
                }
                <thead className='bg-white'>
                <tr className='text-sm font-semibold text-black'>
                    {columns.map((column: column) => {

                        if (column.hide) {
                            return (
                                <th key={column.id} className="text-left px-4 py-3 relative">
                                    <span className='accessibility'>{column.title}</span>
                                </th>
                            );
                        }

                        return (
                            <th key={column.id} className="text-left px-4 py-3" scope='col'>
                                {column.title}
                            </th>
                        )
                    })}
                </tr>
                </thead>
                <tbody className="bg-white">
                {categories.map((category: category) => {
                    return (
                        <Fragment key={category.id}>
                            <tr className="border-t text-sm font-semibold text-black">
                                <th
                                    className="bg-[#FAF9FB] px-4 py-3 text-left"
                                    colSpan={columns.length}
                                    scope="colgroup"
                                >
                                    {category.title}
                                </th>
                            </tr>
                            {
                                data
                                    .filter((item: item) => item.category === category.code)
                                    .map((rowItem: item, index: number) => {
                                        return (
                                            <tr key={index} className="border-t text-sm font-semibold text-black">

                                                {columns.map((column: column) => {

                                                    if (column.hide) {

                                                        if (column.code === 'employeeInterfaceActions') {

                                                            return (
                                                                <EmployeeInterfaceActionsButtons
                                                                    key={column.id}
                                                                    onClick={(actionType) => handleAction(rowItem, actionType)}
                                                                />
                                                            )

                                                        }
                                                        if (column.code === 'adminInterfaceActions') {
                                                            if (category.code === 'clients') {
                                                                return (
                                                                    <AdminInterfaceUserActionsButtons
                                                                        key={column.id}
                                                                        onClick={(actionType) => handleAction(rowItem, actionType)}
                                                                    />
                                                                )
                                                            } else if (category.code === "employees") {
                                                                return (
                                                                    <AdminInterfaceEmployeeActionsButtons
                                                                        key={column.id}
                                                                        onClick={(actionType) => handleAction(rowItem, actionType)}                                                                    />
                                                                )
                                                            } else if (category.code === "couriers") {
                                                                return (
                                                                    <AdminInterfaceCourierActionsButtons
                                                                        key={column.id}
                                                                        onClick={(actionType) => handleAction(rowItem, actionType)}                                                                    />
                                                                )
                                                            } else if (category.code === "offices") {
                                                               return (
                                                                   <AdminInterfaceOfficeActionButtons
                                                                       key={column.id}
                                                                       onClick={(actionType) => handleAction(rowItem, actionType)}
                                                                   />
                                                               )
                                                            }
                                                        }
                                                    }

                                                    if (column.code === 'status') {

                                                        return (
                                                            <td key={column.id} className='px-4 py-3'>
                                                                <button
                                                                    className={
                                                                        rowItem.status === 'Active' ?
                                                                            "action_btn_green" :
                                                                        rowItem.status === "Closed" ?
                                                                            "action_btn_purple" :
                                                                            ""
                                                                    }
                                                                >
                                                                    {rowItem[column.code]}
                                                                </button>
                                                            </td>
                                                        )
                                                    }

                                                    return (
                                                        <td key={column.id} className='px-4 py-3 text-gray-500'>
                                                            {rowItem[column.code]}
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })
                            }
                        </Fragment>
                    )
                })}
                </tbody>
            </table>
        </div>
    );
};

export default Table;