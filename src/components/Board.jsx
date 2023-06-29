import React from "react";

const styles = {
  column: {
    width: "6vw",
    height: "6vw",
    backgroundColor: "00a8ff",
    display: "flex",
    padding: 5,
    cursor: "pointer",
  },
  row: {
    borderRadius: "50%",
    backgroundColor: "white",
    flex: 1,
    display: "flex",
  },
  piece: {
    flex: 1,
    borderRadius: "50%",
  },
};

export default class Board extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { rows, columns, winner } = this.props;
    const rowViews = [];

    for (let row = 0; row < rows; row += 1) {
      const columnViews = [];
      for (let column = 0; column < columns; column += 1) {
        const piece = this.props.getPiece(column, row);
        columnViews.push(
          <div
            key={`row-${row}-col-${column}`}
            onClick={() => {
              this.props.addMove(column, row);
            }}
            style={styles.column}
          >
            <div style={styles.row}>
              {piece ? (
                <div
                  style={{ ...styles.piece, backgroundColor: piece.player }}
                />
              ) : undefined}
            </div>
          </div>
        );
      }
      rowViews.push(
        <div
          key={`row-${row}`}
          style={{ display: "flex", flexDirection: "row" }}
        >
          {columnViews}
        </div>
      );
    }

    return (
      <div className={"stylesheet"}>
        {winner && (
          <div
            onClick={this.resetBoard}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
              zIndex: 3,
              backgroundColor: "rgba(0, 0, 0, .5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontWeight: "200",
              fontSize: "8vw",
            }}
          >{`${winner} Wins!`}</div>
        )}
        {rowViews}
      </div>
    );
  }
}

