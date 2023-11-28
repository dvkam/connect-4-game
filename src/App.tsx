import React from "react";
import Board from "./components/Board";
import './App.css'

export interface Move {
  x: number;
  y: number;
  player: string;
}

interface AppState {
  rows: number;
  columns: number;
  moves: Move[];
  playerTurn: string;
  winner: string | null;
  winningMoves: { x: number; y: number }[];
}

interface StateUpdate {
  winner: string | null;
  winningMoves: { x: number; y: number }[];
}

const styles = {
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
};

export default class App extends React.Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.addMove = this.addMove.bind(this);
    this.getPiece = this.getPiece.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
    this.checkForWin = this.checkForWin.bind(this);
  }

  initialState: AppState = {
    rows: 6,
    columns: 6,
    moves: [],
    playerTurn: "#beca8a",
    winner: null,
    winningMoves: [],
  };

  state: AppState = { ...this.initialState };

  resetBoard() {
    this.setState({ ...this.initialState });
  }

  checkForWin(x: number, y: number, player: string) {
    const WinningMoves: { x: number; y: number }[] = [{ x, y }];
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
    for (let offset = 1; offset < 4; offset++) {
      const checkPiece = this.getPiece(x + offset, y + offset);
      if (checkPiece && checkPiece.player === player) {
        WinningMoves.push({ x: x + offset, y: y + offset });
      } else {
        break;
      }
    }
    for (let offset = 1; offset < 4; offset++) {
      const checkPiece = this.getPiece(x - offset, y - offset);
      if (checkPiece && checkPiece.player === player) {
        WinningMoves.push({ x: x - offset, y: y - offset });
      } else {
        break;
      }
    }
    if (WinningMoves.length > 3) {
      const newState: StateUpdate = {
        winner: player,
        winningMoves: WinningMoves,
      };
      this.setState(newState);
      return;
    }
  
    // Downward diagonal check
    WinningMoves.splice(1); // Reset WinningMoves except the original piece
    for (let offset = 1; offset < 4; offset++) {
      const checkPiece = this.getPiece(x + offset, y - offset);
      if (checkPiece && checkPiece.player === player) {
        WinningMoves.push({ x: x + offset, y: y - offset });
      } else {
        break;
      }
    }
    for (let offset = 1; offset < 4; offset++) {
      const checkPiece = this.getPiece(x - offset, y + offset);
      if (checkPiece && checkPiece.player === player) {
        WinningMoves.push({ x: x - offset, y: y + offset });
      } else {
        break;
      }
    }
    if (WinningMoves.length > 3) {
      const newState: StateUpdate = {
        winner: player,
        winningMoves: WinningMoves,
      };
      this.setState(newState);
      return;
    }
  }

  getPiece(x: number, y: number): Move | undefined {
    const list = this.state.moves.filter((item) => {
      return item.x === x && item.y === y;
    });

    return list[0];
  }

  addMove(x: number) {
    const { playerTurn } = this.state;
    const nextPlayerTurn = playerTurn === "#beca8a" ? "#8a9eca" : "#beca8a";
    let availableYPosition: number | null = null;
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
        () => {
          if (availableYPosition !== null) {
            this.checkForWin(x, availableYPosition, playerTurn);
          }
        }
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
            winner={winner || ""}
            moves={this.state.moves}
            addMove={this.addMove}
            getPiece={this.getPiece}
            resetBoard={this.resetBoard}
          />
          <button onClick={this.resetBoard}>Clear Board</button>
        </div>
      </div>
    );
  }
}



