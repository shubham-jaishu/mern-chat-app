import { useState, useRef } from "react";
import { useAuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";

const ProfileSettings = ({ isOpen, onClose }) => {
  const { authUser, setAuthUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(authUser?.profilePic || "");
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a supported image (JPEG, PNG, GIF, WebP)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (err) => reject(err));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async () => {
    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      });
    } catch (e) {
      toast.error("Error processing image");
      console.error(e);
    }
  };

  const handleUpload = async () => {
    if (!croppedAreaPixels) {
      toast.error("Please crop the image first");
      return;
    }

    const croppedImage = await getCroppedImg();
    uploadProfilePicture(croppedImage);
  };

  const uploadProfilePicture = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("profilePic", file, "profile.jpg");

      const res = await fetch("/api/users/profile-picture", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to upload profile picture");
      }

      const updatedUser = await res.json();
      setAuthUser(updatedUser);
      localStorage.setItem("chat-user", JSON.stringify(updatedUser));
      toast.success("Profile picture updated!");
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Update Profile Picture</h2>

        {!imageSrc ? (
          <div className="flex flex-col items-center gap-4">
            {/* Current Preview */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
              <img
                src={
                  preview ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    authUser?.fullName
                  )}&background=random&bold=true`
                }
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Choose Photo
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Crop Container */}
            <div className="relative w-full h-80 bg-black rounded-lg overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            {/* Zoom Slider */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setImageSrc(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Back
              </button>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
