import React, { Ref } from "react";

export const InputText = React.forwardRef(function InputText(props: React.HTMLProps<HTMLInputElement>, ref: Ref<HTMLInputElement>) {
    return (
        <input
            className='mt-1 px-2 py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            ref={ref} {...props}>
        </input>
    );
});