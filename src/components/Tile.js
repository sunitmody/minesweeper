import { useState, useEffect } from 'react';

function Tile(props) {
  return (
    <div id="tile" className={props.something}></div>
  )
}

export default Tile;