const Loading = () => {
  return (
    // <Space
    //   style={{
    //     width: "100vw",
    //     height: "100vh",
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //   }}
    // >
    //   <Spin size="large" style={{ height: 400 }} />
    // </Space>
    <div className="fixed inset-0 flex items-center justify-center bg-primaryText bg-opacity-90 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
    </div>
  );
};

export default Loading;
