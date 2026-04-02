import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShieldCheck, Landmark, Wallet2 } from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { useWallet } from "../context/WalletContext";
import {
  depositForTradeOnChain,
  payRemainingOnChain,
} from "../blockchain/marketplaceContract";
import CopyButton from "../components/CopyButton";
import ExplorerLink from "../components/ExplorerLink";
import ConfirmModal from "../components/ConfirmModal";

const NATIVE_SYMBOL = import.meta.env.VITE_NATIVE_SYMBOL || "VLDM";

function shortHash(v) {
  if (!v) return "";
  return `${v.slice(0, 10)}...${v.slice(-8)}`;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { walletAddress, isConnected, refreshWalletInfo } = useWallet();

  const [product, setProduct] = useState(null);
  const [myTransaction, setMyTransaction] = useState(null);
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [loadingRemaining, setLoadingRemaining] = useState(false);

  const [openDepositModal, setOpenDepositModal] = useState(false);
  const [openRemainingModal, setOpenRemainingModal] = useState(false);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Không tải được thông tin sản phẩm");
    }
  };

  const fetchTransactions = async () => {
    if (!walletAddress) {
      setMyTransaction(null);
      return;
    }

    try {
      const res = await api.get("/transactions");
      const mine = res.data.find(
        (t) =>
          t.productId?._id === id &&
          t.buyerWallet?.toLowerCase() === walletAddress.toLowerCase(),
      );
      setMyTransaction(mine || null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    fetchTransactions();
  }, [walletAddress, id]);

  const handleDeposit = async () => {
    if (!isConnected) {
      toast.error("Hãy kết nối MetaMask");
      return;
    }

    setLoadingDeposit(true);

    try {
      const prepare = await api.post("/transactions/prepare-deposit", {
        productId: id,
        buyerWallet: walletAddress,
      });

      const { transactionId, tradeData, txHashLocal } = prepare.data;

      toast.loading("Đang chờ xác nhận MetaMask...", { id: "deposit-flow" });

      const onChain = await depositForTradeOnChain({
        businessId: transactionId,
        hashHex: txHashLocal,
        sellerWallet: tradeData.sellerWallet,
        totalPriceNative: tradeData.totalPriceNative,
        depositNative: tradeData.depositNative,
      });

      await api.post(`/transactions/${transactionId}/confirm-deposit`, {
        depositTxHash: onChain.txHash,
      });

      await fetchProduct();
      await fetchTransactions();
      await refreshWalletInfo(walletAddress);

      setOpenDepositModal(false);
      toast.success("Đặt cọc thành công", { id: "deposit-flow" });
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || err?.message || "Đặt cọc thất bại",
        { id: "deposit-flow" },
      );
    } finally {
      setLoadingDeposit(false);
    }
  };

  const handlePayRemaining = async () => {
    if (!myTransaction) {
      toast.error("Không tìm thấy giao dịch của bạn");
      return;
    }

    setLoadingRemaining(true);

    try {
      const prepare = await api.post(
        `/transactions/${myTransaction._id}/prepare-remaining`,
      );
      const { txHashLocal, remainingNative, txDataString, transactionId } =
        prepare.data;

      toast.loading("Đang chờ xác nhận MetaMask...", { id: "remaining-flow" });

      const onChain = await payRemainingOnChain({
        businessId: transactionId,
        hashHex: txHashLocal,
        remainingNative,
      });

      await api.post(`/transactions/${myTransaction._id}/confirm-remaining`, {
        remainingTxHash: onChain.txHash,
        txHashLocal,
        txDataString,
      });

      await fetchProduct();
      await fetchTransactions();
      await refreshWalletInfo(walletAddress);

      setOpenRemainingModal(false);
      toast.success("Thanh toán phần còn lại thành công", {
        id: "remaining-flow",
      });
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || err?.message || "Thanh toán thất bại",
        { id: "remaining-flow" },
      );
    } finally {
      setLoadingRemaining(false);
    }
  };

  if (!product) {
    return (
      <div className="og-page-layout">
        <div className="og-header-card og-header-card--center">
          <p>Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  const isSeller =
    walletAddress &&
    product.sellerWallet &&
    walletAddress.toLowerCase() === product.sellerWallet.toLowerCase();

  const canDeposit = isConnected && !isSeller && product.status === "available";

  const canPayRemaining =
    isConnected &&
    myTransaction &&
    myTransaction.status === "deposited" &&
    myTransaction.buyerWallet.toLowerCase() === walletAddress.toLowerCase();

  return (
    <div className="og-page-layout">
      <div className="og-product-detail">
        {/* Cột trái: Hình ảnh */}
        <div className="og-detail-image">
          <img
            src={
              product.imageUrl ||
              "https://via.placeholder.com/800x500?text=OldGoods"
            }
            alt={product.title}
          />
        </div>

        {/* Cột phải: Thông tin */}
        <div className="og-detail-info">
          <div className="og-detail-info__header">
            <span className={`og-status og-status--${product.status}`}>
              {product.status}
            </span>
          </div>

          <h1 className="og-detail-info__title">{product.title}</h1>
          <p className="og-detail-info__desc">{product.description}</p>

          {/* Block Giá */}
          <div className="og-price-grid">
            <div className="og-price-card">
              <span className="og-price-label">Giá tổng</span>
              <strong className="og-price-value">
                {product.priceNative}{" "}
                <span className="og-symbol">{NATIVE_SYMBOL}</span>
              </strong>
            </div>
            <div className="og-price-card og-price-card--highlight">
              <span className="og-price-label">Yêu cầu đặt cọc</span>
              <strong className="og-price-value">
                {product.depositNative}{" "}
                <span className="og-symbol">{NATIVE_SYMBOL}</span>
              </strong>
            </div>
          </div>

          {/* Thông tin Meta */}
          <div className="og-meta-list">
            <div className="og-meta-item">
              <Landmark size={18} className="og-meta-icon" />
              <span>Validium Network</span>
            </div>
            <div className="og-meta-item">
              <Wallet2 size={18} className="og-meta-icon" />
              <span className="og-address-text">
                {shortHash(product.sellerWallet)}
              </span>
              <CopyButton text={product.sellerWallet} label="Đã copy ví" />
            </div>
            <div className="og-meta-item">
              <ShieldCheck size={18} className="og-meta-icon" />
              <span>Escrow + Hash Proof</span>
            </div>
          </div>

          {/* Actions */}
          <div className="og-detail-actions">
            {canDeposit && (
              <button
                className="og-btn og-btn--primary og-btn--full og-btn--large"
                onClick={() => setOpenDepositModal(true)}
                disabled={loadingDeposit}
              >
                {loadingDeposit
                  ? "Đang xử lý giao dịch..."
                  : `Đặt cọc ngay (${product.depositNative} ${NATIVE_SYMBOL})`}
              </button>
            )}

            {canPayRemaining && (
              <button
                className="og-btn og-btn--success og-btn--full og-btn--large"
                onClick={() => setOpenRemainingModal(true)}
                disabled={loadingRemaining}
              >
                {loadingRemaining
                  ? "Đang xử lý giao dịch..."
                  : `Thanh toán số dư (${myTransaction.remainingNative} ${NATIVE_SYMBOL})`}
              </button>
            )}

            {isSeller && (
              <div className="og-notice-box">
                Bạn là người đăng bán sản phẩm này.
              </div>
            )}

            {!isConnected && (
              <div className="og-notice-box">
                Vui lòng kết nối ví MetaMask để giao dịch.
              </div>
            )}
          </div>

          {/* Blockchain Proof Panel (Tái sử dụng style từ MyTransactionsPage) */}
          {myTransaction && (
            <div className="og-tx-proofs">
              <div className="og-tx-proof-row">
                <span className="og-tx-proof-label">Trạng thái Escrow</span>
                <strong
                  className={`og-status og-status--${myTransaction.status}`}
                >
                  {myTransaction.status}
                </strong>
              </div>

              <div className="og-tx-proof-row">
                <span className="og-tx-proof-label">Deposit Tx</span>
                <div className="og-tx-proof-actions">
                  <code className="og-code">
                    {myTransaction.depositTxHash
                      ? shortHash(myTransaction.depositTxHash)
                      : "Chờ xử lý"}
                  </code>
                  {myTransaction.depositTxHash && (
                    <>
                      <CopyButton
                        text={myTransaction.depositTxHash}
                        label="Đã copy"
                      />
                      <ExplorerLink txHash={myTransaction.depositTxHash} />
                    </>
                  )}
                </div>
              </div>

              <div className="og-tx-proof-row">
                <span className="og-tx-proof-label">Remaining Tx</span>
                <div className="og-tx-proof-actions">
                  <code className="og-code">
                    {myTransaction.remainingTxHash
                      ? shortHash(myTransaction.remainingTxHash)
                      : "Chưa thanh toán"}
                  </code>
                  {myTransaction.remainingTxHash && (
                    <>
                      <CopyButton
                        text={myTransaction.remainingTxHash}
                        label="Đã copy"
                      />
                      <ExplorerLink txHash={myTransaction.remainingTxHash} />
                    </>
                  )}
                </div>
              </div>

              <div className="og-tx-proof-row">
                <span className="og-tx-proof-label">Local Hash</span>
                <div className="og-tx-proof-actions">
                  <code className="og-code">
                    {shortHash(myTransaction.txHashLocal)}
                  </code>
                  <CopyButton
                    text={myTransaction.txHashLocal}
                    label="Đã copy"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals Xác Nhận */}
      <ConfirmModal
        open={openDepositModal}
        title="Xác nhận đặt cọc"
        description="Bạn sắp gửi giao dịch đặt cọc thông qua MetaMask lên mạng Validium."
        confirmText={`Xác nhận cọc ${product.depositNative} ${NATIVE_SYMBOL}`}
        onConfirm={handleDeposit}
        onClose={() => setOpenDepositModal(false)}
        loading={loadingDeposit}
      >
        <div className="og-confirm-box">
          <div className="og-confirm-row">
            <span>Sản phẩm:</span>
            <strong>{product.title}</strong>
          </div>
          <div className="og-confirm-row">
            <span>Giá tổng:</span>
            <strong>
              {product.priceNative} {NATIVE_SYMBOL}
            </strong>
          </div>
          <div className="og-confirm-row og-confirm-row--highlight">
            <span>Số tiền cọc:</span>
            <strong>
              {product.depositNative} {NATIVE_SYMBOL}
            </strong>
          </div>
          <div className="og-confirm-row">
            <span>Ví người bán:</span>
            <span className="og-address-text">
              {shortHash(product.sellerWallet)}
            </span>
          </div>
        </div>
      </ConfirmModal>

      <ConfirmModal
        open={openRemainingModal}
        title="Thanh toán phần còn lại"
        description="Bạn sắp thanh toán nốt số tiền còn lại để hoàn tất giao dịch."
        confirmText={`Thanh toán ${myTransaction?.remainingNative || 0} ${NATIVE_SYMBOL}`}
        onConfirm={handlePayRemaining}
        onClose={() => setOpenRemainingModal(false)}
        loading={loadingRemaining}
      >
        <div className="og-confirm-box">
          <div className="og-confirm-row">
            <span>Sản phẩm:</span>
            <strong>{product.title}</strong>
          </div>
          <div className="og-confirm-row">
            <span>Đã đặt cọc:</span>
            <strong>
              {myTransaction?.depositNative} {NATIVE_SYMBOL}
            </strong>
          </div>
          <div className="og-confirm-row og-confirm-row--highlight">
            <span>Còn phải trả:</span>
            <strong>
              {myTransaction?.remainingNative} {NATIVE_SYMBOL}
            </strong>
          </div>
          <div className="og-confirm-row">
            <span>Ví người bán:</span>
            <span className="og-address-text">
              {shortHash(product.sellerWallet)}
            </span>
          </div>
        </div>
      </ConfirmModal>
    </div>
  );
}
