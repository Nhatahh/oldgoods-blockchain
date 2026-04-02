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
      <div className="og-page-layout">
        <div className="og-header-card og-header-card--center">
          <EmptyState
            title="Chưa kết nối ví"
            desc="Hãy kết nối MetaMask để xem lịch sử giao dịch của bạn."
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="og-page-layout">
        <div className="og-header-card">
          <h1 className="og-header-card__title">Giao dịch của tôi</h1>
          <p className="og-header-card__desc">
            Đang tải dữ liệu giao dịch từ blockchain...
          </p>
        </div>
        <div className="og-tx-list">
          <TxSkeleton />
          <TxSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="og-page-layout">
      <div className="og-header-card">
        <h1 className="og-header-card__title">Giao dịch của tôi</h1>
        <p className="og-header-card__desc">
          Hiển thị các giao dịch mà bạn là người mua hoặc người bán trên hệ
          thống.
        </p>
      </div>

      {myTransactions.length === 0 ? (
        <div className="og-header-card og-header-card--center">
          <EmptyState
            title="Chưa có giao dịch nào"
            desc="Khi bạn mua hoặc đăng bán có người đặt cọc, dữ liệu proof sẽ hiện ở đây."
          />
        </div>
      ) : (
        <div className="og-tx-list">
          {myTransactions.map((tx) => (
            <div className="og-tx-card" key={tx._id}>
              {/* Header Giao Dịch */}
              <div className="og-tx-card__top">
                <div className="og-tx-card__title-group">
                  {tx.productId?._id ? (
                    <Link
                      to={`/product/${tx.productId._id}`}
                      className="og-tx-title"
                    >
                      {tx.productId?.title || "Không rõ sản phẩm"}
                    </Link>
                  ) : (
                    <h3 className="og-tx-title og-tx-title--text">
                      {tx.productId?.title || "Không rõ sản phẩm"}
                    </h3>
                  )}
                  <p className="og-tx-category">
                    {tx.productId?.category || "Khác"}
                  </p>
                </div>
                <span className={`og-status og-status--${tx.status}`}>
                  {tx.status}
                </span>
              </div>

              {/* Thông tin Chi tiết */}
              <div className="og-tx-card__details">
                <div className="og-tx-detail-item">
                  <small>Buyer (Người mua)</small>
                  <strong className="og-address-text">
                    {shortHash(tx.buyerWallet) || "N/A"}
                  </strong>
                </div>
                <div className="og-tx-detail-item">
                  <small>Seller (Người bán)</small>
                  <strong className="og-address-text">
                    {shortHash(tx.sellerWallet) || "N/A"}
                  </strong>
                </div>
                <div className="og-tx-detail-item">
                  <small>Tổng tiền</small>
                  <strong>
                    {tx.totalPriceNative} {NATIVE_SYMBOL}
                  </strong>
                </div>
                <div className="og-tx-detail-item">
                  <small>Đặt cọc</small>
                  <strong>
                    {tx.depositNative} {NATIVE_SYMBOL}
                  </strong>
                </div>
                <div className="og-tx-detail-item">
                  <small>Còn lại</small>
                  <strong>
                    {tx.remainingNative} {NATIVE_SYMBOL}
                  </strong>
                </div>
                <div className="og-tx-detail-item">
                  <small>Verified (Xác thực)</small>
                  <strong
                    className={
                      tx.verified ? "og-text-success" : "og-text-danger"
                    }
                  >
                    {tx.verified ? "Đã xác thực" : "Chưa xác thực"}
                  </strong>
                </div>
              </div>

              {/* Proof Panel */}
              <div className="og-tx-proofs">
                <div className="og-tx-proof-row">
                  <span className="og-tx-proof-label">Deposit Tx</span>
                  <div className="og-tx-proof-actions">
                    <code className="og-code">
                      {tx.depositTxHash
                        ? shortHash(tx.depositTxHash)
                        : "chưa có"}
                    </code>
                    {tx.depositTxHash && (
                      <>
                        <CopyButton text={tx.depositTxHash} label="Đã copy" />
                        <ExplorerLink txHash={tx.depositTxHash} />
                      </>
                    )}
                  </div>
                </div>

                <div className="og-tx-proof-row">
                  <span className="og-tx-proof-label">Remaining Tx</span>
                  <div className="og-tx-proof-actions">
                    <code className="og-code">
                      {tx.remainingTxHash
                        ? shortHash(tx.remainingTxHash)
                        : "chưa có"}
                    </code>
                    {tx.remainingTxHash && (
                      <>
                        <CopyButton text={tx.remainingTxHash} label="Đã copy" />
                        <ExplorerLink txHash={tx.remainingTxHash} />
                      </>
                    )}
                  </div>
                </div>

                <div className="og-tx-proof-row">
                  <span className="og-tx-proof-label">Local Hash</span>
                  <div className="og-tx-proof-actions">
                    <code className="og-code">{shortHash(tx.txHashLocal)}</code>
                    <CopyButton text={tx.txHashLocal} label="Đã copy" />
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
