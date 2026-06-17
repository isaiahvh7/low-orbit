
import './App.css'
import StatusPanel from './hud/StatusPanel.tsx'
import TelemetryPanel from './hud/TelemetryPanel.tsx'
import RandomScrollBox from './hud/RandomScrollBox.tsx'
import futureCircle from './assets/futureCircle.png'
import GlobeScene from "./scene/GlobeScene";

function App() {
  //const [count, setCount] = useState(0)
  //666, 375
  return (
    <>
      <section id="topleft">
        <StatusPanel/>
      </section>
      <section id = "topright">
        <TelemetryPanel/>
      </section>
      <section id="lowerright">
        <RandomScrollBox />
      </section>
      <section id="lowerleft">
        <div className="futuristicCircleInner">
          <img src={futureCircle} className="futureCircle" width="333" height="183" alt="" />
        </div>
      </section>
      <section id = "middle">
        <div className = "globe">
          <GlobeScene/>
        </div>
      </section>
    </>
  )
}

export default App
