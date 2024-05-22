import { useWallet, Wallet } from '@manahippo/aptos-wallet-adapter';
import Image from 'next/image';
import { useContext } from 'react';
import { ModalContext } from './ModalContext';

export function WalletModal() {
  const { wallets, connect, account, disconnect } = useWallet();
  const { modalState, setModalState } = useContext(ModalContext);

  async function connectWallet(wallet: Wallet) {
    connect(wallet.adapter.name);
    setModalState({ ...modalState, walletModal: false });
  }

  function disconnectWallet() {
    disconnect();
    setModalState({ ...modalState, walletModal: false });
    location.reload();
  }

  function modalBox(content: JSX.Element) {
    return (
      <>
        <label
          htmlFor="wallet-modal"
          className={modalState.walletModal ? 'modal modal-open cursor-point' : 'modal cursor-pointer'}>
          <div className="modal-box">
            <label
              className="absolute btn btn-sm btn-circle right-2 top-2"
              onClick={() => setModalState({ ...modalState, walletModal: false })}>
              ✕
            </label>
            <div className="flex flex-col mt-6">{content}</div>
          </div>
        </label>
      </>
    );
  }

  return account?.address
    ? modalBox(
        <>
          <p
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              display: 'inline',
            }}>
            Account: {account!.address!.toString()}
          </p>
          <button className="mt-5 btn" onClick={disconnectWallet}>
            Disconnect
          </button>
        </>
      )
    : modalBox(
        <>
          {wallets.map((wallet: Wallet, i) => {
            return (
              <button
                key={i}
                className={i == wallets.length - 1 ? 'btn gap-2' : 'btn gap-2 mb-5'}
                onClick={() => connectWallet(wallet)}>
                <Image width={25} height={25} src={wallet.adapter.icon} alt='wallet-logo' />
                {wallet.adapter.name}
              </button>
            );
          })}
        </>
      );
}
