import { FaTrash, FaPlus } from "react-icons/fa";
import { IoArrowBackCircle } from "react-icons/io5";
import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required.");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName,
            lastName,
            color: selectedColor,
          },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          console.log(response.data.user);
          console.log(response.data);
          setUserInfo(...response.data);
          toast.success("Profile updated successfully.");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleNavigate = () => {
  if (userInfo.profileSetup) { 
    navigate("/chat");
}else {
toast.error("Please setup your profile first.");
}
  }

  const handleFileInputClick = () => {
    fileInputRef.current.click()
  }

  const handleImageChange = async(event) => {
    const file = event.target.files[0];
    console.log(file);
  if(file){
    const formData = new FormData()
    formData.append("profile-image", file) 
    const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, { withCredentials: true })
  if(response.status === 200 && response.data.image){
  setUserInfo({ ...userInfo, image: response.data.image })
  toast.success("Profile image updated successfully.")
  }
  
  
  }
}

  const handleDeleteImage = () => {}

  return (
    <div className="bg-[#1b1c24] h-[100vh] white flex items-center justify-center flex-col gap-10 ">
      <div className=" w-[80vh] md:w-max flex flex-col gap-10">
        <div onClick={handleNavigate}>
          <IoArrowBackCircle className="text-4xl lg:text-6xl  text-white text-opacity-90 cursor-pointer " />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-32 md:h-32 relative  flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage className="object-cover w-full h-full bg-black" />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full 
                  ${getColor(selectedColor)}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer" onClick={image ? handleDeleteImage : handleFileInputClick}>
                {image ? (
                  <FaTrash className="text-3xl text-white cursor-pointer" />
                ) : (
                  <FaPlus className="text-3xl text-white cursor-pointer" />
                )}
              </div>
            )}
            <input type="file"  ref={fileInputRef} className="hidden" onChange={handleImageChange} name="profile-image" accept=".png, .jpg, .jpeg, .svg, .gif, .webp"></input>

          </div>
          <div className="flex min-w-32 md:min-w-32 flex-col gap-5 text-white items-center justify-center  ">
            <div className="w-full">
              <Input
                value={userInfo.email}
                type="email"
                disabled
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                placeholder="your email"
              />
            </div>
            <div className="w-full">
              <Input
                value={firstName}
                type="text"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                placeholder="First Name"
              />
            </div>
            <div className="w-full">
              <Input
                value={lastName}
                type="text"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                placeholder="Second Name"
              />
            </div>
            <div className="flex gap-5 w-full">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={` ${color} w-8 h-8 cursor-pointer rounded-full 
                transition-all duration-300 ${
                  selectedColor === index
                    ? "outline outline-white/50 outline-1"
                    : ""
                }`}
                  onClick={() => {
                    setSelectedColor(index);
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <Button
          className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
          onClick={saveChanges}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
};
export default Profile;
