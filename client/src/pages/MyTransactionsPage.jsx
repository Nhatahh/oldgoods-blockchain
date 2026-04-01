import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";
import { useWallet } from "../context/WalletContext";
import EmptyState from "../components/EmptyState";
import { TxSkeleton } from "../components/LoadingSkeleton";
import CopyButton from "../components/CopyButton";
import ExplorerLink from "../components/ExplorerLink";

const NATIVE_SYMBOL = import.meta.env.VITE_NATIVE_SYMBOL || "VLDM";

function shortHash(v) {
  if (!v) return "";
  return `${v.slice(0, 10)}...${v.slice(-8)}`;
}

export default function MyTransactionsPage() {
  const { walletAddress, isConnected } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tải giao dịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const myTransactions = useMemo(() => {
    if (!walletAddress) return [];
    return transactions.filter(
      (tx) =>
        tx.buyerWallet?.toLowerCase() === walletAddress.toLowerCase() ||
        tx.sellerWallet?.toLowerCase() === walletAddress.toLowerCase(),
    );
  }, [transactions, walletAddress]);

  if (!isConnected) {
    return (
      <div className="page-card">
        <EmptyState
          title="Chưa kết nối ví"
          desc="Hãy kết nối MetaMask để xem giao dịch của bạn."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-card">
        <h1>Giao dịch của tôi</h1>
        <div className="tx-list">
          <TxSkeleton />
          <TxSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="page-card">
      <h1>Giao dịch của tôi</h1>
      <p className="subtle-text">
        Hiển thị các giao dịch mà bạn là người mua hoặc người bán.
      </p>

      {myTransactions.length === 0 ? (
        <EmptyState
          title="Chưa có giao dịch nào thuộc về bạn"
          desc="Khi bạn mua hoặc đăng bán có người đặt cọc, dữ liệu sẽ hiện ở đây."
        />
      ) : (
        <div className="tx-list upgraded-tx-list">
          {myTransactions.map((tx) => (
            <div className="tx-item tx-item-advanced" key={tx._id}>
              <div className="tx-top">
                <div>
                  {tx.productId?._id ? (
                    <Link
                      to={`/product/${tx.productId._id}`}
                      className="tx-product-link"
                    >
                      <h3>{tx.productId?.title || "Không rõ sản phẩm"}</h3>
                    </Link>
                  ) : (
                    <h3>{tx.productId?.title || "Không rõ sản phẩm"}</h3>
                  )}

                  <p className="subtle-text">
                    {tx.productId?.category || "Khác"}
                  </p>
                </div>

                <span className={`status-chip ${tx.status}`}>{tx.status}</span>
              </div>

              <div className="tx-grid">
                <div>
                  <strong>Buyer:</strong> {tx.buyerWallet}
                </div>
                <div>
                  <strong>Seller:</strong> {tx.sellerWallet}
                </div>
                <div>
                  <strong>Tổng tiền:</strong> {tx.totalPriceNative}{" "}
                  {NATIVE_SYMBOL}
                </div>
                <div>
                  <strong>Đặt cọc:</strong> {tx.depositNative} {NATIVE_SYMBOL}
                </div>
                <div>
                  <strong>Còn lại:</strong> {tx.remainingNative} {NATIVE_SYMBOL}
                </div>
                <div>
                  <strong>Verified:</strong> {tx.verified ? "true" : "false"}
                </div>
              </div>

              <div className="proof-panel proof-panel-list">
                <div className="proof-row">
                  <span>Deposit Tx</span>
                  <div className="proof-value">
                    <code>
                      {tx.depositTxHash
                        ? shortHash(tx.depositTxHash)
                        : "chưa có"}
                    </code>
                    {tx.depositTxHash && (
                      <>
                        <CopyButton
                          text={tx.depositTxHash}
                          label="Đã copy deposit tx hash"
                        />
                        <ExplorerLink txHash={tx.depositTxHash} />
                      </>
                    )}
                  </div>
                </div>

                <div className="proof-row">
                  <span>Remaining Tx</span>
                  <div className="proof-value">
                    <code>
                      {tx.remainingTxHash
                        ? shortHash(tx.remainingTxHash)
                        : "chưa có"}
                    </code>
                    {tx.remainingTxHash && (
                      <>
                        <CopyButton
                          text={tx.remainingTxHash}
                          label="Đã copy remaining tx hash"
                        />
                        <ExplorerLink txHash={tx.remainingTxHash} />
                      </>
                    )}
                  </div>
                </div>

                <div className="proof-row">
                  <span>Local Hash</span>
                  <div className="proof-value">
                    <code>{shortHash(tx.txHashLocal)}</code>
                    <CopyButton
                      text={tx.txHashLocal}
                      label="Đã copy local hash"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
