import "./App.css";
import Board from "./components/Board";
import React from "react";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.addMove = this.addMove.bind(this);
    this.getPiece = this.getPiece.bind(this);
  }

  state = {
    rows: 6,
    columns: 6,
    moves: [],
    playerTurn: "red",
  };

  resetBoard() {
    this.setState({ moves: [], winner: null });
  }

  checkForWin(x, y, player) {
    let WinningMoves = [{ x, y }];
    for (let column = x + 1; column < x + 4; column += 1) {
      const checkPiece = this.getPiece(column, y);
      if (checkPiece && checkPiece.player === player) {
        WinningMoves.push({ x: column, y: y });
      } else {
        break;
      }
    }
    for (let column = x - 1; column > x - 4; column -= 1) {
      const checkPiece = this.getPiece(column, y);
      if (checkPiece && checkPiece.player === player) {
        WinningMoves.push({ x: column, y: y });
      } else {
        break;
      }
    }
    if (WinningMoves.length > 3) {
      this.setState({ winner: player, WinningMoves });
    }

    WinningMoves = [{ x, y }];
    for (let row = y + 1; row < y + 4; row += 1) {
      const checkPiece = this.getPiece(x, row);
      if (checkPiece && checkPiece.player === player) {
        WinningMoves.push({ x: x, y: row });
      } else {
        break;
      }
    }
    for (let row = y - 1; row > y - 4; row -= 1) {
      const checkPiece = this.getPiece(x, row);
      if (checkPiece && checkPiece.player === player) {
        WinningMoves.push({ x: x, y: row });
      } else {
        break;
      }
    }
    if (WinningMoves.length > 3) {
      this.setState({ winner: player, WinningMoves });
      return true;
    }
  }
  getPiece(x, y) {
    const list = this.state.moves.filter((item) => {
      return item.x === x && item.y === y;
    });

    return list[0];
  }
  addMove(x, y) {
    const { playerTurn } = this.state;
    const nextPlayerTurn = playerTurn === "red" ? "yellow" : "red";
    let availableYPosition = null;
    for (let position = this.state.rows - 1; position >= 0; position--) {
      if (!this.getPiece(x, position)) {
        availableYPosition = position;
        break;
      }
    }
    if (availableYPosition !== null) {
      // check for a win based on the next move
      this.setState(
        {
          moves: this.state.moves.concat({
            x,
            y: availableYPosition,
            player: playerTurn,
          }),
          playerTurn: nextPlayerTurn,
        },
        () => this.checkForWin(x, availableYPosition, playerTurn)
      );
    }
  }

  render() {
    const { playerTurn, rows, columns, winner } = this.state;

    return (
      <div style={{ ...styles.container, backgroundColor: playerTurn }}>
        <div>
          <Board
            rows={rows}
            columns={columns}
            winner={winner}
            moves={this.state.moves}
            addMove={this.addMove}
            getPiece={this.getPiece}
          />
          <button onClick={this.resetBoard}>Clear Board</button>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    allignItems: "center",
    padding: 5,
  },
};

