import { useEffect, useState } from "react";
import logo from "./img/information-button.svg";
import "./App.css";
import { Popup } from "./components/Popup/Popup";
import {
  BonusGeneralInfo,
  fetchAccessToken,
  fetchBonusGeneralInfo,
} from "./apiClient";

function App() {
  const [accessToken, setAccessToken] = useState<string>();
  const [bonusInfo, setBonusInfo] = useState<BonusGeneralInfo>();

  useEffect(() => {
    (async () => {
      try {
        setAccessToken(await fetchAccessToken());
      } catch (e) {
        alert(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    (async () => {
      try {
        setBonusInfo(await fetchBonusGeneralInfo(accessToken));
      } catch (e) {
        alert(e);
      }
    })();
  }, [accessToken]);

  return (
    <div className="App">
      <header className="App-header">
        ЛОГОТИП
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="App-body"></div>
      <div>{bonusInfo && <Popup bonusInfo={bonusInfo}></Popup>}</div>
    </div>
  );
}

export default App;
