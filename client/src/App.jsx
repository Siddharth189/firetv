import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./utils/store";
import Auth from "./components/auth/Auth";
import Home from "./components/Home";
import Curated from "./components/curated playlist/Curated";
import Upload from "./components/upload/Upload";
import ChatRoom from "./components/chat room/ChatRoom";

const App = () => {
  return (
    <Provider store={store}>
      <Outlet />
    </Provider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "curated",
        element: <Curated />,
      },
      {
        path: "upload",
        element: <Upload />,
      },
      {
        path: "chatroom/:id",
        element: <ChatRoom />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
