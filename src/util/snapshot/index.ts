const MAX_DATA_LENGTH = 50;

/**
 * 使用两个栈实现canvas前进后退动作
 */
class Snapshot {
  private imageData1: ImageData[] = [];
  private imageData2: ImageData[] = [];
  public add(imageData: ImageData) {
    if (this.imageData1.length === MAX_DATA_LENGTH) {
      this.imageData1.shift();
    }
    this.imageData1.push(imageData);
  }
  public get current() {
    return this.imageData1[this.imageData1.length - 1];
  }
  public back() {
    if (this.imageData1.length > 1) {
      const imageData = this.imageData1.pop() as ImageData;
      this.imageData2.push(imageData);
    }

    return this.imageData1.length > 0 ? this.imageData1[this.imageData1.length - 1] : null;
  }

  public forward() {
    if (this.imageData2.length > 0) {
      const imageData = this.imageData2.pop() as ImageData;
      this.imageData1.push(imageData);
    }
    return this.imageData1.length > 0 ? this.imageData1[this.imageData1.length - 1] : null;
  }
}

export default Snapshot;
