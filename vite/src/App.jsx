import { Contract, ethers, formatEther, parseEther } from "ethers";
import { useEffect, useState } from "react";
import abi from './abi.json';

const App = () => {
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const [name, setName] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const [myBalance, setMyBalance] = useState();
  const [symbol, setSymbol] = useState();
  const [sendAddress, setSendAddress] = useState("");
  const [checkAddressAccount, setcheckAddressAccount] = useState("");
  const [AddressAccount, setAddressAccount] = useState("");
  const [sendToken, setSendToken] = useState("");


  const onClickMetamask = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);

      setSigner(await provider.getSigner());
    } catch (error) {
      console.error(error);
    }
  };

  const onClickLogOut = () => {
    setSigner(null);
    setContract(null);
    setTotalSupply(null);
    setName(null);
    setSymbol(null);
    setMyBalance(null);
  };

  const onClickName = async () => {
    try {
      const response = await contract.name();
      setName(response);
     
    } catch (error) {
      console.error(error);
    }
  };

  const onClickTotalSupply = async () => {
    try {
      const response = await contract.totalSupply();
      setTotalSupply(response);

    } catch (error) {
      console.error(error);
    }
  };
  
  const onClickMyBalance = async () => {
    try {
      const response = await contract.balanceOf(signer.address);
      const parsedResponse = formatEther(response);
      setMyBalance(parsedResponse);

    } catch (error) {
      console.error(error);
    }
  };
  
  const onClickCheckBalance = async () => {
    try {
      if (!AddressAccount) return;
      const response = await contract.balanceOf(AddressAccount);
      const parsedResponse = formatEther(response);
      setcheckAddressAccount(parsedResponse);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickSendToken = async () => {
    try {
      if(!sendAddress || !sendToken) return;
      const result = await contract.transfer(sendAddress, parseEther(sendToken, "wei"));
      console.log(result)
    } catch (error) {
      console.error(error)
    };
  };

  const getSymbol = async () => {
    try {
      const response = await contract.symbol();
      setSymbol(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!signer) return;

    setContract(new Contract("0x93F6eA6D0F0Fd05963C131db47257BA61FBF436b", abi, signer));
  }, [signer]);

  useEffect(() => {
    if (!contract) return;
    getSymbol();
  },[contract])

  

  return (
    <div className="bg-red-100 min-h-screen flex justify-start items-center flex-col py-16">
      {signer ? (
        <div className="flex gap-8">
          <div className="box-style">
            안녕하세요, {signer.address.substring(0, 7)}...
            {signer.address.substring(signer.address.length - 5)}님
          </div>
          <button
            className="button-style border-red-300 hover:border-red-400"
            onClick={onClickLogOut}
          >
            로그아웃
          </button>
        </div>
      ) : (
        <button className="button-style" onClick={onClickMetamask}>
          🦊 메타마스크 로그인
        </button>
      )}
      {contract && <div className="mt-16 flex flex-col gap-8 bg-blue-100 grow max-w-md w-full">
        <h1 className="box-style">스마트 컨트랙트 연결을 완료했습니다.</h1>
        <div className="flex flex-col gap-8">
          <div className="flex w-full">
              <div className="box-style grow flex items-center">
                    {name
                      ? `코인이름: ${name}`
                      : "확인버튼을 눌러주세요."}
                </div>
              <button className="button-style ml-4" onClick={onClickName}>확인</button>
            </div>
          <div className="flex w-full">
            <div className="box-style grow flex items-center">
                  {totalSupply
                    ? `총 발행량: ${formatEther(totalSupply)}${symbol}`
                    : "총 발행량 확인"}
              </div>
            <button className="button-style ml-4" onClick={onClickTotalSupply}>확인</button>
          </div>
          <div className="flex w-full">
            <div className="box-style grow flex items-center">
                  {myBalance
                    ? `잔액: ${myBalance}${symbol}`
                    : "내 계좌 잔액 확인"}
              </div>
            <button className="button-style ml-4" onClick={onClickMyBalance}>확인</button>
          </div>
          <div className="flex w-full flex-col gap-8">
            <div className="box-style grow flex items-center">
                  {checkAddressAccount
                    ? `잔액: ${checkAddressAccount}${symbol}`
                    : `잔액 : ${symbol}`}
            </div>
            <input className="input-style" type="text" placeholder="지갑주소" value={AddressAccount} onChange={(e) => {setAddressAccount(e.target.value)}}/>
            <button className="button-style ml-4" onClick={onClickCheckBalance}>잔액 확인</button>
          </div>
          <div className="flex w-full items-end">
            <div className="flex flex-col gap-2 grow">
              <div className="ml-1 text-lg font-bold">토큰 전송</div>
              <input className="input-style" type="text" placeholder="지갑주소" value={sendAddress} onChange={(e) => {setSendAddress(e.target.value)}}/>
              <input className="input-style" type="text" placeholder={`${symbol}을 입력하세요.`} value={sendToken} onChange={(e) => {setSendToken(e.target.value)}}/>
            </div>
              <button className="button-style ml-4" onClick={onClickSendToken}>확인</button>
          </div>
        </div>
        </div>}
    </div>
  );
};

export default App;