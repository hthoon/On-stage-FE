import React, {useState} from "react";
import "./Management.css";

const DetailManagement = ({link}) => {



    return (

        <div className="link-details">
            <p>{link.title}</p>
        </div>
    );
};
export default DetailManagement;