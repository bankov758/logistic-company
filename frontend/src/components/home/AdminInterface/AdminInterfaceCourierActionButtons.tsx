import React from "react";
import exp from "node:constants";
import {ActionType} from "@/components/home/Table";

const AdminInterfaceCourierActionsButtons: React.FC<{ onClick: (actionType: ActionType | null)=> void; }> = ({ onClick }) => {
    return (
        <td className='flex gap-x-2 justify-center items-center px-4 py-3 text-gray-500'>
            <button
                className="action_btn_red"
                onClick={() => onClick("deleteCourier")}

            >
                Delete
            </button>
            <button
                className="action_btn_blue"
                onClick={() => onClick("demoteCourier")}

            >
                Demote
            </button>
            <button
                className="action_btn_green"
                onClick={() => onClick("makeCourierIntoEmployee")}

            >
                Make office employee
            </button>
        </td>
    )
}
export default AdminInterfaceCourierActionsButtons;
