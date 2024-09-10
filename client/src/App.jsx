import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import { useEffect, useState } from "react";
import { GET_USER_INFO } from "./lib/constants";
import { apiClient } from "./lib/api-client";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthentication = !!userInfo;
  return isAuthentication ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthentication = !!userInfo;
  return isAuthentication ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true});
          console.log("helllloooo")
        if (response.status === 200 && response.data.user.id) {
          console.log("goooooood")
          console.log(response.data.user.id)
          console.log("ooooooooooooooooooooo")
          console.log(response)
          console.log(response.data.user)
          setUserInfo(response.data.user);
        } else {
          console.log("**********************")

          setUserInfo(undefined);
        }
         console.log(response);
      } catch (error) {
        setUserInfo(undefined);
        console.log(error,"517");
      } finally {
        console.log("finally --> useEffect");
       setLoading(false);
      }
    };
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={
              <AuthRoute> <Auth /> </AuthRoute> }  />
          <Route path="/chat" element={
              <PrivateRoute> <Chat /> </PrivateRoute> } />
          <Route path="/profile" element={
              <PrivateRoute> <Profile /> </PrivateRoute> } />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
