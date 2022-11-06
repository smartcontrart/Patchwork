import React, { useContext } from "react";
import { AccountInfoContext } from "../Context/AccountInfo";

function ConnexionStatus() {
    let accountInfo = useContext(AccountInfoContext)
        return(
            <React.Fragment>
            <span id='connexion_info'>Contract address <b><a className="etherscan_link" href={"https://etherscan.io/address/"+process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS}>{process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS}</a></b></span>
            </React.Fragment>
        )
}

export default ConnexionStatus;