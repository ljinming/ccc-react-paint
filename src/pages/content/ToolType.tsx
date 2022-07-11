import { ToolTypeList } from "../utils";
import { getToolIcon } from "../utils/tool";
import { toolItem } from "../utils/tsType";
//import Action from "@/action";

interface ToolProps {
  prefix: string;
  select?: string;
  color?: string;
}

const ToolType = (props: ToolProps) => {
  const { prefix, select, color } = props;

  return (
    <ul className={`${prefix}-tool`}>
      {ToolTypeList.map((va: toolItem) => {
        return (
          <li
            title={va.title}
            className={`${
              select === va.key ? "tool-item select" : "tool-item"
            }`}
            key={va.key}
            onClick={() => {
              // Action.emit("paint.tool", {
              //   select: va.key,
              // });
            }}
          >
            <span style={{ position: "relative", display: "inline-block" }}>
              {getToolIcon(va.icon)}
              {va.key === "BUCKET" && (
                <span
                  className="bucket-icon"
                  //style={{ backgroundColor: color }}
                />
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default ToolType;
