import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import Upload from "../components/Upload";
import { useMoralis } from "react-moralis";
import Download from "../components/Download";

const supportedChains = ["31337", "11155111"];

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis();

    return (
        <div className={styles.container}>
            <Head>
                <title>Healthcare app</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            {isWeb3Enabled ? (
                <div>
                    {supportedChains.includes(parseInt(chainId).toString()) ? (
                        <div className="flex flex-row">
                            <Upload className="p-8" />
                            <Download className="p-8" />
                        </div>
                    ) : (
                        <div>{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
                    )}
                </div>
            ) : (
                <div>Please connect to a Wallet</div>
            )}
        </div>
    );
}
