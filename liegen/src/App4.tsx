function App4() {
  return (
    <div className="game-wrapper">
      <div className="game-outer">
        <div className="aspect-ratio-container" />
        <div className="game">
          <div className="primary-hand player-0">
          <div className="controls-wrapper">
            <div className="bust">
              <button className="bust-button">Bust</button>
              {/* <span>Bust</span> */}
            </div>
            <div className="cards">
              {/* <span>HOI</span> */}
              <div className="cards-grid">
                {/* <img src="/static/media/Diamonds-7.49229f38effacd5726f3.svg" className="card"/> */}
              </div>
            </div>
            <div className="make-set">
              {/* <div className="rank-control-wrapper">
                <button className="triangle-buttons">
                  <div className="triangle-buttons__triangle triangle-buttons__triangle--t">
                    </div>
                  </button>
                  <div className="rank">A</div>
                  <button className="triangle-buttons">
                    <div className="triangle-buttons__triangle triangle-buttons__triangle--b">
                  </div>
                </button>
              </div> */}
              {/* <span>Make set</span> */}
              <button className="set-button">
                Make set
              </button>
            </div>
          </div>
          </div>
          <div className="middle">
          </div>
          <div className="hand player-1">
          </div>
        </div>
      </div>
    </div>
  )
}

export default App4;