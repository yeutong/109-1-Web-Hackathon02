import React, { Component } from 'react';
import ReactLoading from "react-loading";
import { Fireworks } from 'fireworks/lib/react'

import "./Sudoku.css"
import Header from '../components/Header';
import Grid_9x9 from '../components/Grid_9x9';
import ScreenInputKeyBoard from '../components/ScreenInputKeyBoard'
import { problemList } from "../problems"

class Sudoku extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true, // Return loading effect if this is true.
            problem: null, // Stores problem data. See "../problems/" for more information.This is the origin problem and should not be modified. This is used to distinguish the fixed numbers from the editable values
            gridValues: null,  // A 2D array storing the current values on the gameboard. You should update this when updating the game board values.
            selectedGrid: { row_index: -1, col_index: -1 }, // This objecct store the current selected grid position. Update this when a new grid is selected.
            gameBoardBorderStyle: "8px solid #000", // This stores the gameBoarderStyle and is passed to the gameboard div. Update this to have a error effect (Bonus #2).
            completeFlag: false, // Set this flag to true when you wnat to set off the firework effect.
            conflicts: [{ row_index: -1, col_index: -1 }] // The array stores all the conflicts positions triggered at this moment. Update the array whenever you needed.
        }
    }

    handle_grid_1x1_click = (row_index, col_index) => {
        // TODO

        // Useful hints:
        // console.log(row_index, col_index);
        // console.log(this.state.selectedGrid);
        // this.setState({ selectedGrid: { row_index: row_index, col_index: col_index } });

        if (this.state.problem.content[row_index][col_index] === "0") {
            this.setState({ selectedGrid: { row_index: row_index, col_index: col_index } });
        }
    }

    checkConflict = (num) => {
        var tmp_gridValues = this.state.gridValues;
        const row_index = this.state.selectedGrid.row_index
        const col_index = this.state.selectedGrid.col_index
        const row_start = this.state.selectedGrid.row_index - this.state.selectedGrid.row_index%3;
        const col_start = this.state.selectedGrid.col_index - this.state.selectedGrid.col_index%3;
        var check = true;
        for (let i = row_start; i < row_start + 3; i++) {
            for (let j = col_start; j < col_start + 3; j++) {
                if (tmp_gridValues[i][j] === num) {
                    check = false;
                }
            }
        }
        for (let i = 0; i <= 8; i++) {
            if (tmp_gridValues[i][col_index] === num) {
                check = false;
            }
        }

        for (let j = 0; j <= 8; j++) {
            if (tmp_gridValues[row_index][j] === num) {
                check = false;
            }
        }
        return check;
    } 

    handleKeyDownEvent = (event) => {
        // TODO

        // Useful hints:
        // console.log(event)
        // console.log(event.keyCode === 48)

        var tmp_gridValues = this.state.gridValues;
        
        if (this.state.gridValues !== null && this.state.selectedGrid.row_index !== -1 && this.state.selectedGrid.col_index !== -1 && ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
            // if (event.keyCode >= 48 && event.keyCode <= 57) {
            //     checkConflict()
            //     // tmp_gridValues[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] = (event.keyCode - 48 === 0) ? '': event.keyCode - 48;
            //     // console.log(tmp_gridValues)
            //     this.setState({ gridValues: tmp_gridValues})
            // } else {
            //     tmp_gridValues[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] = (event.keyCode - 96).toString();
            //     // console.log(tmp_gridValues)
            // }
            var num;
            if (event.keyCode >= 48 && event.keyCode <= 57) {
                num = (event.keyCode - 48).toString()
            } else {
                num = (event.keyCode - 96).toString()
            }

            console.log(this.checkConflict(num));
            if (this.checkConflict(num) || num === "0") {
                // console.log("one time")
                tmp_gridValues[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] = (event.keyCode - 48).toString();
                // console.log(tmp_gridValues)
                this.setState({ gridValues: tmp_gridValues})
            }



        }
        // if (this.state.problem.content[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] === "0") {}
    }

    handleScreenKeyboardInput = (num) => {
        // TODO
        // console.log(num)
        var tmp_gridValues = this.state.gridValues;
        if (this.state.gridValues !== null && this.state.selectedGrid.row_index !== -1 && this.state.selectedGrid.col_index !== -1) {
            // tmp_gridValues[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] = num.toString() ;
            // // console.log(tmp_gridValues)
            // this.setState({ gridValues: tmp_gridValues})

            if (this.checkConflict(num.toString()) || num.toString() === "0") {
                // console.log("one time")
                tmp_gridValues[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] = num.toString();
                // console.log(tmp_gridValues)
                this.setState({ gridValues: tmp_gridValues})
            }
        }
    }

    componentDidMount = () => {
        window.addEventListener('keydown', this.handleKeyDownEvent);
    }

    loadProblem = async (name) => {
        this.setState({
            loading: true,
            problem: null,
            gridValues: null,
            selectedGrid: { row_index: -1, col_index: -1 }
        });

        const problem = await require(`../problems/${name}`)
        if (problem.content !== undefined) {
            let gridValues = [];
            for (let i = 0; i < problem.content.length; i++)
                gridValues[i] = problem.content[i].slice();
            this.setState({ problem: problem, gridValues: gridValues, loading: false });
        }
    }

    extractArray(array, col_index, row_index) {
        let rt = []
        for (let i = row_index; i < row_index + 3; i++) {
            for (let j = col_index; j < col_index + 3; j++) {
                rt.push(array[i][j])
            }
        }
        return rt;
    }

    render() {
        const fxProps = {
            count: 3,
            interval: 700,
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight,
            colors: ['#cc3333', '#81C784'],
            calc: (props, i) => ({
                ...props,
                x: (i + 1) * (window.innerWidth / 3) * Math.random(),
                y: window.innerHeight * Math.random()
            })
        }
        return (
            <>
                <Header problemList={problemList} loadProblem={this.loadProblem} gridValues={this.state.gridValues} problem={this.state.problem} />
                {this.state.loading ? (<ReactLoading type={"bars"} color={"#777"} height={"40vh"} width={"40vh"} />) : (
                    <div id="game-board" className="gameBoard" style={{ border: this.state.gameBoardBorderStyle }}>
                        <div className="row">
                            <Grid_9x9 row_offset={0} col_offset={0}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 0, 0)}
                                fixedValue={this.extractArray(this.state.problem.content, 0, 0)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={0} col_offset={3}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 3, 0)}
                                fixedValue={this.extractArray(this.state.problem.content, 3, 0)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={0} col_offset={6}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 6, 0)}
                                fixedValue={this.extractArray(this.state.problem.content, 6, 0)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />
                        </div>
                        <div className="row">
                            <Grid_9x9 row_offset={3} col_offset={0}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 0, 3)}
                                fixedValue={this.extractArray(this.state.problem.content, 0, 3)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={3} col_offset={3}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 3, 3)}
                                fixedValue={this.extractArray(this.state.problem.content, 3, 3)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={3} col_offset={6}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 6, 3)}
                                fixedValue={this.extractArray(this.state.problem.content, 6, 3)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />
                        </div>
                        <div className="row">
                            <Grid_9x9 row_offset={6} col_offset={0}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 0, 6)}
                                fixedValue={this.extractArray(this.state.problem.content, 0, 6)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={6} col_offset={3}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 3, 6)}
                                fixedValue={this.extractArray(this.state.problem.content, 3, 6)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={6} col_offset={6}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 6, 6)}
                                fixedValue={this.extractArray(this.state.problem.content, 6, 6)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />
                        </div>
                    </div>
                )}
                {this.state.completeFlag ? (<Fireworks {...fxProps} />) : null}
                {this.state.loading ? null : (<ScreenInputKeyBoard handleScreenKeyboardInput={this.handleScreenKeyboardInput} />)}
            </>
        );
    }
}

export default Sudoku;