import {ShapeToolType} from "../toolType";
import Tool, {Point, getMousePos, getTouchPos, hexToRgb, updateImageData} from "./tool";


// interface propsInput = { 
//             x?: number,
//             y?: Number,
//             maxWidth?:Number
// }

class Text extends Tool {
	private isMouseDown = false;
    private saveImageData?: ImageData;
	private _x:number;
	private _y: number;
	private textContent: string;
	private textBox:any
    private fontStyle: any
    public constructor(fontType: any) {
        super();
		this._x = NaN;
		this._y = NaN;
		this.textBox = document.getElementById("textBox");
        this.textContent = ''
        this.fontStyle =fontType
   
    }

	private drawing(x: number, y: number ) {
		const context = Tool.ctx;
		if (!context) {
			return;
		} else {
			// 设置画笔的颜色和大小
			context.fillStyle = "red";  // 填充颜色为红色
			context.strokeStyle = "blue";  // 画笔的颜色
			context.lineWidth = 5;  // 指定描边线的宽度

			context.save();
			context.beginPath();

			// 写字
			context.font = "28px orbitron";
			context.fillText(this.textContent, parseInt(this.textBox.style.left), parseInt(this.textBox.style.top));
			context.restore();
			context.closePath();
		}
	}


	public onMouseDown(event: MouseEvent): void {
		// 鼠标按下位置保存
        console.log('====3', event)
        console.log('======56',this.textBox)
		
        // event.preventDefault();

	if (this.isMouseDown) {
        this.textContent = this.textBox.value;
        this.isMouseDown = false;
        this.textBox.style['z-index'] = 1;
        this.textBox.style.visibility= 'hidden'
        this.drawing(this._x, this._y);
        this.textBox.value = "";
    } else if (!this.isMouseDown) {
        this._x = event.offsetX;  // 鼠标按下时保存当前位置，为起始位置
        this._y = event.offsetY;
        this.isMouseDown = true
        if (typeof this.fontStyle === 'object') { 
            Object.keys(this.fontStyle).forEach(va => { 
                this.textBox.style[va] = this.fontStyle[va]
            })
        }
        this.textBox.style.left = this._x + 'px';
        this.textBox.style.top = this._y + 'px';
        this.textBox.style['z-index'] = 6;
        this.textBox.style.visibility= 'visible'

	}
    }

}

export default Text;
