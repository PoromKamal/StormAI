import React from 'react'

const CursorNode = ({ id, data }) => {
  return (
    <div
      style={{
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 1000,
        transition: "transform 0.5s cubic-bezier(.17,.93,.38,1)",
      }}
    >
      <svg
        className="cursor"
        width="30"
        height="40"
        viewBox="0 0 24 36"
        fill="none"
        stroke="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={data.cursor.color}
        />
      </svg>

      <div
        style={{
          backgroundColor: data.cursor.color,
          borderRadius: 4,
          position: "absolute",
          top: 20,
          left: 10,
          padding: "5px 10px"
        }}
      >
        <p
          style={{
            whiteSpace: "nowrap",
            fontSize: 13,
            color: "white"
          }}
        >
          {data.cursor.name}
        </p>
      </div>
    </div>
  )
}

export default CursorNode