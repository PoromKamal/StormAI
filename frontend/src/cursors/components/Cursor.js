import React from 'react'

const Cursor = ({ user }) => {
  return (
    <div
      style={{
        position: "relative",
        pointerEvents: "none",
        userSelect: "none",
        left: 0,
        top: 0,
        zIndex: 1000,
        transition: "transform 0.3s cubic-bezier(.17,.93,.38,1)",
        transform: `translateX(${user.cursor.x}px) translateY(${user.cursor.y}px)`
      }}
    >
      <svg
        className="cursor"
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        stroke="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={user.color}
        />
      </svg>

      <div
        style={{
          backgroundColor: user.color,
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
          {user.name}
        </p>
      </div>
    </div>
  )
}

export default Cursor