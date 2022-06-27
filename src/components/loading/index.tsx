import "./index.less";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";

export default () => {
  return (
    <div className="ccc-message" id="ccc-loading">
      <div className="ccc-message-loading">
        <LoadingOutlined style={{ color: "blue ", fontSize: 14 }} />
        <span>Loading</span>
      </div>
    </div>
  );
};
