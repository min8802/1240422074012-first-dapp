import { Contract, ethers, formatEther, formatUnits } from "ethers";
import { useEffect, useState } from "react";
import abi from './abi.json';

const App = () => {
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const [totalSupply, setTotalSupply] = useState();

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
  };

  const onClickTotalSupply = async () => {
    try {
      const response = await contract.totalSupply();

      console.log(response);

      const parsedResponse = formatEther(response);

      console.log(parsedResponse);

      setTotalSupply(response);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!signer) return;

    setContract(new Contract("0x93F6eA6D0F0Fd05963C131db47257BA61FBF436b", abi, signer));
  }, [signer]);

  useEffect(() => {console.log(contract)},[contract])

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
        <div className="flex">
          <div className="box-style grow flex items-center">
                {totalSupply
                  ? `총 발행량: ${formatEther(totalSupply)}ETH`
                  : "총 발행량 확인"}
            </div>
          <button className="button-style ml-4" onClick={onClickTotalSupply}>확인</button>
        </div>
        </div>}
    </div>
  );
};

export default App;