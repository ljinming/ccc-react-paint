import React from "react";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import UndoIcon from "@material-ui/icons/Undo";
import { Dialog, TextField, Button, DialogContent, DialogActions } from "@material-ui/core";
import "./index.less";
import { useContext } from "react";
import { DispatcherContext } from "../../../context";
import { RESIZE } from "../../../util/dispatcher/event";

export const style_other: any = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 454,
  height: 254,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

const OtherOperator = () => {
  const [open, setOpen] = React.useState(false);
  const [width, setWidth] = React.useState(null);
  const [height, setHeight] = React.useState(null);

  const dispatcherContext = useContext(DispatcherContext);

  const setResize = () => {
    dispatcherContext.dispatcher.dispatch(RESIZE, { width, height });
  };

  const handleResize = () => {
    setOpen(false);
    setResize();
  };

  return (
    <span title="resize">
      <span
        onClick={() => {
          setOpen(true);
        }}
      >
        RESIZE
      </span>
      <Dialog
        open={open}
        aria-describedby="modal-description"
        onClose={() => setOpen(false)}
        aria-labelledby="Resize Graphic"
      >
        <div className="resize-content">
          <div className="resize-content-body">
            <TextField
              className="resize-content-input"
              value={width}
              id="outlined-basic"
              label="width (px)"
              variant="outlined"
              onChange={(e: any) => {
                setWidth(e.target.value);
              }}
            />
            <span className="x">X</span>
            <TextField
              value={height}
              onChange={(e: any) => {
                setHeight(e.target.value);
              }}
              className="resize-content-input"
              id="outlined-basic"
              label="height (px)"
              variant="outlined"
            />
          </div>

          <div className="resize-content-footer">
            <Button
              color="primary"
              variant="outlined"
              className="resize-content-celBtn"
              autoFocus
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button color="primary" variant="outlined" className="resize-content-okBtn" onClick={handleResize}>
              Resize
            </Button>
          </div>
        </div>
      </Dialog>
    </span>
  );
};

export default OtherOperator;
