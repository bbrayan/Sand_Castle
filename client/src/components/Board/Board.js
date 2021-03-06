import React, {useEffect, useState, useRef} from 'react';

import './Board.css';


const Board = ({ color, size, base64ImageData, imgFlag, setColor, setSize, setBase64ImageData, setImgFlag, sendImage }) =>{
    //example of refrence keep track of refrence to elements or any kind of information really
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const boardContainerRef = useRef(null);
    const timeoutRef = useRef()
    const [isDrawing, setIsDrawing] = useState(false);
    //refrence helped fix a bug as board is being constantly refreshed Keep a note of that
    const mouse = useRef({x: 0, y: 0});
    const last_mouse = useRef({x: 0, y: 0});

    useEffect(() =>{
        const canvas = canvasRef.current;
        canvas.width = parseInt(getComputedStyle(boardContainerRef.current).getPropertyValue('width'));
        canvas.height = parseInt(getComputedStyle(boardContainerRef.current).getPropertyValue('height'));
        canvasRef.current.addEventListener('mousemove', function(e) {
            last_mouse.current.x = mouse.current.x;
            last_mouse.current.y = mouse.current.y;
    
            mouse.current.x = e.pageX - this.offsetLeft;
            mouse.current.y = e.pageY - this.offsetTop;
        }, false);

        const context =canvas.getContext("2d");
        context.lineWidth = size;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.strokeStyle = color;
        contextRef.current = context;
    }, [])

    useEffect(() =>{
        if(!imgFlag){return}
        var interval = setInterval(function(){
            if(isDrawing) return;
            setIsDrawing(true);
            clearInterval(interval);
            var image = new Image();
            image.onload = function() {
                contextRef.current.drawImage(image, 0, 0);
                setIsDrawing(false);
            };
            image.src = base64ImageData;
            setImgFlag(false);
        }, 200)

    },[imgFlag])
    

    useEffect(() =>{
        contextRef.current.lineWidth = size;
        contextRef.current.strokeStyle = color;
    },[color,size])
    
    const startDrawing  = () =>{
        contextRef.current.beginPath();
        contextRef.current.moveTo(last_mouse.current.x, last_mouse.current.y);
        console.log(last_mouse.current.x, last_mouse.current.y);
        setIsDrawing(true);
    }

    const finishDrawing  = () =>{
        contextRef.current.closePath();
        setIsDrawing(false);
    }
    
    const draw = () =>{
        if(!isDrawing){
            return
        }
        contextRef.current.lineTo(mouse.current.x, mouse.current.y);
        contextRef.current.stroke();
        
        if(timeoutRef.current != undefined) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(function(){
            console.log('img saved');
            setBase64ImageData(canvasRef.current.toDataURL("image/png"));
            sendImage();
            clearTimeout(timeoutRef.current);
        }, 1000)
        
    }
    
    //using hooks for inputs
    return (
        <div className="container">
            <div className="tools-section">
                <div className="colorPickerContainer">
                    <input type="color"
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                    ></input>
                </div>
                <div className="brushsize-container">
                        Select Brush Size : &nbsp; 
                        <select value={size} onChange={(event) => setSize(event.target.value)}>
                            <option> 5 </option>
                            <option> 10 </option>
                            <option> 15 </option>
                            <option> 20 </option>
                            <option> 25 </option>
                            <option> 30 </option>
                        </select>
                    </div>
                    </div>
                <div className="boardContainer" id="boardContainer" ref={boardContainerRef}>
                    <canvas className="board" id="board"
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseUp={finishDrawing}
                        onMouseMove={draw}
                    ></canvas>
                </div>
        </div>
    )
}

export default Board;