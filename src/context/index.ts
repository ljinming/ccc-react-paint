


/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";




export const ToolTypeContext = createContext({
  select:"PEN",
  setSelect: (type: string) => { }
});


export const StrawContext = createContext({
  strawFlag: false,
   strawColor: '',
  setStrawColor: (type: string) => { },
  setStrawFlag: (type: boolean) => {},
});

