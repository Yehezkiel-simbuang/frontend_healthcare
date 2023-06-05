import React, { useState } from "react";
import { contractAddresses, abi } from "../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useNotification } from "web3uikit";
import { saveAs } from "file-saver";

export default function Download() {
    const [Downloading, setDownloading] = useState(false);
    const [HashFile, setHashFile] = useState("");
    const { chainId: chainIdHex } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const healthcareAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const dispatch = useNotification();
    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Verify Complete",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        });
    };
    const {
        runContractFunction: verifyHash,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: healthcareAddress,
        functionName: "verifyHash",
        params: { fileHash: { HashFile } },
    });

    const handleSuccess = async (tx) => {
        try {
            handleNewNotification(tx);
        } catch (error) {
            console.log(error);
        }
    };
    const retrieve = async (event) => {
        event.preventDefault();
        setDownloading(true);
        const verify = await verifyHash({
            onSuccess: handleSuccess,
            onError: (error) => console.log(error),
        });

        if (verify) {
            const responseUrl = `https://${HashFile}.ipfs.dweb.link/`;
            saveAs(responseUrl);
        } else {
            console.log("File not found or Wrong signer!");
        }
        setDownloading(false);
    };

    return (
        <div className="max-w-lg mr-7 my-8 p-6 bg-white shadow-lg rounded-lg">
            {healthcareAddress ? (
                <form>
                    <div>
                        <label
                            for="small-input"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            File Hash
                        </label>
                        <input
                            type="text"
                            id="HashFile"
                            onChange={(e) => setHashFile(e.target.value)}
                            class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={retrieve}
                        disabled={Downloading || HashFile === ""}
                    >
                        {Downloading ? "Downloading...." : "Download"}
                    </button>
                </form>
            ) : (
                <div>Please connect to a supported chain </div>
            )}
        </div>
    );
}
