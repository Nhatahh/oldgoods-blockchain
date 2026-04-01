import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import api from "../api/api";
import CopyButton from "../components/CopyButton";
import ExplorerLink from "../components/ExplorerLink";
import EmptyState from "../components/EmptyState";
import { TxSkeleton } from "../components/LoadingSkeleton";

const NATIVE_SYMBOL = import.meta.env.VITE_NATIVE_SYMBOL || "VLDM";

function shortHash(v) {
  if (!v) return "";
  return `${v.slice(0, 10)}...${v.slice(-8)}`;
}

function statusLabel(status) {
  if (status === "draft") return "Draft";
  if (status === "deposited") return "Deposited";
  if (status === "completed") return "Completed";
  return status;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tải danh sách giao dịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (id) => {
    try {
      const res = await api.get(`/verify/${id}`);
      if (res.data.isMatch) {
        toast.success("Hash khớp, dữ liệu toàn vẹn");
      } else {
        toast.error("Hash không khớp, dữ liệu đã thay đổi");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi verify");
    }
  };

  if (loading) {
    return (
      <div className="page-card">
        <h1>Lịch sử giao dịch</h1>
        <div className="tx-list">
          <TxSkeleton />
          <TxSkeleton />
          <TxSkeleton />
        </div>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="page-card">
        <EmptyState
          title="Chưa có giao dịch nào"
          desc="Khi người mua đặt cọc hoặc thanh toán, giao dịch sẽ xuất hiện tại đây."
        />
      </div>
    );
  }

  return (
    <div className="page-card">
      <div className="page-top-row">
        <div>
          <h1>Lịch sử giao dịch</h1>
          <p className="subtle-text">
            Theo dõi toàn bộ giao dịch và trạng thái blockchain proof.
          </p>
        </div>
      </div>

      <div className="tx-list upgraded-tx-list">
        {transactions.map((tx) => (
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

              <span className={`status-chip ${tx.status}`}>
                {statusLabel(tx.status)}
              </span>
            </div>

            <div className="tx-timeline">
              <div className="timeline-node done">
                <Clock3 size={15} />
                <span>Tạo giao dịch</span>
              </div>

              <div
                className={`timeline-node ${tx.status === "deposited" || tx.status === "completed" ? "done" : ""}`}
              >
                <ShieldCheck size={15} />
                <span>Đặt cọc</span>
              </div>

              <div
                className={`timeline-node ${tx.status === "completed" ? "done" : ""}`}
              >
                <CheckCircle2 size={15} />
                <span>Hoàn tất</span>
              </div>
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
                    {tx.depositTxHash ? shortHash(tx.depositTxHash) : "chưa có"}
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

            <button
              className="btn btn-outline"
              onClick={() => handleVerify(tx._id)}
            >
              Verify Hash
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
