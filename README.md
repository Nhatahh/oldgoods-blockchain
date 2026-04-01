CHẠY DỰ ÁN
7.1 Deploy contract lên Validium
Trong contract/.env:
PRIVATE_KEY=PRIVATE_KEY_VI_TEST
VALIDIUM_RPC_URL=RPC_URL_VALIDIUM
CHAIN_ID=567
Chạy:
cd contract
npm run compile
npm run deploy:validium
Copy địa chỉ contract in ra.
7.2 Sửa server/.env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/oldgoods_validium
CLIENT_URL=http://localhost:5173
RPC_URL=RPC_URL_VALIDIUM
CONTRACT_ADDRESS=0xDIA_CHI_CONTRACT
CHAIN_ID=567
NATIVE_DECIMALS=18
7.3 Sửa client/.env
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=0xDIA_CHI_CONTRACT
VITE_CHAIN_ID=567
VITE_NATIVE_SYMBOL=VLDM
VITE_NATIVE_DECIMALS=18
7.4 Chạy backend
cd server
npm run dev
7.5 Chạy frontend
cd client
npm run dev
Mở:
http://localhost:5173
