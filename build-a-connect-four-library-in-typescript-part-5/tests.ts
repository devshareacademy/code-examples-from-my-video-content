import * as uvu from 'uvu';
import * as assert from 'uvu/assert';

import ConnectFour from '../src/connect-four';
import { Player, Coordinate, CellRange } from '../src/types';

type Data = {
  moves: number[];
  boardState: CellRange[][];
  winner: Player;
  winningCells: Coordinate[];
};

let connectFour: ConnectFour;

/* Connect Four - Game Initialization Tests */
function setupInitializationTests(): void {
  const connectFourInitializationSuite = uvu.suite('Connect Four - Initialization');

  connectFourInitializationSuite.before.each(() => {
    connectFour = new ConnectFour();
  });

  connectFourInitializationSuite('should initialize the game state with an empty board', () => {
    // check that the board is initialized with empty values
    const isBoardEmpty = connectFour.board.every((row) => row.every((cell) => cell === 0));
    assert.equal(isBoardEmpty, true);
  });

  connectFourInitializationSuite('should initialize the game with no winner', () => {
    const winner = connectFour.gameWinner;
    assert.type(winner, 'undefined');
    assert.equal(winner, undefined);
  });

  connectFourInitializationSuite('should initialize the game and the game should not be over', () => {
    const isGameOver = connectFour.isGameOver;
    assert.type(isGameOver, 'boolean');
    assert.equal(isGameOver, false);
  });

  connectFourInitializationSuite('should initialize the game and wait for the first players input', () => {
    const currentPlayersTurn = connectFour.playersTurn;
    assert.type(currentPlayersTurn, 'string');
    assert.equal(currentPlayersTurn, Player.ONE);
  });

  connectFourInitializationSuite('should initialize the game and there should be no winning cell combinations', () => {
    const winningCells = connectFour.winningCells;
    assert.type(winningCells, 'object');
    assert.equal(winningCells, []);
  });

  connectFourInitializationSuite.run();
}

/* Connect Four - Reset Game Tests */
function setupResetGameTests(): void {
  const connectFourResetGameSuite = uvu.suite('Connect Four - Reset Game');

  connectFourResetGameSuite.before.each(() => {
    connectFour = new ConnectFour();
    connectFour.makeMove(0);
    connectFour.resetGame();
  });

  connectFourResetGameSuite('should reset the game state with an empty board', () => {
    // check that the board is initialized with empty values
    const isBoardEmpty = connectFour.board.every((row) => row.every((cell) => cell === 0));
    assert.equal(isBoardEmpty, true);
  });

  connectFourResetGameSuite('should reset the game state with no winner', () => {
    const winner = connectFour.gameWinner;
    assert.type(winner, 'undefined');
    assert.equal(winner, undefined);
  });

  connectFourResetGameSuite('should reset the game state and the game should not be over', () => {
    const isGameOver = connectFour.isGameOver;
    assert.type(isGameOver, 'boolean');
    assert.equal(isGameOver, false);
  });

  connectFourResetGameSuite('should reset the game state and wait for the first players input', () => {
    const currentPlayersTurn = connectFour.playersTurn;
    assert.type(currentPlayersTurn, 'string');
    assert.equal(currentPlayersTurn, Player.ONE);
  });

  connectFourResetGameSuite('should reset the game state and there should be no winning cell combinations', () => {
    const winningCells = connectFour.winningCells;
    assert.type(winningCells, 'object');
    assert.equal(winningCells, []);
  });

  connectFourResetGameSuite.run();
}

/* Connect Four - Players Place Game Pieces Tests */
function setupPlaceGamePieceTests(): void {
  const connectFourPlayersInputSuite = uvu.suite('Connect Four - Players Place Game Pieces');

  connectFourPlayersInputSuite.before.each(() => {
    connectFour = new ConnectFour();
  });

  connectFourPlayersInputSuite('should return the coordinate of the cell where the game piece was placed', () => {
    const makeMoveResponse = connectFour.makeMove(4);
    assert.equal(makeMoveResponse, {
      col: 4,
      row: 5,
    });
  });

  connectFourPlayersInputSuite('should allow first player to place a game piece and update the game state', () => {
    connectFour.makeMove(0);

    const currentPlayersTurn = connectFour.playersTurn;
    assert.type(currentPlayersTurn, 'string');
    assert.equal(currentPlayersTurn, Player.TWO);

    const isGameOver = connectFour.isGameOver;
    assert.type(isGameOver, 'boolean');
    assert.equal(isGameOver, false);

    const winner = connectFour.gameWinner;
    assert.type(winner, 'undefined');
    assert.equal(winner, undefined);

    const winningCells = connectFour.winningCells;
    assert.type(winningCells, 'object');
    assert.equal(winningCells, []);

    const boardState = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
    ];
    assert.equal(boardState, connectFour.board);
  });

  connectFourPlayersInputSuite('should allow second player to place a game piece and update the game state', () => {
    connectFour.makeMove(0);
    connectFour.makeMove(0);

    const currentPlayersTurn = connectFour.playersTurn;
    assert.type(currentPlayersTurn, 'string');
    assert.equal(currentPlayersTurn, Player.ONE);

    const isGameOver = connectFour.isGameOver;
    assert.type(isGameOver, 'boolean');
    assert.equal(isGameOver, false);

    const winner = connectFour.gameWinner;
    assert.type(winner, 'undefined');
    assert.equal(winner, undefined);

    const winningCells = connectFour.winningCells;
    assert.type(winningCells, 'object');
    assert.equal(winningCells, []);

    const boardState = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [2, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
    ];
    assert.equal(boardState, connectFour.board);
  });

  connectFourPlayersInputSuite(
    'should throw an error if an invalid column is provided and not modify the game state',
    () => {
      assert.throws(() => connectFour.makeMove(-1), /Invalid column specified/);

      const currentPlayersTurn = connectFour.playersTurn;
      assert.type(currentPlayersTurn, 'string');
      assert.equal(currentPlayersTurn, Player.ONE);

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, false);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'undefined');
      assert.equal(winner, undefined);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, []);

      const boardState = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ];
      assert.equal(boardState, connectFour.board);
    },
  );

  connectFourPlayersInputSuite(
    'should throw an error if a column is already filled and not modify the game state',
    () => {
      connectFour.makeMove(0);
      connectFour.makeMove(0);
      connectFour.makeMove(0);
      connectFour.makeMove(0);
      connectFour.makeMove(0);
      connectFour.makeMove(0);

      assert.throws(() => connectFour.makeMove(0), /Column is already filled/);

      const currentPlayersTurn = connectFour.playersTurn;
      assert.type(currentPlayersTurn, 'string');
      assert.equal(currentPlayersTurn, Player.ONE);

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, false);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'undefined');
      assert.equal(winner, undefined);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, []);

      const boardState = [
        [2, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0],
      ];
      assert.equal(boardState, connectFour.board);
    },
  );

  connectFourPlayersInputSuite.run();
}

/* Connect Four - Game Finished Tests */
function setupGameOverTests(): void {
  const connectFourGameFinishedSuite = uvu.suite('Connect Four - Game Finished');

  connectFourGameFinishedSuite.before.each(() => {
    connectFour = new ConnectFour();
  });

  connectFourGameFinishedSuite(
    'should allow player one to win if valid moves are made by both players and player one provides a winning combination',
    () => {
      /*
        # # # # # # #
        # # # # # # #
        # # R # # # #
        # B R # # # #
        # B R # # # #
        # B R # # # #
      */
      const data: Data = {
        moves: [2, 1, 2, 1, 2, 1, 2],
        boardState: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 1, 0, 0, 0, 0],
          [0, 2, 1, 0, 0, 0, 0],
          [0, 2, 1, 0, 0, 0, 0],
          [0, 2, 1, 0, 0, 0, 0],
        ],
        winner: Player.ONE,
        winningCells: [
          { col: 2, row: 2 },
          { col: 2, row: 3 },
          { col: 2, row: 4 },
          { col: 2, row: 5 },
        ],
      };

      data.moves.forEach((move) => {
        connectFour.makeMove(move);
      });

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'string');
      assert.equal(winner, data.winner);

      assert.equal(data.boardState, connectFour.board);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, data.winningCells);
    },
  );

  connectFourGameFinishedSuite(
    'should allow player two to win if valid moves are made by both players and player two provides a winning combination',
    () => {
      /*
        # # # # # # #
        # # # # # # #
        # B # # # # #
        # B R # # # #
        # B R # # # #
        # B R R # # #
      */
      const data: Data = {
        moves: [2, 1, 2, 1, 2, 1, 3, 1],
        boardState: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 2, 0, 0, 0, 0, 0],
          [0, 2, 1, 0, 0, 0, 0],
          [0, 2, 1, 0, 0, 0, 0],
          [0, 2, 1, 1, 0, 0, 0],
        ],
        winner: Player.TWO,
        winningCells: [
          { col: 1, row: 2 },
          { col: 1, row: 3 },
          { col: 1, row: 4 },
          { col: 1, row: 5 },
        ],
      };

      data.moves.forEach((move) => {
        connectFour.makeMove(move);
      });

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'string');
      assert.equal(winner, data.winner);

      assert.equal(data.boardState, connectFour.board);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, data.winningCells);
    },
  );

  connectFourGameFinishedSuite(
    'should end in a draw if the board is filled and no player provides a winning combination',
    () => {
      // fill first and second columns
      connectFour.makeMove(0);
      connectFour.makeMove(1);
      connectFour.makeMove(0);
      connectFour.makeMove(1);
      connectFour.makeMove(0);
      connectFour.makeMove(1);
      connectFour.makeMove(1);
      connectFour.makeMove(0);
      connectFour.makeMove(1);
      connectFour.makeMove(0);
      connectFour.makeMove(1);
      connectFour.makeMove(0);
      // fill third and fourth columns
      connectFour.makeMove(2);
      connectFour.makeMove(3);
      connectFour.makeMove(2);
      connectFour.makeMove(3);
      connectFour.makeMove(2);
      connectFour.makeMove(3);
      connectFour.makeMove(3);
      connectFour.makeMove(2);
      connectFour.makeMove(3);
      connectFour.makeMove(2);
      connectFour.makeMove(3);
      connectFour.makeMove(2);
      // fill fifth and six columns
      connectFour.makeMove(4);
      connectFour.makeMove(5);
      connectFour.makeMove(4);
      connectFour.makeMove(5);
      connectFour.makeMove(4);
      connectFour.makeMove(5);
      connectFour.makeMove(5);
      connectFour.makeMove(4);
      connectFour.makeMove(5);
      connectFour.makeMove(4);
      connectFour.makeMove(5);
      connectFour.makeMove(4);
      // fill the last column
      connectFour.makeMove(6);
      connectFour.makeMove(6);
      connectFour.makeMove(6);
      connectFour.makeMove(6);
      connectFour.makeMove(6);
      connectFour.makeMove(6);

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'undefined');
      assert.equal(winner, undefined);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, []);

      // TODO - validate the board state
    },
  );

  connectFourGameFinishedSuite('should throw an error if the game is over and a player tries to make a move', () => {
    /*
        # # # # # # #
        # # # # # # #
        # # R # # # #
        # B R # # # #
        # B R # # # #
        # B R # # # #
      */
    const data: Data = {
      moves: [2, 1, 2, 1, 2, 1, 2],
      boardState: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0],
        [0, 2, 1, 0, 0, 0, 0],
        [0, 2, 1, 0, 0, 0, 0],
        [0, 2, 1, 0, 0, 0, 0],
      ],
      winner: Player.ONE,
      winningCells: [
        { col: 2, row: 2 },
        { col: 2, row: 3 },
        { col: 2, row: 4 },
        { col: 2, row: 5 },
      ],
    };

    data.moves.forEach((move) => {
      connectFour.makeMove(move);
    });

    assert.throws(() => connectFour.makeMove(0), /has already ended/);

    const currentPlayersTurn = connectFour.playersTurn;
    assert.type(currentPlayersTurn, 'string');
    assert.equal(currentPlayersTurn, Player.ONE);

    const isGameOver = connectFour.isGameOver;
    assert.type(isGameOver, 'boolean');
    assert.equal(isGameOver, true);

    const winner = connectFour.gameWinner;
    assert.type(winner, 'string');
    assert.equal(winner, data.winner);

    assert.equal(data.boardState, connectFour.board);

    const winningCells = connectFour.winningCells;
    assert.type(winningCells, 'object');
    assert.equal(winningCells, data.winningCells);
  });

  connectFourGameFinishedSuite.run();
}

/* Connect Four - Vertical Wins */
function setupVerticalWinTests(): void {
  const connectFourGameVerticalWinsSuite = uvu.suite('Connect Four - Vertical Wins');

  connectFourGameVerticalWinsSuite.before.each(() => {
    connectFour = new ConnectFour();
  });

  connectFourGameVerticalWinsSuite(
    'should allow player to win if last piece in a column forms four in a column',
    () => {
      /*
        B # # # # # #
        B # # # # # #
        B # # # # # #
        B R # # # # #
        R B R # # # #
        R B R R # # #
      */
      const data: Data = {
        moves: [0, 1, 0, 1, 1, 0, 2, 0, 2, 0, 3, 0],
        boardState: [
          [2, 0, 0, 0, 0, 0, 0],
          [2, 0, 0, 0, 0, 0, 0],
          [2, 0, 0, 0, 0, 0, 0],
          [2, 1, 0, 0, 0, 0, 0],
          [1, 2, 1, 0, 0, 0, 0],
          [1, 2, 1, 1, 0, 0, 0],
        ],
        winner: Player.TWO,
        winningCells: [
          { col: 0, row: 0 },
          { col: 0, row: 1 },
          { col: 0, row: 2 },
          { col: 0, row: 3 },
        ],
      };

      data.moves.forEach((move) => {
        connectFour.makeMove(move);
      });

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'string');
      assert.equal(winner, data.winner);

      assert.equal(data.boardState, connectFour.board);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, data.winningCells);
    },
  );

  connectFourGameVerticalWinsSuite(
    'should allow player to win if second to last piece in a column forms four in a column',
    () => {
      /*
        # # # # # # #
        B # # # # # #
        B R # # # # #
        B R # # # # #
        B R # # # # #
        R B R # # # #
      */
      const data: Data = {
        moves: [0, 1, 2, 0, 1, 0, 1, 0, 1, 0],
        boardState: [
          [0, 0, 0, 0, 0, 0, 0],
          [2, 0, 0, 0, 0, 0, 0],
          [2, 1, 0, 0, 0, 0, 0],
          [2, 1, 0, 0, 0, 0, 0],
          [2, 1, 0, 0, 0, 0, 0],
          [1, 2, 1, 0, 0, 0, 0],
        ],
        winner: Player.TWO,
        winningCells: [
          { col: 0, row: 1 },
          { col: 0, row: 2 },
          { col: 0, row: 3 },
          { col: 0, row: 4 },
        ],
      };

      data.moves.forEach((move) => {
        connectFour.makeMove(move);
      });

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'string');
      assert.equal(winner, data.winner);

      assert.equal(data.boardState, connectFour.board);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, data.winningCells);
    },
  );

  connectFourGameVerticalWinsSuite(
    'should allow player to win if third to last piece in a column forms four in a column',
    () => {
      /*
        # # # # # # #
        # # # # # # #
        R # # # # # #
        R B # # # # #
        R B # # # # #
        R B # # # # #
      */
      const data: Data = {
        moves: [0, 1, 0, 1, 0, 1, 0],
        boardState: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [1, 0, 0, 0, 0, 0, 0],
          [1, 2, 0, 0, 0, 0, 0],
          [1, 2, 0, 0, 0, 0, 0],
          [1, 2, 0, 0, 0, 0, 0],
        ],
        winner: Player.ONE,
        winningCells: [
          { col: 0, row: 2 },
          { col: 0, row: 3 },
          { col: 0, row: 4 },
          { col: 0, row: 5 },
        ],
      };

      data.moves.forEach((move) => {
        connectFour.makeMove(move);
      });

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'string');
      assert.equal(winner, data.winner);

      assert.equal(data.boardState, connectFour.board);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, data.winningCells);
    },
  );

  connectFourGameVerticalWinsSuite.run();
}

/* Connect Four - Horizontal Wins */
function setupHorizontalWinTests(): void {
  const connectFourGameHorizontalWinsSuite = uvu.suite('Connect Four - Horizontal Wins');

  connectFourGameHorizontalWinsSuite.before.each(() => {
    connectFour = new ConnectFour();
  });

  connectFourGameHorizontalWinsSuite('should allow player to win if last piece in a row forms four in a row', () => {
    /*
      # # # # # # #
      # # # # # # #
      # # # # # # #
      # # # # # # #
      B B B # # # #
      R R R R # # #
    */
    const data: Data = {
      moves: [0, 0, 1, 1, 2, 2, 3],
      boardState: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [2, 2, 2, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 0, 0],
      ],
      winner: Player.ONE,
      winningCells: [
        { col: 0, row: 5 },
        { col: 1, row: 5 },
        { col: 2, row: 5 },
        { col: 3, row: 5 },
      ],
    };

    data.moves.forEach((move) => {
      connectFour.makeMove(move);
    });

    const isGameOver = connectFour.isGameOver;
    assert.type(isGameOver, 'boolean');
    assert.equal(isGameOver, true);

    const winner = connectFour.gameWinner;
    assert.type(winner, 'string');
    assert.equal(winner, data.winner);

    assert.equal(data.boardState, connectFour.board);

    const winningCells = connectFour.winningCells;
    assert.type(winningCells, 'object');
    assert.equal(winningCells, data.winningCells);
  });

  connectFourGameHorizontalWinsSuite(
    'should allow player to win if last piece in the middle of a row forms four in a row',
    () => {
      /*
        # # # # # # #
        # # # # # # #
        # # # # # # #
        # # # # # # #
        B # B B # # #
        R R R R # # #
      */
      const data: Data = {
        moves: [0, 0, 2, 2, 3, 3, 1],
        boardState: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [2, 0, 2, 2, 0, 0, 0],
          [1, 1, 1, 1, 0, 0, 0],
        ],
        winner: Player.ONE,
        winningCells: [
          { col: 0, row: 5 },
          { col: 1, row: 5 },
          { col: 2, row: 5 },
          { col: 3, row: 5 },
        ],
      };

      data.moves.forEach((move) => {
        connectFour.makeMove(move);
      });

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'string');
      assert.equal(winner, data.winner);

      assert.equal(data.boardState, connectFour.board);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, data.winningCells);
    },
  );

  connectFourGameHorizontalWinsSuite(
    'should allow player to win if last piece placed at the end of a row forms four in a row',
    () => {
      /*
        # # # # # # #
        # # # # # # #
        # # # # # # #
        # # # # # # #
        # # # B B # B
        # # # R R R R
      */
      const data: Data = {
        moves: [6, 6, 4, 4, 3, 3, 5],
        boardState: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 2, 2, 0, 2],
          [0, 0, 0, 1, 1, 1, 1],
        ],
        winner: Player.ONE,
        winningCells: [
          { col: 3, row: 5 },
          { col: 4, row: 5 },
          { col: 5, row: 5 },
          { col: 6, row: 5 },
        ],
      };

      data.moves.forEach((move) => {
        connectFour.makeMove(move);
      });

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'string');
      assert.equal(winner, data.winner);

      assert.equal(data.boardState, connectFour.board);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, data.winningCells);
    },
  );

  connectFourGameHorizontalWinsSuite(
    'should allow player to win if all pieces are placed in the middle of a row',
    () => {
      /*
        # # # # # # #
        # # # # # # #
        # # # # # # #
        # # # # # # #
        # # B # B B #
        # # R R R R #
      */
      const data: Data = {
        moves: [2, 2, 4, 4, 5, 5, 3],
        boardState: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 2, 0, 2, 2, 0],
          [0, 0, 1, 1, 1, 1, 0],
        ],
        winner: Player.ONE,
        winningCells: [
          { col: 2, row: 5 },
          { col: 3, row: 5 },
          { col: 4, row: 5 },
          { col: 5, row: 5 },
        ],
      };
      data.moves.forEach((move) => {
        connectFour.makeMove(move);
      });

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'string');
      assert.equal(winner, data.winner);

      assert.equal(data.boardState, connectFour.board);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, data.winningCells);
    },
  );

  connectFourGameHorizontalWinsSuite.run();
}

/* Connect Four - Forward Slash Wins */
function setupForwardSlashWinTests(): void {
  const connectFourGameForwardSlashWinSuite = uvu.suite('Connect Four - Forward Slash Wins');

  connectFourGameForwardSlashWinSuite.before.each(() => {
    connectFour = new ConnectFour();
  });

  connectFourGameForwardSlashWinSuite(
    'should allow player to win with a forward slash in the bottom left corner',
    () => {
      /*
        # # # # # # #
        # # # # # # #
        # # # 1 # # #
        # # 1 2 # # #
        # 1 2 1 # # #
        1 2 1 2 # # #
      */
      const data: Data = {
        moves: [0, 1, 2, 3, 1, 2, 3, 3, 2, 4, 3],
        boardState: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 0, 0, 0],
          [0, 0, 1, 2, 0, 0, 0],
          [0, 1, 2, 1, 0, 0, 0],
          [1, 2, 1, 2, 2, 0, 0],
        ],
        winner: Player.ONE,
        winningCells: [
          { col: 0, row: 5 },
          { col: 1, row: 4 },
          { col: 2, row: 3 },
          { col: 3, row: 2 },
        ],
      };

      data.moves.forEach((move) => {
        connectFour.makeMove(move);
      });

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'string');
      assert.equal(winner, data.winner);

      assert.equal(data.boardState, connectFour.board);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, data.winningCells);
    },
  );

  connectFourGameForwardSlashWinSuite(
    'should allow player to win with a forward slash in the bottom right corner',
    () => {
      /*
        # # # # # # #
        # # # # # # #
        # # # # # # 1
        # # # # # 1 2
        # # # # 1 1 1
        # # 2 1 2 2 2
      */
      const data: Data = {
        moves: [3, 4, 4, 5, 5, 6, 6, 2, 5, 6, 6],
        boardState: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 1],
          [0, 0, 0, 0, 0, 1, 2],
          [0, 0, 0, 0, 1, 1, 1],
          [0, 0, 2, 1, 2, 2, 2],
        ],
        winner: Player.ONE,
        winningCells: [
          { col: 3, row: 5 },
          { col: 4, row: 4 },
          { col: 5, row: 3 },
          { col: 6, row: 2 },
        ],
      };

      data.moves.forEach((move) => {
        connectFour.makeMove(move);
      });

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'string');
      assert.equal(winner, data.winner);

      assert.equal(data.boardState, connectFour.board);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, data.winningCells);
    },
  );

  connectFourGameForwardSlashWinSuite('should allow player to win with a forward slash in the middle', () => {
    /*
      # # # 1 # # #
      # # 1 2 # # #
      # 1 2 1 # # #
      1 2 1 2 # # #
      1 2 1 2 # # #
      1 2 1 2 2 # #
    */
    const data: Data = {
      moves: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 1, 2, 3, 4, 2, 3, 3],
      boardState: [
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 2, 0, 0, 0],
        [0, 1, 2, 1, 0, 0, 0],
        [1, 2, 1, 2, 0, 0, 0],
        [1, 2, 1, 2, 0, 0, 0],
        [1, 2, 1, 2, 2, 0, 0],
      ],
      winner: Player.ONE,
      winningCells: [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
      ],
    };

    data.moves.forEach((move) => {
      connectFour.makeMove(move);
    });

    const isGameOver = connectFour.isGameOver;
    assert.type(isGameOver, 'boolean');
    assert.equal(isGameOver, true);

    const winner = connectFour.gameWinner;
    assert.type(winner, 'string');
    assert.equal(winner, data.winner);

    assert.equal(data.boardState, connectFour.board);

    const winningCells = connectFour.winningCells;
    assert.type(winningCells, 'object');
    assert.equal(winningCells, data.winningCells);
  });

  connectFourGameForwardSlashWinSuite('should allow player to win with a forward slash in the top right corner', () => {
    /*
      # # # # # # 1
      # # # # # 1 2
      # # # # 1 2 1
      # # # 1 2 1 2
      # # # 1 2 1 2
      # # 2 1 2 1 2
    */
    const data: Data = {
      moves: [3, 4, 5, 6, 3, 4, 5, 6, 3, 4, 5, 6, 4, 5, 6, 2, 5, 6, 6],
      boardState: [
        [0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1, 2],
        [0, 0, 0, 0, 1, 2, 1],
        [0, 0, 0, 1, 2, 1, 2],
        [0, 0, 0, 1, 2, 1, 2],
        [0, 0, 2, 1, 2, 1, 2],
      ],
      winner: Player.ONE,
      winningCells: [
        { col: 3, row: 3 },
        { col: 4, row: 2 },
        { col: 5, row: 1 },
        { col: 6, row: 0 },
      ],
    };

    data.moves.forEach((move) => {
      connectFour.makeMove(move);
    });

    const isGameOver = connectFour.isGameOver;
    assert.type(isGameOver, 'boolean');
    assert.equal(isGameOver, true);

    const winner = connectFour.gameWinner;
    assert.type(winner, 'string');
    assert.equal(winner, data.winner);

    assert.equal(data.boardState, connectFour.board);

    const winningCells = connectFour.winningCells;
    assert.type(winningCells, 'object');
    assert.equal(winningCells, data.winningCells);
  });

  connectFourGameForwardSlashWinSuite(
    'should allow player to win with a forward slash in the middle right side',
    () => {
      /*
        # # # # # # #
        # # # # # # #
        # # # # # # 1
        # # # # # 1 2
        # # # # 1 2 1
        # # 2 1 2 1 2
      */
      const data: Data = {
        moves: [3, 4, 5, 6, 4, 5, 6, 2, 5, 6, 6],
        boardState: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 1],
          [0, 0, 0, 0, 0, 1, 2],
          [0, 0, 0, 0, 1, 2, 1],
          [0, 0, 2, 1, 2, 1, 2],
        ],
        winner: Player.ONE,
        winningCells: [
          { col: 3, row: 5 },
          { col: 4, row: 4 },
          { col: 5, row: 3 },
          { col: 6, row: 2 },
        ],
      };

      data.moves.forEach((move) => {
        connectFour.makeMove(move);
      });

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'string');
      assert.equal(winner, data.winner);

      assert.equal(data.boardState, connectFour.board);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, data.winningCells);
    },
  );

  connectFourGameForwardSlashWinSuite.run();
}

/* Connect Four - Backward Slash Wins Tests */
function setupBackwardSlashWinTests(): void {
  const connectFourGameBackwardSlashWinSuite = uvu.suite('Connect Four - Backward Slash Wins');

  connectFourGameBackwardSlashWinSuite.before.each(() => {
    connectFour = new ConnectFour();
  });

  connectFourGameBackwardSlashWinSuite(
    'should allow player to win with a backward slash in the bottom right corner',
    () => {
      /*
        # # # # # # #
        # # # # # # #
        # # # 1 # # #
        # # # 2 1 2 #
        # # # 1 2 1 #
        # # # 1 2 2 1
      */
      const data: Data = {
        moves: [3, 4, 6, 5, 3, 4, 5, 3, 4, 5, 3],
        boardState: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 0, 0, 0],
          [0, 0, 0, 2, 1, 2, 0],
          [0, 0, 0, 1, 2, 1, 0],
          [0, 0, 0, 1, 2, 2, 1],
        ],
        winner: Player.ONE,
        winningCells: [
          { col: 6, row: 5 },
          { col: 5, row: 4 },
          { col: 4, row: 3 },
          { col: 3, row: 2 },
        ],
      };

      data.moves.forEach((move) => {
        connectFour.makeMove(move);
      });

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'string');
      assert.equal(winner, data.winner);

      assert.equal(data.boardState, connectFour.board);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, data.winningCells);
    },
  );

  connectFourGameBackwardSlashWinSuite(
    'should allow player to win with a backward slash in the bottom left corner',
    () => {
      /*
        # # # # # # #
        # # # # # # #
        1 # # # # # #
        2 1 # # # # #
        1 2 1 # # # #
        1 2 2 1 2 # #
      */
      const data: Data = {
        moves: [0, 1, 0, 1, 1, 0, 0, 2, 2, 4, 3],
        boardState: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [1, 0, 0, 0, 0, 0, 0],
          [2, 1, 0, 0, 0, 0, 0],
          [1, 2, 1, 0, 0, 0, 0],
          [1, 2, 2, 1, 2, 0, 0],
        ],
        winner: Player.ONE,
        winningCells: [
          { col: 3, row: 5 },
          { col: 2, row: 4 },
          { col: 1, row: 3 },
          { col: 0, row: 2 },
        ],
      };

      data.moves.forEach((move) => {
        connectFour.makeMove(move);
      });

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'string');
      assert.equal(winner, data.winner);

      assert.equal(data.boardState, connectFour.board);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, data.winningCells);
    },
  );

  connectFourGameBackwardSlashWinSuite('should allow player to win with a backward slash from the middle', () => {
    /*
      # # 1 # # # #
      # # 1 1 # # #
      # # 2 2 1 # #
      # # 1 2 2 1 #
      # # 2 1 1 2 #
      2 # 1 2 2 1 #
    */
    const data: Data = {
      moves: [5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 2, 3, 3, 2, 2, 2, 2, 0, 2],
      boardState: [
        [0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0],
        [0, 0, 2, 2, 1, 0, 0],
        [0, 0, 1, 2, 2, 1, 0],
        [0, 0, 2, 1, 1, 2, 0],
        [2, 0, 1, 2, 2, 1, 0],
      ],
      winner: Player.ONE,
      winningCells: [
        { col: 5, row: 3 },
        { col: 4, row: 2 },
        { col: 3, row: 1 },
        { col: 2, row: 0 },
      ],
    };

    data.moves.forEach((move) => {
      connectFour.makeMove(move);
    });

    const isGameOver = connectFour.isGameOver;
    assert.type(isGameOver, 'boolean');
    assert.equal(isGameOver, true);

    const winner = connectFour.gameWinner;
    assert.type(winner, 'string');
    assert.equal(winner, data.winner);

    assert.equal(data.boardState, connectFour.board);

    const winningCells = connectFour.winningCells;
    assert.type(winningCells, 'object');
    assert.equal(winningCells, data.winningCells);
  });

  connectFourGameBackwardSlashWinSuite(
    'should allow player to win with a backward slash in the top left corner',
    () => {
      /*
        1 # # # # # #
        2 1 # # # # #
        1 2 1 # # # #
        2 1 2 1 # # #
        2 1 2 1 # # #
        2 1 2 1 # # 2
      */
      const data: Data = {
        moves: [3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 2, 1, 0, 6, 1, 0, 0],
        boardState: [
          [1, 0, 0, 0, 0, 0, 0],
          [2, 1, 0, 0, 0, 0, 0],
          [1, 2, 1, 0, 0, 0, 0],
          [2, 1, 2, 1, 0, 0, 0],
          [2, 1, 2, 1, 0, 0, 0],
          [2, 1, 2, 1, 0, 0, 2],
        ],
        winner: Player.ONE,
        winningCells: [
          { col: 3, row: 3 },
          { col: 2, row: 2 },
          { col: 1, row: 1 },
          { col: 0, row: 0 },
        ],
      };

      data.moves.forEach((move) => {
        connectFour.makeMove(move);
      });

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'string');
      assert.equal(winner, data.winner);

      assert.equal(data.boardState, connectFour.board);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, data.winningCells);
    },
  );

  connectFourGameBackwardSlashWinSuite(
    'should allow player to win with a backward slash in the top right corner',
    () => {
      /*
        # # # 1 # # #
        # # # 2 1 2 #
        # # # 2 1 1 #
        # # # 1 2 2 1
        # # # 1 2 1 2
        # # # 1 2 1 2
      */
      const data: Data = {
        moves: [3, 4, 5, 6, 3, 4, 5, 6, 3, 4, 6, 5, 5, 3, 4, 3, 4, 5, 3],
        boardState: [
          [0, 0, 0, 1, 0, 0, 0],
          [0, 0, 0, 2, 1, 2, 0],
          [0, 0, 0, 2, 1, 1, 0],
          [0, 0, 0, 1, 2, 2, 1],
          [0, 0, 0, 1, 2, 1, 2],
          [0, 0, 0, 1, 2, 1, 2],
        ],
        winner: Player.ONE,
        winningCells: [
          { col: 6, row: 3 },
          { col: 5, row: 2 },
          { col: 4, row: 1 },
          { col: 3, row: 0 },
        ],
      };

      data.moves.forEach((move) => {
        connectFour.makeMove(move);
      });

      const isGameOver = connectFour.isGameOver;
      assert.type(isGameOver, 'boolean');
      assert.equal(isGameOver, true);

      const winner = connectFour.gameWinner;
      assert.type(winner, 'string');
      assert.equal(winner, data.winner);

      assert.equal(data.boardState, connectFour.board);

      const winningCells = connectFour.winningCells;
      assert.type(winningCells, 'object');
      assert.equal(winningCells, data.winningCells);
    },
  );

  connectFourGameBackwardSlashWinSuite.run();
}

setupInitializationTests();
setupResetGameTests();
setupPlaceGamePieceTests();
setupGameOverTests();
setupVerticalWinTests();
setupHorizontalWinTests();
setupForwardSlashWinTests();
setupBackwardSlashWinTests();
