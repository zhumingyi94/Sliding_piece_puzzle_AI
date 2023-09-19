import React from "react"
import styles from './nav.module.css'



function Button({text, to}) {
    return (
        <a href={to}>
        <button className = {styles.nav_button}>
            {text}
        </button>
        </a>
    );
}

function Navigation() {
    return (
      <div>
        <h1 className = {styles.sth}>CHOOSE SIZE</h1>
        <div className = {styles.container}>
        <Button text="3x3" to = "./3x3"/>
        <Button text="4x4" to = "./4x4"/>
        <Button text="5x5" to = "./5x5"/>
        </div>
      </div>
    );
  }

export default function FullPage() {
    return(
    <div className={styles.pageContainer}>
        <Navigation />
      </div>
    );
}