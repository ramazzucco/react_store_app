import React, { useEffect } from "react";
import ToastStore, { dataToast$ } from "./store/toast.store";

import './toast.css';

export default function Toast() {
    const [data, setData] = React.useState(null);
    const [show, setShow] = React.useState('');
    const toastStore = ToastStore();

    useEffect(() => {
        dataToast$.subscribe((data) => {
            setData(data);
            if(data && data.time) {
                setShow('show');
                setTimeout(() => {
                    setShow('');
                }, 5000)
            }
        });
    }, []);

    const handleClose = () => {
        setShow('');
        if(!data.time) {
            setTimeout(() => {
                toastStore.set(null);
            }, 300)
        }
    }
    return (
        <div className={`wrapper_toast ${show} ${data && data.state}`}>
            <div className="icon">
                <span className="material-symbols-outlined">{ data && data.icon ? data.icon : '' }</span>
            </div>
            <div className="info">
                { data && data.title && <h6 className="title">{ data.title }</h6>}
                <p className="message">{ data && data.message ? data.message : '' }</p>
            </div>
            <div className="buttons">
                <span className="material-symbols-outlined close" onClick={handleClose}>close</span>
            </div>
        </div>
    );
}
