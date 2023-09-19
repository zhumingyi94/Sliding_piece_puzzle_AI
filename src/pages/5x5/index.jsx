import Head from 'next/head'
import Image from 'next/image'
// import styles from '@/styles/Home.module.css'
import React, { useState } from "react";
import styles from './puzzle.module.css'
import {AStar, matrixize} from '../Astar5'


export default function Home() {
    const [matrixInitialState, setMatrixInitialState] = useState(null);
    const [userMatrix, setUserMatrix] = useState();
    const [puzzle, setPuzzle] = React.useState([]);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        // onInputChange(inputValue); // Pass the input value to the parent component
        console.log(inputValue);
        setUserMatrix(inputValue);
    }

    
    
    const goal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0];

    const handleClick = () => {
        setMatrixInitialState(userMatrix);
        if (matrixInitialState != null) {
            const array = matrixInitialState.split(' ').map(Number);
            const solution = AStar(array, goal);
    
            // Use a delay between each step of the solution
            solution.forEach((step, i) => {
                setTimeout(() => {
                    setPuzzle(matrixize(step));
                }, i * 1200); // Adjust the delay as needed (e.g., 1000 milliseconds for a 1-second delay)
            });
        }
    }

    

  
    return (
        <>
            <h1 className={styles.text}>SET INITIAL STATE</h1>
            {/* <InputForm onInputChange={handleInputChange} /> */}
            <div className={styles.input_box}>
                <input type="text" required="required" onChange={handleInputChange}></input>
            </div>
            <div className={styles.container}>
                <button className={styles.button_style} onClick={handleClick}>Get the solution</button>
            </div>
            {/* <ConfirmButton onConfirmClick={handleConfirmClick} /> */}
        
            {matrixInitialState && (
                <div className={styles.puzzle_container}>
                    <div
                        style={{
                            display: "inline-block",
                            backgroundColor: "white",
                            // border: `5px solid ${complete ? "black" : "gray"}`,
                            border: '2px solid #0f172a',
                            boxShadow: '5px 5px 0 0 white, 7px 7px 0 0 #0f172a',
                            padding: 5
                        }}
                    >
                        {puzzle && puzzle.map((row, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex"
                                }}
                            >
                                {row.map((col, j) => {
                                    const color = col === 0 ? "transparent" : "lightgray";
                                    return (
                                        <div
                                            key={`${i}-${j}`}
                                            // onClick={() => movePiece(i, j)}
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                width: 75,
                                                height: 75,
                                                margin: 3,
                                                backgroundColor: '#ECECEC',
                                                fontFamily: "monospace",
                                                // cursor: complete ? "not-allowed" : "pointer",
                                                userSelect: "none"
                                            }}
                                        >
                                            <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
                                                {col !== 0 && col}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )} 
        </>
    );
}