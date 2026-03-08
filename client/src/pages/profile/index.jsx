import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFLE_ROUTE,
} from "@/lib/constants";
import { useState, useRef, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IoArrowBack } from "react-icons/io5";
import { colors } from "@/lib/utils";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(0);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) { toast.error("First Name is Required."); return false; }
    if (!lastName) { toast.error("Last Name is Required."); return false; }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFLE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile Updated Successfully.");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, { withCredentials: true });
      if (response.status === 200 && response.data.image) {
        setUserInfo({ ...userInfo, image: response.data.image });
        toast.success("Image updated successfully.");
      }
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, { withCredentials: true });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image Removed Successfully.");
        setImage(undefined);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleFileInputClick = () => fileInputRef.current.click();

  const handleNavigate = () => {
    if (userInfo.profileSetup) navigate("/chat");
    else toast.error("Please setup profile.");
  };

  return (
    <div
      className="min-h-[100vh] flex items-center justify-center relative overflow-hidden px-4"
      style={{ background: "var(--aura-bg)" }}
    >
      {/* Background orb */}
      <div
        className="absolute pointer-events-none animate-aura-orb"
        style={{
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          borderRadius: "50%", top: "-100px", left: "-100px",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 glass w-full max-w-lg rounded-2xl overflow-hidden animate-slide-in-up"
        style={{ border: "1px solid rgba(124,58,237,0.2)" }}
      >
        {/* Gradient top accent */}
        <div style={{ height: "3px", background: "linear-gradient(90deg, #7c3aed, #4f46e5, #a78bfa)" }} />

        <div className="p-8">
          {/* Back button + title */}
          <div className="flex items-center gap-3 mb-6">
            <button
              id="profile-back-btn"
              onClick={handleNavigate}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.06)", color: "var(--aura-text)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.2)"; e.currentTarget.style.color = "#a78bfa"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "var(--aura-text)"; }}
            >
              <IoArrowBack size={18} />
            </button>
            <div>
              <h2 className="text-xl font-bold" style={{ color: "var(--aura-text)", fontFamily: "'Inter', sans-serif" }}>
                {userInfo.profileSetup ? "Edit Profile" : "Setup Profile"}
              </h2>
              <p className="text-xs" style={{ color: "var(--aura-muted)" }}>
                {userInfo.profileSetup ? "Update your details" : "Complete your profile to get started"}
              </p>
            </div>
          </div>

          {/* Avatar + Form */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6">
            {/* Avatar */}
            <div
              className="relative flex-shrink-0 cursor-pointer"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <div
                className="w-24 h-24 rounded-full overflow-hidden"
                style={{ padding: "2px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
              >
                <Avatar className="w-full h-full rounded-full overflow-hidden block">
                  {image ? (
                    <AvatarImage src={image} alt="profile" className="object-cover w-full h-full" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-3xl font-bold rounded-full"
                      style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa" }}
                    >
                      {firstName ? firstName.split("").shift() : userInfo.email.split("").shift().toUpperCase()}
                    </div>
                  )}
                </Avatar>
              </div>
              {hovered && (
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer"
                  style={{ background: "rgba(0,0,0,0.55)" }}
                  onClick={image ? handleDeleteImage : handleFileInputClick}
                >
                  {image
                    ? <FaTrash className="text-white" size={18} />
                    : <FaPlus className="text-white" size={18} />
                  }
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
                accept=".png,.jpg,.jpeg,.svg,.webp"
                name="profile-image"
              />
            </div>

            {/* Form fields */}
            <div className="flex flex-col gap-3 flex-1 w-full">
              <Input
                placeholder="Email"
                type="email"
                className="aura-input h-11"
                disabled
                value={userInfo.email}
              />
              <Input
                id="first-name-input"
                placeholder="First Name"
                type="text"
                className="aura-input h-11"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                id="last-name-input"
                placeholder="Last Name"
                type="text"
                className="aura-input h-11"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Color picker */}
          <div className="mb-6">
            <p className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "var(--aura-muted)" }}>
              Avatar Color
            </p>
            <div className="flex gap-3">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`${color} w-8 h-8 rounded-full cursor-pointer transition-all duration-200 hover:scale-110`}
                  style={
                    selectedColor === index
                      ? { outline: "2px solid #a78bfa", outlineOffset: "3px" }
                      : {}
                  }
                  onClick={() => setSelectedColor(index)}
                />
              ))}
            </div>
          </div>

          {/* Save button */}
          <Button
            id="save-profile-btn"
            className="aura-btn h-12 w-full"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
