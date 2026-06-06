import { Routes, Route, useNavigate } from "react-router-dom";
import Logo from "../src/assets/logo.png";
import "./App.css";
import greenFlowerPrint from "../src/assets/greenFloral.png";
import heart from "../src/assets/heart.png";
import star from "../src/assets/star.png";
import WeddingForm from "./formPages/Wedding/Wedding";
import GeneralForm from "./formPages/General/General";

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="page">
        <div className="header">
          <img src={greenFlowerPrint} alt="" className="header__img-L" />
          <img
            src={Logo}
            alt="Suncoast Florist Logo"
            className="header__logo"
          />
          <img src={greenFlowerPrint} alt="" className="header__img-R" />
        </div>
        <div className="body">
          <div className="form">
            <div className="form__header">
              <h3 className="event__type">What's the occasion?</h3>
              <h4 className="event__sub">
                Choose the type of event so we can ask the right questions.
              </h4>
              <span className="form__header-btm"></span>
            </div>
            <div className="form__select">
              <button
                className="form__select-btn"
                onClick={() => navigate("/general")}
              >
                <h3 className="button__text">General</h3>
                <div className="button__circle1">
                  <img src={star} alt="" className="button__icon" />
                </div>
                <h6 className="button__subtext">
                  Birthdays, Graduations, Anniversarys...
                </h6>
              </button>
              <button
                className="form__select-btn"
                onClick={() => navigate("/weddings")}
              >
                <h3 className="button__text">Weddings</h3>
                <div className="button__circle2">
                  <img src={heart} alt="Heart" className="button__icon" />
                </div>
                <h6 className="button__subtext">When's the big day?!</h6>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/general" element={<GeneralForm />} />
      <Route path="/weddings" element={<WeddingForm />} />
    </Routes>
  );
}

export default App;
