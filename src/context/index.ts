


/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";




export const ToolTypeContext = createContextt({
  select:"PEN"
  setSelect: (type: string) => {}
});


export const FillContext = createContext({
  fillColor: "black",
  setFillColor: (type: string) => {}
});

