import React, { useState } from "react";
import { Web3Storage } from "web3.storage";
import { contractAddresses, abi } from "../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useNotification } from "web3uikit";
import { NextConfig } from "next";
import nextConfig from "../next.config";

export default function Upload() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [HashFile, setHashFile] = useState("");
    const { chainId: chainIdHex } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const healthcareAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const dispatch = useNotification();
    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction complete",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        });
    };
    const {
        runContractFunction: storeHash,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: healthcareAddress,
        functionName: "storeHash",
        params: { fileHash: { HashFile } },
    });

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1);
            handleNewNotification(tx);
        } catch (error) {
            console.log(error);
        }
    };
    const handleChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            return;
        }

        setUploading(true);
        const client = new Web3Storage({
            token: nextConfig.env.NEXT_PUBLIC_WEB3_TOKEN,
        });
        const cid = await client.put([file], { wrapWithDirectory: false });
        setHashFile(cid);

        await storeHash({
            onSuccess: handleSuccess,
            onError: (error) => console.log(error),
        });

        setUploading(false);
    };

    return (
        <div className="max-w-lg my-px my-8 p-6 bg-white shadow-lg rounded-lg">
            {healthcareAddress ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label
                            className="text-gray-700 font-bold mb-2"
                            htmlFor="file"
                        >
                            Choose a file to upload
                        </label>
                        <div className="relative border-dashed border-2 border-gray-400 rounded-lg h-64 flex justify-center items-center">
                            <div className="absolute">
                                <div className="flex flex-col items-center">
                                    <svg
                                        className="w-10 h-10 text-gray-400 group-hover:text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 19l-7-7 7-7"
                                        ></path>
                                    </svg>
                                    <span className="text-gray-400 group-hover:text-gray-600 mt-2">
                                        {file ? file.name : "Select a file"}
                                    </span>
                                </div>
                            </div>
                            <input
                                type="file"
                                className="h-full w-full opacity-0"
                                id="file"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={!file || uploading || isLoading || isFetching}
                    >
                        {isLoading || isFetching || uploading
                            ? "Uploading....."
                            : "Upload"}
                    </button>
                    <div>Hash file: {HashFile}</div>
                </form>
            ) : (
                <div>Please connect to a supported chain </div>
            )}
        </div>
    );
}
