import { useState } from "react";

const PropDebugger = ({ propsToDebug }) => {
  const [showProps, setShowProps] = useState(false);

  const handleChange = (e) => {
    setShowProps(!showProps);
  };

  return (
    <>
      <style>
        {`
          .checkboxes label {
            display: inline-block;
            padding-right: 10px;
            white-space: nowrap;
          }
          .checkboxes input {
            vertical-align: middle;
          }
          .checkboxes label span {
            vertical-align: middle;
          }
        `}
      </style>

      <div
        style={{
          fontSize: "small",
          border: "1px solid #ccc",
          padding: "8px",
          margin: "5px 0px",
          width: "100%",
        }}
      >
        <div className="checkboxes" style={{ width: "100%" }}>
          <label
            style={{
              marginLeft: "5px",
              alignItems: "center",
              width: "100%",
            }}
          >
            <input
              type={"checkbox"}
              style={{ marginRight: "5px" }}
              id={"showProps"}
              value="show"
              defaultChecked={showProps}
              onClick={(e) => handleChange(e)}
            />
            Show debug props
          </label>
        </div>

        {showProps ? (
          <>
            <div
              style={{
                margin: "5px 0px",
                height: "200px",
                overflowX: "auto",
                borderTop: "1px solid #ccc",
                padding: "5px 0px 0px 0px",
              }}
            >
              <pre>
                {Object.keys(propsToDebug).map((key, index) => {
                  return (
                    <pre key={index} style={{ margin: "5px 0px" }}>
                      {key}: {JSON.stringify(propsToDebug[key], null, 2)}
                      <br />
                    </pre>
                  );
                })}
              </pre>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default PropDebugger;