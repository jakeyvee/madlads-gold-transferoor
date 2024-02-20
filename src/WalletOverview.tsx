import React from 'react';
import { PublicKey } from '@solana/web3.js';

interface OverviewInterface {
    walletPubKey: PublicKey | undefined;
    stakedLads: number;
    totalLads: number;
}

const WalletOverview = ({ walletPubKey, stakedLads, totalLads }: OverviewInterface) => {
    return (
        <div className="shadow-lg bg-slate-800 rounded-lg mb-8 px-4 py-3 flex flex-col lg:px-10 lg:flex-row lg:space-x-8 w-full">
            <div className="w-full lg:w-8/12">
                <div className="stat bg-transparent text-white py-2">
                    <div className="text-sm ">Address</div>
                    <div className="stat-value text-2xl truncate font-medium">{walletPubKey?.toBase58()}</div>
                </div>
            </div>
            <div className="w-full lg:w-2/12">
                <div className="stat bg-transparent text-white py-2">
                    <div className="stat-title text-sm">Staked Madlads</div>
                    <div className="stat-value text-2xl truncate font-medium">{stakedLads}</div>
                </div>
            </div>
            <div className="w-full lg:w-2/12">
                <div className="stat bg-transparent text-white py-2">
                    <div className="stat-title text-sm">Total Madlads</div>
                    <div className="stat-value text-2xl truncate font-medium">{totalLads}</div>
                </div>
            </div>
            <div className=" ml-auto"></div>
        </div>
    );
};

export default WalletOverview;
