import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Victory from "../../assets/victory.svg";
import Background from "../../assets/login2.png";
import { TabsContent } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTES, SIGNUP_ROUTES } from "@/lib/constants";
import { useNavigate } from "react-router-dom";


const Auth = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 
  const navigate = useNavigate()


  const validateLogin = () => {
    if(!email.length) {
      toast.error("Please enter an email")
        return false        
      }
      if(!password.length) {toast.warning("Please enter a password")
        return false
      }
        return true
    }


  const validateSignUp = () => {
  if(!email.length) {
    toast.error("Please enter an email")
      return false        
    }
    if(!password.length) {toast.warning("Please enter a password")
      return false
    }
    if(confirmPassword !== password) {toast.warning("Password and confirm password do not match")
      return false
    }
      return true
    }


  const handleLogin  = async () => { 
if (validateLogin()){
  const response = await apiClient.post(LOGIN_ROUTES,{email,password},{withCredentials: true});
console.log(response)
  if(response.profileSetup) navigate("/chat") 
  else navigate("/profile")
}

  }

  const handleSignUp = async () => { 
    if (validateSignUp()) {
      try { 
        const response =  await apiClient.post(SIGNUP_ROUTES, {email, password}, {withCredentials: true});
        console.log(response);
        if(response.status === 201) navigate("/profile") 
        alert("Sign up successful");
        } catch (error) {
        console.log("Error", error);
      }
    }
  }

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] w-[80vw] bg-white border-2 border-white text-opacity-90 shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex flex-col  items-center justify-center">
          <div className="flex items-center justify-center">
            <h1 className="text-5xl font-bold md:text-6xl ">Welcome</h1>
            <img src={Victory} className="h-[100px]" />
          </div>
          <p className="font-medium text-center">
            Fill in the details to get started with the best chat application
          </p>
        </div>
        <div className="flex item-center justify-center w-full">
          <Tabs className="w-3/4" defaultValue="login"> 
            <TabsList className="bg-transparent rounded-none w-full">
              <TabsTrigger value="login" className="data-[state=active]:bg-transparent text-black 
              text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500
              p-3 transition-all duration-300" >Login</TabsTrigger>
              <TabsTrigger value="signUp" className="data-[state=active]:bg-transparent text-black 
              text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500
              p-3 transition-all duration-300">SignUp</TabsTrigger>
            </TabsList>
            <TabsContent className="flex flex-col gap-5 mt-10" value="login">
              <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} /> 
              <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} /> 
              <Button className="flex flex-col gap-5 " onClick={handleLogin}>Login</Button>
            </TabsContent>
            <TabsContent className="flex flex-col gap-5 " value="signUp">
            <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)}  /> 
            <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} /> 
            <Input placeholder="Confirm Password" type="password" className="rounded-full p-6" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /> 
            <Button className="flex flex-col gap-5 " onClick={handleSignUp} >SignUp</Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className=" hidden xl:flex items-center justify-center" >
         <img src={Background} className="h-[700px]" />
      </div>
    </div>
  </div>
  );
};

export default Auth;
