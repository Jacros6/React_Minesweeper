import React, {Fragment, useEffect, useState} from 'react';

function advanceColor(color) {
    if( color === 'gray' )
        return 'white';
}

function Cell(props) {
    console.log(props)
    let show;
    if(props.cell.isOccupied && props.cell.id > 0){
        show = props.cell.id;
    }
    return (
        <td onClick={() => props.handleClick(props.rowIdx, props.colIdx)} width="50px" height="50px"
            style={{backgroundColor: props.cell.color}}>
            {show}</td>
    );
}

function Row(props) {
    return (
        <tr>{ props.row.map( (cell, idx) => <Cell key={uniqueKey()}
                                                  cell={cell}
                                                  rowIdx={props.rowIdx}
                                                  colIdx={idx}
                                                  handleClick={props.handleClick}
        />)
        }
        </tr>
    )
}

let key = 1;
function uniqueKey() {
    return key++;
}

const NUM_ROWS_SMALL = 6, NUM_COLUMNS_SMALL = 6;
const NUM_ROWS_MED = 7, NUM_COLUMNS_MED = 7;
const NUM_ROWS_LARGE = 8, NUM_COLUMNS_LARGE = 8;

function createInitialStateNone(){
    let board = Array(0).fill(Array(0).fill({color: "gray"}));
    board = board.map((row, rowIdx) => row.map( (col, colIdx) => {
        return {...board[rowIdx][colIdx], row: rowIdx, column: colIdx }
    }));

    return {
        board
    }
}

//source https://www.codegrepper.com/code-examples/javascript/random+number+between+1+to+9+js
function getRandomBetween(min, max){
    return Math.random() * (max - min) + min;
}

function generateMines2(board, counter){
    if (counter === board.length){
        return;
    }
    let x = Math.floor(getRandomBetween(0, board.length));
    let y = Math.floor(getRandomBetween(0, board.length));

    while(board[x][y].isMine){
        x = Math.floor(getRandomBetween(0, board.length));
        y = Math.floor(getRandomBetween(0, board.length));
    }
    if(!board[x][y].isMine){
        board[x][y] = {color: "gray", isOccupied: true, isMine:true, id:0, row: x, column: y}
    }
    generateMines2(board, counter + 1)
}

function generateIds(board){
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board.length; j++){
            if(board[i][j].isMine){
                if(i + 1 <= board.length -1){
                    if(!board[i+1][j].isMine) {
                        board[i + 1][j].id += 1;
                    }
                }
                if(i - 1 >= 0){
                    if(!board[i-1][j].isMine) {
                        board[i - 1][j].id += 1;
                    }
                }
                if(j - 1 >= 0){
                    if(!board[i][j - 1].isMine) {
                        board[i][j - 1].id += 1;
                    }
                }
                if(i + 1 <= board.length -1 && j + 1 <= board.length - 1){
                    if(!board[i+1][j+1].isMine) {
                        board[i + 1][j + 1].id += 1;
                    }
                }
                if(i - 1 >= 0 && j + 1 <= board.length - 1){
                    if(!board[i-1][j+1].isMine) {
                        board[i - 1][j + 1].id += 1;
                    }
                }
                if(i - 1 >= 0 && j - 1 >= 0){
                    if(!board[i -1][j - 1].isMine) {
                        board[i - 1][j - 1].id += 1;
                    }
                }
                if(i + 1 <= board.length - 1 && j - 1 >= 0){
                    if(!board[i+1][j-1].isMine) {
                        board[i + 1][j - 1].id += 1;
                    }
                }
                if(j + 1 <= board.length - 1){
                    if(!board[i][j+1].isMine) {
                        board[i][j + 1].id += 1;
                    }
                }
            }
        }
    }
}



function createInitialStateSmall() {
    let board = Array(NUM_ROWS_SMALL).fill(Array(NUM_COLUMNS_SMALL).fill({color: "gray", isOccupied: false, id:0}));
    board = board.map((row, rowIdx) => row.map( (col, colIdx) => {
        return {...board[rowIdx][colIdx], row: rowIdx, column: colIdx }
    }));
    let counter = 0;
    let id = 0;
    generateMines2(board, counter, id);
    generateIds(board);
    console.log("end of generation")
    return {
        board,
        haveAWinner: false,
        nextColor: 'white',// applies to the entire board, not to a given cell.
        size: 'small',
        start: true,
        time: 0,
        interval: null,
        isALoss: false,
        cheat: false
    };
}

function createInitialStateMedium() {
    let board = Array(NUM_ROWS_MED).fill(Array(NUM_COLUMNS_MED).fill({color: "gray", isOccupied: false, id:0}));
    board = board.map((row, rowIdx) => row.map( (col, colIdx) => {
        return {...board[rowIdx][colIdx], row: rowIdx, column: colIdx }
    }));
    let counter = 0;
    generateMines2(board, counter);
    generateIds(board);
    console.log("end of generation")
    return {
        board,
        haveAWinner: false,
        nextColor: 'white',   // applies to the entire board, not to a given cell.
        size: 'medium',
        start: true,
        time: 0,
        interval: null,
        isALoss: false,
        cheat: false
    };
}


function createInitialStateLarge() {
    let board = Array(NUM_ROWS_LARGE).fill(Array(NUM_COLUMNS_LARGE).fill({color: "gray", isOccupied: false, id:0}));
    board = board.map((row, rowIdx) => row.map( (col, colIdx) => {
        return {...board[rowIdx][colIdx], row: rowIdx, column: colIdx }
    }));
    let counter = 0;
    generateMines2(board, counter);
    generateIds(board);
    console.log("end of generation")
    return {
        board,
        haveAWinner: false,
        nextColor: 'white',   // applies to the entire board, not to a given cell.
        size: 'large',
        start: true,
        time: 0,
        interval: null,
        isALoss: false,
        cheat: false
    };
}

function TopMessage(props) {
    if(props.isALoss){
        return <div style={{height: "50px", align: "center"}}>
            <p align="center">Loss! Pick a new size to start again...</p>
        </div>
    }
    if(props.haveAWinner){
        return <div style={{height: "50px", align: "center"}}>
            <p align="center">Winner! Pick a new size to start again...</p>
        </div>
    }
    if(!props.start){
        return <div style={{height: "50px", textAlign: "center"}}><p top-margin="100px"></p>Pick a size</div>;
    }

    return <div style={{height: "50px", align: "center"}}>
        <p align="center"></p>
    </div>
}


let numClicks = 0;

export default function Board(props) {
    const [boardState, setBoardState] = useState(createInitialStateNone);
    const [time, setTime] = useState(0);
    const [start, setStart] = useState(false)



    const small = () => {
        setStart(false);
        setTime(0);
        setStart(true);
        setBoardState(createInitialStateSmall());
        //return setBoardState(createInitialStateSmall());
    }

    const med = () => {
        setStart(false);
        setTime(0);
        setStart(true);
        return setBoardState(createInitialStateMedium());
    }

    const large = () => {
        setStart(false);
        setTime(0);
        setStart(true);
        return setBoardState(createInitialStateLarge());
    }


    const cheat = () => {
        let board = boardState.board;
        if(boardState.cheat === true){
            for(let i = 0; i < board.length; i++){
                for(let j = 0; j < board.length; j++){
                    if(board[i][j].isMine){
                        board[i][j] = {...board[i][j], color: "gray"}
                    }
                }
            }
            return setBoardState({
                ...boardState,
                cheat:false
            })
        }
        for(let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j].isMine) {
                    board[i][j] = {...board[i][j], color: "black"}
                }
            }
        }

        setBoardState({
            ...boardState,
            cheat:true
        })
    }



    function lost(){
        setBoardState(createInitialStateNone());
        setBoardState({...boardState, isALoss:true})

    }

    function handleClickRecursive(board, rowIdx, colIdx){
        if(rowIdx >= board.length){
            return;
        }
        if(rowIdx <= -1){
            return;
        }
        if(colIdx <=-1){
            return;
        }
        if(colIdx >= board.length){
            return;
        }
        if (board[rowIdx][colIdx].isOccupied) {
            return;
        }
        if(board[rowIdx][colIdx].id >= 1) {
            if (board[rowIdx][colIdx].id === 1) {
                board[rowIdx][colIdx] = {
                    ...board[rowIdx][colIdx],
                    color: "cyan",
                    isOccupied: true,
                };

                return;
            }
            else if (board[rowIdx][colIdx].id === 2) {
                board[rowIdx][colIdx] = {
                    ...board[rowIdx][colIdx],
                    color: "green",
                    isOccupied: true
                };
                return;
            }
            else if (board[rowIdx][colIdx].id === 3) {
                board[rowIdx][colIdx] = {
                    ...board[rowIdx][colIdx],
                    color: "red",
                    isOccupied: true
                };
                return;
            }
            else if (board[rowIdx][colIdx].id === 4) {
                board[rowIdx][colIdx] = {
                    ...board[rowIdx][colIdx],
                    color: "purple",
                    isOccupied: true
                };
                return;
            }
            else if (board[rowIdx][colIdx].id === 5) {
                board[rowIdx][colIdx] = {
                    ...board[rowIdx][colIdx],
                    color: "yellow",
                    isOccupied: true
                };
                return;
            }
            else if (board[rowIdx][colIdx].id === 6) {
                board[rowIdx][colIdx] = {
                    ...board[rowIdx][colIdx],
                    color: "coral",
                    isOccupied: true
                };
                return;
            }
            else if (board[rowIdx][colIdx].id === 7) {
                board[rowIdx][colIdx] = {
                    ...board[rowIdx][colIdx],
                    color: "Gold",
                    isOccupied: true
                };
                return;
            }
            else if (board[rowIdx][colIdx].id === 8) {
                board[rowIdx][colIdx] = {
                    ...board[rowIdx][colIdx],
                    color: "OrangeRed",
                    isOccupied: true
                };
                return;
            }
        }
        else {
            board[rowIdx][colIdx] = {
                ...board[rowIdx][colIdx],
                color: advanceColor(board[rowIdx][colIdx]),
                isOccupied: true
            }
            let newBoard = board.slice();
            newBoard[rowIdx] = board[rowIdx];

            setBoardState({
                ...boardState,
                board: newBoard,
            });
        }
        handleClickRecursive(board, rowIdx + 1, colIdx)
        handleClickRecursive(board, rowIdx + 1, colIdx + 1)
        handleClickRecursive(board, rowIdx, colIdx + 1)
        handleClickRecursive(board, rowIdx - 1, colIdx + 1)
        handleClickRecursive(board, rowIdx - 1, colIdx - 1)
        handleClickRecursive(board, rowIdx - 1, colIdx)
        handleClickRecursive(board, rowIdx, colIdx - 1)
        handleClickRecursive(board, rowIdx + 1, colIdx - 1)

        return;
    }


    function handleClick(rowIdx, colIdx) {
        let path = [];
        if( boardState.haveAWinner )
            return;

        numClicks += 1;
        let board = boardState.board;
        let affectedRow = board[rowIdx].slice();
        if(affectedRow[colIdx].isMine) {
            setStart(false);
            return lost();
        }
        if(board[rowIdx][colIdx].isOccupied){
            return;
        }

        handleClickRecursive(board, rowIdx, colIdx);

            let counter = 0;

        let checker = haveAWinner();
        if(checker) {
            setStart(false);
            setBoardState(boardState => ({
                ...boardState,
                haveAWinner: true,
                winnerColor: 'red',
                start:false
            }));
            numClicks = 0;

        }
    }

    function haveAWinner(){
        let checker = true;
        for (let i = 0; i < boardState.board.length; i++){
            for(let j = 0; j < boardState.board.length; j++){
                //console.log(boardState.board[i][j]);
                if((boardState.board[i][j].isOccupied === false)){
                    checker = false;
                }
            }
        }
        return checker;
    }

    function CreateBoard(){
        if(boardState.start && boardState.time === 0) {
            return (<table border={1} align="center">
                <tbody>
                {
                    boardState.board.map((row, rowIdx) => (<Row key={uniqueKey()}
                                                                row={row}
                                                                rowIdx={rowIdx}
                                                                handleClick={handleClick}
                    />))

                }
                </tbody>
            </table>)
        }
        return (<table></table>)
    }

    //https://medium.com/codex/react-stopwatch-10bf9813d0ec Stopwatch useEffect source
    useEffect(() => {
        let interval = null;
        boardState.time = time
        if (start) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 10)
            }, 1000)
        } else{
            clearInterval(interval);
        }
        return () => clearInterval((interval))
    }, [start])



    return (

        <Fragment>
            <h1 align="center">Sweeper</h1>
            <h1 align="center">
                <h1 align="center">
                    <span>{("0" + (time/10) % 1000)}</span>
                </h1>
                <button onClick={() => cheat()}>cheat</button>
            <button align="center" onClick={() => small()}>small</button>
            <button align="center" onClick={() => med()}>medium</button>
            <button align="center" onClick={() => large()}>large</button>

            </h1>
            <TopMessage
                        time={boardState.time}
                        winnerColor={boardState.winnerColor}
                        haveAWinner={boardState.haveAWinner}
                        start={boardState.start}
                        isALoss={boardState.isALoss}
           />
            <CreateBoard

                />
        </Fragment>

    );
}

/*
function generateMines(board){
    if(board.length === 8) {
        board[0][2] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:0, column: 2 }
        board[0][6] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:0, column: 6 }
        board[1][0] = {color: "gray", isOccupied: false, isMine: false, id: 3, row:1, column: 0 }
        board[1][1] = {color: "gray", isOccupied: false, isMine: false, id: 3, row:1, column: 1 }
        board[1][2] = {color: "gray", isOccupied: false, isMine: false, id: 2, row:1, column: 2 }
        board[1][6] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:1, column: 6 }
        board[1][7] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:1, column: 7 }
        board[2][0] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:2, column: 0 }
        board[2][2] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:2, column: 2 }
        board[3][0] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:3, column: 0 }
        board[3][1] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:3, column: 1 }
        board[3][2] = {color: "gray", isOccupied: false, isMine: false, id: 2, row:3, column: 2 }
        board[3][3] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:3, column: 3 }
        board[3][4] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:3, column: 4 }
        board[4][2] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:4, column: 2 }
        board[4][4] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:4, column: 4 }
        board[5][2] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:5, column: 2 }
        board[5][3] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:5, column: 3 }
        board[5][4] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:5, column: 4 }
        board[5][5] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:5, column: 5 }
        board[5][6] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:5, column: 6 }
        board[5][7] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:5, column: 7 }
        board[6][5] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:6, column: 5 }
        board[6][7] = {color: "gray", isOccupied: false, isMine: false, id: 2, row:6, column: 7 }
        board[7][5] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:7, column: 5 }
        board[7][6] = {color: "gray", isOccupied: false, isMine: false, id: 2, row:7, column: 6 }



        board[0][0] = {color: "gray", isOccupied: true, isMine:true, row: 0, column: 0}
        board[7][7] = {color: "gray", isOccupied: true,isMine:true, row: 7, column: 7}
        board[4][3] = {color: "gray", isOccupied: true,isMine:true, row: 4, column: 3}
        board[2][1] = {color: "gray", isOccupied: true,isMine:true, row: 2, column: 1}
        board[6][6] = {color: "gray", isOccupied: true,isMine:true, row: 6, column: 6}
        board[0][7] = {color: "gray", isOccupied: true,isMine:true, row: 0, column: 7}
        board[0][1] = {color: "gray", isOccupied: true,isMine:true, row: 0, column: 1}
    }
    if(board.length === 7){
        board[0][0] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:0, column: 0 }
        board[0][2] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:0, column: 2 }
        board[0][4] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:0, column: 4 }
        board[0][6] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:0, column: 6 }
        board[1][0] = {color: "gray", isOccupied: false, isMine: false, id: 2, row:1, column: 0 }
        board[1][1] = {color: "gray", isOccupied: false, isMine: false, id: 2, row:1, column: 1 }
        board[1][2] = {color: "gray", isOccupied: false, isMine: false, id: 2, row:1, column: 2 }
        board[1][4] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:1, column: 4 }
        board[1][5] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:1, column: 5 }
        board[1][6] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:1, column: 6 }
        board[2][0] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:2, column: 0 }
        board[2][2] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:2, column: 2 }
        board[3][0] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:3, column: 0 }
        board[3][1] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:3, column: 1 }
        board[3][2] = {color: "gray", isOccupied: false, isMine: false, id: 2, row:3, column: 2 }
        board[3][3] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:3, column: 3 }
        board[3][4] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:3, column: 4 }
        board[4][2] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:4, column: 2 }
        board[4][4] = {color: "gray", isOccupied: false, isMine: false, id: 2, row:4, column: 4 }
        board[4][5] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:4, column: 5 }
        board[4][6] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:4, column: 6 }
        board[5][2] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:5, column: 2 }
        board[5][3] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:5, column: 3 }
        board[5][4] = {color: "gray", isOccupied: false, isMine: false, id: 2, row:5, column: 4 }
        board[5][6] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:5, column: 6 }
        board[6][4] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:6, column: 4 }
        board[6][5] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:6, column: 5 }
        board[6][6] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:6, column: 6 }

        board[4][3] = {color: "gray", isOccupied: true,isMine:true, row: 4, column: 3}
        board[4][3] = {color: "gray", isOccupied: true,isMine:true, row: 4, column: 3}
        board[2][1] = {color: "gray", isOccupied: true,isMine:true, row: 2, column: 1}
        board[5][5] = {color: "gray", isOccupied: true,isMine:true, row: 6, column: 6}
        board[0][5] = {color: "gray", isOccupied: true,isMine:true, row: 0, column: 5}
        board[0][1] = {color: "gray", isOccupied: true,isMine:true, row: 0, column: 1}
    }
    if(board.length === 6) {
        board[0][2] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:0, column: 2 }
        board[1][0] = {color: "gray", isOccupied: false, isMine: false, id: 3, row:1, column: 0 }
        board[1][1] = {color: "gray", isOccupied: false, isMine: false, id: 3, row:1, column: 1 }
        board[1][2] = {color: "gray", isOccupied: false, isMine: false, id: 2, row:1, column: 2 }
        board[2][0] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:2, column: 0 }
        board[2][2] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:2, column: 2 }
        board[3][0] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:3, column: 0 }
        board[3][1] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:3, column: 1 }
        board[3][2] = {color: "gray", isOccupied: false, isMine: false, id: 2, row:3, column: 2 }
        board[3][3] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:3, column: 3 }
        board[3][4] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:3, column: 4 }
        board[4][2] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:4, column: 2 }
        board[4][4] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:4, column: 4 }
        board[5][2] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:5, column: 2 }
        board[5][3] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:5, column: 3 }
        board[5][4] = {color: "gray", isOccupied: false, isMine: false, id: 1, row:5, column: 4 }

        board[0][0] = {color: "gray", isOccupied: true,isMine:true, row: 0, column: 0}
        board[4][3] = {color: "gray", isOccupied: true,isMine:true, row: 4, column: 3}
        board[2][1] = {color: "gray", isOccupied: true,isMine:true, row: 2, column: 1}
        board[0][1] = {color: "gray", isOccupied: true,isMine:true, row: 0, column: 1}
    }
    return console.log("end of generation");
}*/
/*           if (affectedRow[colIdx].id === 1){
               affectedRow[colIdx] = {
                   ...affectedRow[colIdx],
                   color: "blue",
                   isOccupied: true
               };
           }
       if (affectedRow[colIdx].id === 2){
           affectedRow[colIdx] = {
               ...affectedRow[colIdx],
               color: "green",
               isOccupied: true
           };
       }
       if (affectedRow[colIdx].id === 3){
           affectedRow[colIdx] = {
               ...affectedRow[colIdx],
               color: "red",
               isOccupied: true
           };
       }*/
/*            if(colIdx === board.length - 1) {
                alert("test");
                if(affectedRow[colIdx-1].isMine){
                    affectedRow[colIdx] = {
                        ...affectedRow[colIdx],
                        color: "blue",
                        isOccupied: true
                    }
                }

                /*if (affectedRow[colIdx + 1].isMine) {
                    console.log("1 mine")
                    affectedRow[colIdx] = {
                        ...affectedRow[colIdx],
                        color: "blue",
                        isOccupied: true
                    };
            }*/
//console.log(`existing cell after change of color contains ${JSON.stringify(affectedRow[colIdx])}`);


/*       let newBoard = board.slice();
       newBoard[rowIdx] = board;

       setBoardState({
           ...boardState,
           board: newBoard,
       });*/


/*    affectedRow[colIdx] = {
        ...affectedRow[colIdx],
        color: advanceColor(affectedRow[colIdx].color),
        isOccupied: true
    };

*/
//        if(board[rowIdx][colIdx].row < board.length) {
//           if(board[rowIdx][colIdx].column < board.length) {
/*
                if(rowIdx >= board.length){
                    return;
                }
                if(rowIdx <= -1){
                    return;
                }


                //down
                if (!board[rowIdx + 1][colIdx].isOccupied) {
                    console.log(`down ${rowIdx} ${colIdx}`);

                     handleClickRecursive(board, rowIdx + 1, colIdx)
                }
                //down right

                if (!board[rowIdx + 1][colIdx + 1].isOccupied) {
                    console.log(`down right ${rowIdx} ${colIdx}`);
                     handleClickRecursive(board, rowIdx + 1, colIdx + 1)
                }
                //right

                if (!board[rowIdx][colIdx + 1].isOccupied) {
                    console.log(`right ${rowIdx} ${colIdx}`);
                     handleClickRecursive(board, rowIdx, colIdx + 1)
                }
                //up right

                if (!board[rowIdx - 1][colIdx + 1].isOccupied) {
                    console.log(`up right ${rowIdx} ${colIdx}`);
                     handleClickRecursive(board, rowIdx - 1, colIdx + 1)
                }
                //up

                if (!board[rowIdx - 1][colIdx].isOccupied) {
                    console.log(`up ${rowIdx} ${colIdx}`);
                     handleClickRecursive(board, rowIdx - 1, colIdx)
                }
                //up left

                if (!board[rowIdx - 1][colIdx - 1].isOccupied) {
                    console.log(`up left${rowIdx} ${colIdx}`);
                     handleClickRecursive(board, rowIdx - 1, colIdx - 1)
                }
                //left
                if (!board[rowIdx][colIdx - 1].isOccupied) {
                    console.log(`left ${rowIdx} ${colIdx}`);
                     handleClickRecursive(board, rowIdx, colIdx - 1)
                }
                //bottom left
                if (!board[rowIdx + 1][colIdx - 1].isOccupied) {
                    console.log(`bot left ${rowIdx} ${colIdx}`);
                     handleClickRecursive(board, rowIdx + 1, colIdx - 1)
                }
 //           }*/
//        }
/*
if(board.length === 6){
board[0][0] = {color: "black", isOccupied: true,isMine:true, row: 0, column: 0}
board[4][3] = {color: "black", isOccupied: true,isMine:true, row: 4, column: 3}
board[2][1] = {color: "black", isOccupied: true,isMine:true, row: 2, column: 1}
board[0][1] = {color: "black", isOccupied: true,isMine:true, row: 0, column: 1}
}
if(board.length === 7){
board[4][3] = {color: "black", isOccupied: true,isMine:true, row: 4, column: 3}
board[2][1] = {color: "black", isOccupied: true,isMine:true, row: 2, column: 1}
board[5][5] = {color: "black", isOccupied: true,isMine:true, row: 6, column: 6}
board[0][5] = {color: "black", isOccupied: true,isMine:true, row: 0, column: 5}
board[0][1] = {color: "black", isOccupied: true,isMine:true, row: 0, column: 1}
}
if(board.length === 8) {
board[0][0] = {color: "black", isOccupied: true, isMine:true, row: 0, column: 0}
board[7][7] = {color: "black", isOccupied: true,isMine:true, row: 7, column: 7}
board[4][3] = {color: "black", isOccupied: true,isMine:true, row: 4, column: 3}
board[2][1] = {color: "black", isOccupied: true,isMine:true, row: 2, column: 1}
board[6][6] = {color: "black", isOccupied: true,isMine:true, row: 6, column: 6}
board[0][7] = {color: "black", isOccupied: true,isMine:true, row: 0, column: 7}
board[0][1] = {color: "black", isOccupied: true,isMine:true, row: 0, column: 1}
}*//*
            if(board.length === 8) {
                board[0][0] = {color: "gray", isOccupied: true, isMine:true, row: 0, column: 0}
                board[7][7] = {color: "gray", isOccupied: true,isMine:true, row: 7, column: 7}
                board[4][3] = {color: "gray", isOccupied: true,isMine:true, row: 4, column: 3}
                board[2][1] = {color: "gray", isOccupied: true,isMine:true, row: 2, column: 1}
                board[6][6] = {color: "gray", isOccupied: true,isMine:true, row: 6, column: 6}
                board[0][7] = {color: "gray", isOccupied: true,isMine:true, row: 0, column: 7}
                board[0][1] = {color: "gray", isOccupied: true,isMine:true, row: 0, column: 1}
            }
            if(board.length === 7){
                board[4][3] = {color: "gray", isOccupied: true,isMine:true, row: 4, column: 3}
                board[2][1] = {color: "gray", isOccupied: true,isMine:true, row: 2, column: 1}
                board[5][5] = {color: "gray", isOccupied: true,isMine:true, row: 6, column: 6}
                board[0][5] = {color: "gray", isOccupied: true,isMine:true, row: 0, column: 5}
                board[0][1] = {color: "gray", isOccupied: true,isMine:true, row: 0, column: 1}
            }
            if(board.length === 6){
                board[0][0] = {color: "gray", isOccupied: true,isMine:true, row: 0, column: 0}
                board[4][3] = {color: "gray", isOccupied: true,isMine:true, row: 4, column: 3}
                board[2][1] = {color: "gray", isOccupied: true,isMine:true, row: 2, column: 1}
                board[0][1] = {color: "gray", isOccupied: true,isMine:true, row: 0, column: 1}
            }*/