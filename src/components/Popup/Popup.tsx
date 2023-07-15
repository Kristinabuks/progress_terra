import dayjs from "dayjs";
import { BonusGeneralInfo } from "../../apiClient";
import button from "../../img/next-button.svg";
import fire from "../../img/fire.svg";
import "./Popup.css";

interface PopupProps {
  bonusInfo: BonusGeneralInfo;
}

export const Popup: React.FC<PopupProps> = ({ bonusInfo }) => {
  const { currentQuantity, forBurningQuantity, dateBurning } = bonusInfo;

  return (
    <div className="Popup">
      <div className="Popup-body">
        <div className="Popup-left">
          <div className="Popup-bonus">{currentQuantity} бонусов</div>
          <div className="Popup-burningBonus">
            <span>{dayjs(dateBurning).format("DD.MM")} сгорит</span>
            <img src={fire} className="Popup-fire" alt="fire" />
            <span>{forBurningQuantity} бонусов</span>
          </div>
        </div>
        <div className="Popup-right">
          <img src={button} alt="button" />
        </div>
      </div>
    </div>
  );
};
