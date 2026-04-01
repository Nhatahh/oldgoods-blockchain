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
    const res = await api.get(`/products/${id}`);
    setProduct(res.data);
  };

  const fetchTransactions = async () => {
    if (!walletAddress) {
      setMyTransaction(null);
      return;
    }

    const res = await api.get("/transactions");
    const mine = res.data.find(
      (t) =>
        t.productId?._id === id &&
        t.buyerWallet?.toLowerCase() === walletAddress.toLowerCase(),
    );

    setMyTransaction(mine || null);
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
        {
          id: "deposit-flow",
        },
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
        {
          id: "remaining-flow",
        },
      );
    } finally {
      setLoadingRemaining(false);
    }
  };

  if (!product) return <div className="page-card">Đang tải...</div>;

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
    <>
      <div className="detail-layout detail-layout-upgraded">
        <div className="detail-image-card detail-premium">
          <img
            src={
              product.imageUrl ||
              "https://via.placeholder.com/800x500?text=OldGoods"
            }
            alt={product.title}
          />
        </div>

        <div className="detail-info-card detail-premium">
          <span className={`status-chip ${product.status}`}>
            {product.status}
          </span>
          <h1>{product.title}</h1>
          <p className="desc">{product.description}</p>

          <div className="info-grid-pro">
            <div className="info-pro-card">
              <small>Giá tổng</small>
              <strong>
                {product.priceNative} {NATIVE_SYMBOL}
              </strong>
            </div>
            <div className="info-pro-card">
              <small>Đặt cọc</small>
              <strong>
                {product.depositNative} {NATIVE_SYMBOL}
              </strong>
            </div>
          </div>

          <div className="meta-list">
            <div>
              <Landmark size={16} />
              <span>Validium Network</span>
            </div>
            <div>
              <Wallet2 size={16} />
              <span>{product.sellerWallet}</span>
              <CopyButton
                text={product.sellerWallet}
                label="Đã copy ví người bán"
              />
            </div>
            <div>
              <ShieldCheck size={16} />
              <span>Escrow + Hash Proof</span>
            </div>
          </div>

          <div className="action-group">
            {canDeposit && (
              <button
                className="btn btn-primary"
                onClick={() => setOpenDepositModal(true)}
                disabled={loadingDeposit}
              >
                {loadingDeposit
                  ? "Đang gửi transaction..."
                  : `Đặt cọc ${product.depositNative} ${NATIVE_SYMBOL}`}
              </button>
            )}

            {canPayRemaining && (
              <button
                className="btn btn-success"
                onClick={() => setOpenRemainingModal(true)}
                disabled={loadingRemaining}
              >
                {loadingRemaining
                  ? "Đang gửi transaction..."
                  : `Thanh toán còn lại ${myTransaction.remainingNative} ${NATIVE_SYMBOL}`}
              </button>
            )}
          </div>

          {myTransaction && (
            <div className="proof-panel">
              <h3>Blockchain Proof</h3>

              <div className="proof-row">
                <span>Trạng thái</span>
                <strong>{myTransaction.status}</strong>
              </div>

              <div className="proof-row">
                <span>Deposit Tx</span>
                <div className="proof-value">
                  <code>
                    {myTransaction.depositTxHash
                      ? shortHash(myTransaction.depositTxHash)
                      : "chưa có"}
                  </code>
                  {myTransaction.depositTxHash && (
                    <>
                      <CopyButton
                        text={myTransaction.depositTxHash}
                        label="Đã copy deposit tx hash"
                      />
                      <ExplorerLink txHash={myTransaction.depositTxHash} />
                    </>
                  )}
                </div>
              </div>

              <div className="proof-row">
                <span>Remaining Tx</span>
                <div className="proof-value">
                  <code>
                    {myTransaction.remainingTxHash
                      ? shortHash(myTransaction.remainingTxHash)
                      : "chưa có"}
                  </code>
                  {myTransaction.remainingTxHash && (
                    <>
                      <CopyButton
                        text={myTransaction.remainingTxHash}
                        label="Đã copy remaining tx hash"
                      />
                      <ExplorerLink txHash={myTransaction.remainingTxHash} />
                    </>
                  )}
                </div>
              </div>

              <div className="proof-row">
                <span>Local Hash</span>
                <div className="proof-value">
                  <code>{shortHash(myTransaction.txHashLocal)}</code>
                  <CopyButton
                    text={myTransaction.txHashLocal}
                    label="Đã copy local hash"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={openDepositModal}
        title="Xác nhận đặt cọc"
        description="Bạn sắp gửi giao dịch đặt cọc bằng MetaMask."
        confirmText={`Đặt cọc ${product.depositNative} ${NATIVE_SYMBOL}`}
        onConfirm={handleDeposit}
        onClose={() => setOpenDepositModal(false)}
        loading={loadingDeposit}
      >
        <div className="confirm-info-box">
          <div>
            <strong>Sản phẩm:</strong> {product.title}
          </div>
          <div>
            <strong>Giá tổng:</strong> {product.priceNative} {NATIVE_SYMBOL}
          </div>
          <div>
            <strong>Đặt cọc:</strong> {product.depositNative} {NATIVE_SYMBOL}
          </div>
          <div>
            <strong>Người bán:</strong> {product.sellerWallet}
          </div>
        </div>
      </ConfirmModal>

      <ConfirmModal
        open={openRemainingModal}
        title="Xác nhận thanh toán phần còn lại"
        description="Bạn sắp gửi giao dịch thanh toán phần còn lại bằng MetaMask."
        confirmText={`Thanh toán ${myTransaction?.remainingNative || 0} ${NATIVE_SYMBOL}`}
        onConfirm={handlePayRemaining}
        onClose={() => setOpenRemainingModal(false)}
        loading={loadingRemaining}
      >
        <div className="confirm-info-box">
          <div>
            <strong>Sản phẩm:</strong> {product.title}
          </div>
          <div>
            <strong>Đặt cọc đã trả:</strong> {myTransaction?.depositNative}{" "}
            {NATIVE_SYMBOL}
          </div>
          <div>
            <strong>Còn lại:</strong> {myTransaction?.remainingNative}{" "}
            {NATIVE_SYMBOL}
          </div>
          <div>
            <strong>Người bán:</strong> {product.sellerWallet}
          </div>
        </div>
      </ConfirmModal>
    </>
  );
}
