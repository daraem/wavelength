window.addEventListener("DOMContentLoaded" , () => {
    let angle = 0
    let desiredAngle = undefined
    let rotate = true
    const angleTop = 65
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext('2d')

    let cageAngle = 0
    let cageEnable = false
    let closed = false

    let selectorAngle = 0

    const rouletteRadius = 750

    const h = window.innerHeight
    const w = window.innerWidth

    let roulette = new Image()
    roulette.src = '/src/roulette.png'
    
    function randomRotation() {
        return Math.floor(Math.random() * angleTop) * (Math.random() > 0.5 ? 1 : -1)
    }

    function rotateImg(deg) {
        ctx.save();

        ctx.translate(w/2, h/2);
        ctx.rotate(deg*Math.PI/180);

        ctx.drawImage(roulette, -rouletteRadius/2, -rouletteRadius/2, rouletteRadius, rouletteRadius)

        ctx.restore();
    }

    function rgb(r,g,b) {
        return "rgb("+r+", "+g+", "+b+")"
    }

    function handleKeyUp(e) {
        switch (e.code) {
            case "Space":
                rotate = true
                desiredAngle = randomRotation()
            default:
                break;
        }
    }

    function handleMouseClick() {
        cageEnable = true
    }

    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("click", handleMouseClick)

    window.addEventListener("wheel", (e) => {
        if (e.deltaY > 0 && selectorAngle <= 0) {
            selectorAngle += 5
        } else if (e.deltaY < 0 && selectorAngle >= -180) {
            selectorAngle -= 5
        }
    })


    run = () => {
        canvas.width = w
        canvas.height = h

        ctx.fillStyle = "gray"
        ctx.fillRect(0, 0, w, h)

        ctx.drawImage(roulette, (w/2) - rouletteRadius/2, (h/2) - rouletteRadius/2, rouletteRadius, rouletteRadius)
        if(desiredAngle != undefined) {
            if(desiredAngle >= 0) {
                if(angle <= desiredAngle + 720 && rotate) {
                    angle += 10
                } else {
                    angle = desiredAngle
                    rotate = false
                }
            } else {
                if(angle >= desiredAngle - 720 && rotate) {
                    angle -= 10
                } else {
                    angle = desiredAngle
                    rotate = false
                }
            }
            rotateImg(angle)
        }

        ctx.fillStyle = rgb(68, 132, 243)
        
        if(cageAngle <= Math.PI && cageEnable && !closed) {
            cageAngle += 0.01
        } else if (cageAngle >= Math.PI && !closed) {
            cageEnable = false
            closed = true
        }


        if(cageEnable && closed && cageAngle >= 0) {
            cageAngle -= 0.01
        } else if (cageAngle <= 0 && closed) {
            closed = false
            cageEnable = false
            cageAngle = 0
        }


        ctx.beginPath();
        ctx.arc(w/2, h/2, rouletteRadius/2, cageAngle, Math.PI * cageAngle);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = rgb(16, 28, 48)
        ctx.fillRect((w/2) - rouletteRadius/2, (h/2), rouletteRadius, rouletteRadius/2)

        ctx.fillStyle = "red"
        ctx.beginPath();
        ctx.arc(w/2, h/2, rouletteRadius/15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        let x = Math.cos(selectorAngle * Math.PI/180) * rouletteRadius/2 + w/2
        let y = Math.sin(selectorAngle * Math.PI/180) * rouletteRadius/2 + h/2

        ctx.strokeStyle = "red"
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(w/2, h/2);
        ctx.lineTo(x, y);

        ctx.stroke();

        requestAnimationFrame(run)
    }
    run()
})

