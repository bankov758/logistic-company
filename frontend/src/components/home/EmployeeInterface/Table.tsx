import React, { Fragment } from "react";

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

export type item = Record<string, string | number> & {
    id: number;
    category: string;
};

type TableProps = {
    columns: column[];
    categories: category[];
    data: item[];
}

const Table: React.FC<TableProps> = ({
    columns,
    categories,
    data
}) => {

    return (
        <div className="px-8 py-2 min-w-full">
            <table className="min-w-full">
                <thead className='bg-white'>
                    <tr className='text-sm font-semibold text-black'>
                        { columns.map((column: column) => {

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

                                                        if ( column.hide ) {

                                                            if( column.code === 'actions' ) {

                                                                return (
                                                                    <td key={column.id} className='flex gap-x-2 justify-center items-center px-4 py-3 text-gray-500'>
                                                                        <button 
                                                                            className="action_btn_red"
                                                                        >
                                                                            Delete
                                                                        </button>

                                                                        <button 
                                                                            className="action_btn_blue"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                    </td>
                                                                )
                                                            }
                                                            if( column.code === 'actionTable' && category.code === 'clients' ) {

                                                                return (
                                                                    <td key={column.id} className='flex gap-x-2 justify-center items-center px-4 py-3 text-gray-500'>
                                                                        <button 
                                                                            className="action_btn_red"
                                                                        >
                                                                            Delete
                                                                        </button>

                                                                        <button 
                                                                            className="action_btn_green"
                                                                        >
                                                                            Promote
                                                                        </button>
                                                                    </td>
                                                                )
                                                            }
                                                            if( column.code === 'actionTable' && category.code === 'employees' ) {

                                                                return (
                                                                    <td key={column.id} className='flex gap-x-2 justify-center items-center px-4 py-3 text-gray-500'>
                                                                        <button 
                                                                            className="action_btn_red"
                                                                        >
                                                                            Delete
                                                                        </button>

                                                                        <button 
                                                                            className="action_btn_blue"
                                                                        >
                                                                            Demote
                                                                        </button>
                                                                    </td>
                                                                )
                                                            }
                                                            if( column.code === 'actionOffice' ) {

                                                                return (
                                                                    <td key={column.id} className='flex gap-x-2 justify-center items-center px-4 py-3 text-gray-500'>
                                                                        <button 
                                                                            className="action_btn_red"
                                                                        >
                                                                            Delete
                                                                        </button>

                                                                        <button 
                                                                            className="action_btn_blue"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        
                                                                       
                                                                    </td>
                                                                )
                                                            }
                                                        }

                                                        if( column.code === 'status' ) {
                                                            return (
                                                                <td key={column.id} className='px-4 py-3'>
                                                                    <button 
                                                                        className="action_btn_green"
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