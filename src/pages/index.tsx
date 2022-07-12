import Header from "./header";
import Content from "./content";
import "./index.less";
import "./font.css";
import { useState, useEffect, useImperativeHandle } from "react";
import { Tool } from "../tool";
import { Provider } from "react-redux";
import { store } from "../Action";
interface HomeProps {
  backgroundColor?: string;
  width?: number;
  height?: number;
  imgSrc?: string;
  cRef?: any;
  id: string;
  showArea?: Array<[number, number]> | undefined;
  ThumbSrc?: string;
}

export default (props: HomeProps) => {
  const pre = `core-paint`;
  const {
    imgSrc = "https://bafybeicgvg3vwtv5c633cjexbykjp75yjt755qhma4o7vgusa4ldvocz44.ipfs.dweb.link/orign.png",
    width = 500,
    height = 500,
    cRef,
    id,
    showArea,
    ThumbSrc,
  } = props;

  useImperativeHandle(cRef, () => ({
    getCurrentImageData: () => {
      // const canvasElem: any = document.getElementById(`ccc-paint-canvas ${id}`);
      // const imageData = canvasElem.toDataURL("image/png");
      return Tool.canvas.toDataURL();
    },
  }));

  return (
    <Provider store={store}>
      <div className={pre}>
        <Header pre={pre} />
        <Content
          id={id}
          pre={pre}
          imgSrc={imgSrc}
          showArea={showArea}
          ThumbSrc={ThumbSrc}
          backgroundColor={"#fff"}
        />
      </div>
    </Provider>
  );
};
