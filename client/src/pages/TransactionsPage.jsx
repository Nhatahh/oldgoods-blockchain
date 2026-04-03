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
      toast.loading("Đang kiểm tra đối chiếu Hash...", { id: "verify" });
      const res = await api.get(`/verify/${id}`);
      if (res.data.isMatch) {
        toast.success("Hash khớp! Dữ liệu vẹn toàn.", { id: "verify" });
      } else {
        toast.error(
          "Cảnh báo: Hash không khớp, dữ liệu off-chain đã bị thay đổi!",
          { id: "verify" },
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xác thực (Verify)", { id: "verify" });
    }
  };

  if (loading) {
    return (
      <div className="og-page-layout">
        <div className="og-header-card">
          <h1 className="og-header-card__title">Lịch sử giao dịch</h1>
          <p className="og-header-card__desc">
            Đang tải dữ liệu từ toàn bộ hệ thống chợ...
          </p>
        </div>
        <div className="og-tx-list">
          <TxSkeleton />
          <TxSkeleton />
          <TxSkeleton />
        </div>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="og-page-layout">
        <div className="og-header-card og-header-card--center">
          <EmptyState
            title="Chưa có giao dịch nào"
            desc="Khi người mua đặt cọc hoặc thanh toán, toàn bộ tiến trình sẽ xuất hiện tại đây."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="og-page-layout">
      <div className="og-header-card">
        <h1 className="og-header-card__title">Lịch sử giao dịch</h1>
        <p className="og-header-card__desc">
          Theo dõi toàn bộ tiến trình giao dịch và kiểm chứng (Verify) trạng
          thái blockchain proof của chợ đồ cũ.
        </p>
      </div>

      <div className="og-tx-list">
        {transactions.map((tx) => (
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
                {statusLabel(tx.status)}
              </span>
            </div>

            {/* Trục thời gian (Timeline) */}
            <div className="og-timeline">
              <div className="og-timeline-step og-timeline-step--done">
                <div className="og-timeline-icon">
                  <Clock3 size={16} />
                </div>
                <span className="og-timeline-text">Tạo giao dịch</span>
              </div>

              <div
                className={`og-timeline-step ${
                  tx.status === "deposited" || tx.status === "completed"
                    ? "og-timeline-step--done"
                    : ""
                }`}
              >
                <div className="og-timeline-icon">
                  <ShieldCheck size={16} />
                </div>
                <span className="og-timeline-text">Đặt cọc</span>
              </div>

              <div
                className={`og-timeline-step ${
                  tx.status === "completed" ? "og-timeline-step--done" : ""
                }`}
              >
                <div className="og-timeline-icon">
                  <CheckCircle2 size={16} />
                </div>
                <span className="og-timeline-text">Hoàn tất</span>
              </div>
            </div>

            {/* Chi tiết giao dịch */}
            <div className="og-tx-card__details">
              <div className="og-tx-detail-item">
                <small>Buyer</small>
                <strong className="og-address-text">
                  {shortHash(tx.buyerWallet)}
                </strong>
              </div>
              <div className="og-tx-detail-item">
                <small>Seller</small>
                <strong className="og-address-text">
                  {shortHash(tx.sellerWallet)}
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
                <small>Verified (Mặc định)</small>
                <strong
                  className={tx.verified ? "og-text-success" : "og-text-danger"}
                >
                  {tx.verified ? "Hợp lệ" : "Chưa xác nhận"}
                </strong>
              </div>
            </div>

            {/* Proofs */}
            <div className="og-tx-proofs">
              <div className="og-tx-proof-row">
                <span className="og-tx-proof-label">Deposit Tx</span>
                <div className="og-tx-proof-actions">
                  <code className="og-code">
                    {tx.depositTxHash ? shortHash(tx.depositTxHash) : "chưa có"}
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

            {/* Action Bar */}
            <div className="og-tx-card__actions">
              <button
                className="og-btn og-btn--outline"
                onClick={() => handleVerify(tx._id)}
              >
                <ShieldCheck size={16} /> Xác thực Hash (Verify)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
