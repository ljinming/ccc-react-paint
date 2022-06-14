import React, { useState } from "react";
import { Button, Modal, InputNumber } from "antd";
import "./index.less";
import { useContext } from "react";
import { SizeContext } from "@/context";
const OtherOperator = () => {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = React.useState(undefined);
  const [height, setHeight] = React.useState(undefined);
  const sizeContext = useContext(SizeContext);

  const setResize = () => {
    sizeContext.onSize({
      width: Number(width),
      height: Number(height)
    });
  };

  const handleResize = () => {
    setOpen(false);
    setResize();
  };

  return (
    <>
      <Button
        className="size-btn"
        onClick={() => {
          setOpen(true);
        }}
      >
        Resize
      </Button>
      <Modal
        visible={open}
        title="Resize Graphic"
        wrapClassName="resize-modal"
        footer={null}
        width={454}
        onCancel={() => setOpen(false)}
      >
        <div className="resize-content">
          <div className="resize-content-body">
            <InputNumber
              className="resize-content-input"
              value={width}
              max={3000}
              id="outlined-basic"
              onChange={(value: any) => {
                setWidth(value);
              }}
            />
            <span className="x">X</span>
            <InputNumber
              value={height}
              max={3000}
              onChange={(value: any) => {
                setHeight(value);
              }}
              className="resize-content-input"
              id="outlined-basic"
            />
          </div>

          <div className="resize-content-footer">
            <button
              //color="primary"
              // variant="outlined"
              className="resize-content-celBtn"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <Button
              // color="primary"
              // variant="outlined"
              className="resize-content-okBtn"
              onClick={handleResize}
            >
              Resize
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OtherOperator;
