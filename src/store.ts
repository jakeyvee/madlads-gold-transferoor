import { Connection, clusterApiUrl } from '@solana/web3.js';
import { create } from 'zustand';
import { defaultEnvRpcUrl } from './utils';

type RpcState = {
    rpcConnection: Connection;
    setCustomRpcUrl: (value: string) => void;
    setDefaultRpcUrl: () => void;
};
export const useRpcStore = create<RpcState>((set) => ({
    rpcConnection: new Connection(defaultEnvRpcUrl),
    setCustomRpcUrl: (newRpcUrl) => set({ rpcConnection: new Connection(newRpcUrl) }),
    setDefaultRpcUrl: () => set({ rpcConnection: new Connection(defaultEnvRpcUrl) }),
}));
