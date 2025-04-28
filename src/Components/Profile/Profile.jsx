import "./Profile.css";
import { useState, useEffect } from "react";
import phoneSVG from "../Assets/SVG/phoneSVG.svg";
import mailSVG from "../Assets/SVG/mailSVG.svg";
import axios from "axios";
import defaultPorfileSVG from "../Assets/SVG/defaultPorfileSVG.svg";
import defaultBannerSVG from "../Assets/SVG/defaultBannerSVG.svg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  
  // Form data state
  const [profileData, setProfileData] = useState({
    username: "Default username",
    firstName: "Default firstName",
    lastName: "Default lastName",
    email: "Default email",
    phoneNumber: "Default phoneNumber",
    gender: "Default gender",
    address: "Default address",
    educationalQualification: "Default educational Qualification",
    maritalStatus: "Default marital Status",
    dob: "default dob",
    ministryExperience: "default ministry Experience",
    theologicalQualification: "default theological Qualification",
    salvationExperience: "default salvation Experience",
  });

  // File states
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [selectedProfileBanner, setSelectedProfileBanner] = useState(null);
  const [selectedSignatureFile, setSelectedSignatureFile] = useState(null);
  const [selectedEducationCertFile, setSelectedEducationCertFile] = useState(null);

  // Preview states
  const [previewProfileImage, setPreviewProfileImage] = useState(defaultPorfileSVG);
  const [previewProfileBanner, setPreviewProfileBanner] = useState(defaultBannerSVG);
  const [previewSignature, setPreviewSignature] = useState(defaultBannerSVG);
  const [previewEducationCert, setPreviewEducationCert] = useState(defaultBannerSVG);

  const user = JSON.parse(localStorage.getItem("userdata"));

  useEffect(() => {
    if (localStorage.getItem("userdata") != null) {
      const user = JSON.parse(localStorage.getItem("userdata"));
      console.log(user);
      
      // Set form data
      setProfileData({
        username: user.username || "Default username",
        firstName: user.firstName || "Default firstName",
        lastName: user.lastName || "Default lastName",
        email: user.email || "Default email",
        phoneNumber: user.mobileNo || "Default phoneNumber",
        gender: user.gender || "Default gender",
        address: user.presentAddress || "Default address",
        educationalQualification: user.educationalQualification || "Default educational Qualification",
        maritalStatus: user.maritalStatus || "Default marital Status",
        dob: user.dob || "default dob",
        ministryExperience: user.ministryExperience || "default ministry Experience",
        theologicalQualification: user.theologicalQualification || "default theological Qualification",
        salvationExperience: user.salvationExperience || "default salvation Experience",
      });

      // Set preview images
      if (user.passportPhotoFile) setPreviewProfileImage(user.passportPhotoFile);
      if (user.profileBanner) setPreviewProfileBanner(user.profileBanner);
      if (user.signatureFile) setPreviewSignature(user.signatureFile);
      if (user.educationCertFile) setPreviewEducationCert(user.educationCertFile);
    } else {
      navigate("/login");
    }

    return () => {
      // Clean up object URLs
      if (previewProfileImage && previewProfileImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewProfileImage);
      }
      if (previewProfileBanner && previewProfileBanner.startsWith('blob:')) {
        URL.revokeObjectURL(previewProfileBanner);
      }
      if (previewSignature && previewSignature.startsWith('blob:')) {
        URL.revokeObjectURL(previewSignature);
      }
      if (previewEducationCert && previewEducationCert.startsWith('blob:')) {
        URL.revokeObjectURL(previewEducationCert);
      }
    };
  }, []);

  // Validation functions
  const validateName = (value) => /^[A-Za-z\s]+$/.test(value);
  const validateNumber = (value) => /^\d+$/.test(value);
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validateGender = (value) => /^[A-Za-z\s]+$/.test(value);
  const validateMaritalStatus = (value) => /^[A-Za-z\s]+$/.test(value);
  const isEmpty = (value) => !value || value.trim() === "";

  // Form validation
  const validateForm = () => {
    let isValid = true;

    if (isEmpty(profileData.firstName)) {
      toast.error("First name is required");
      isValid = false;
    } else if (!validateName(profileData.firstName)) {
      toast.error("First name can only contain letters and spaces");
      isValid = false;
    }

    if (isEmpty(profileData.lastName)) {
      toast.error("Last name is required");
      isValid = false;
    } else if (!validateName(profileData.lastName)) {
      toast.error("Last name can only contain letters and spaces");
      isValid = false;
    }

    if (isEmpty(profileData.email)) {
      toast.error("Email is required");
      isValid = false;
    } else if (!validateEmail(profileData.email)) {
      toast.error("Please enter a valid email address");
      isValid = false;
    }

    if (isEmpty(profileData.phoneNumber)) {
      toast.error("Phone number is required");
      isValid = false;
    } else if (!validateNumber(profileData.phoneNumber)) {
      toast.error("Phone number can only contain numbers");
      isValid = false;
    }

    if (isEmpty(profileData.gender)) {
      toast.error("Gender is required");
      isValid = false;
    } else if (!validateGender(profileData.gender)) {
      toast.error("Gender can only contain letters and spaces");
      isValid = false;
    }

    if (isEmpty(profileData.address)) {
      toast.error("Address is required");
      isValid = false;
    }

    if (isEmpty(profileData.maritalStatus)) {
      toast.error("Marital status is required");
      isValid = false;
    } else if (!validateMaritalStatus(profileData.maritalStatus)) {
      toast.error("Marital status can only contain letters and spaces");
      isValid = false;
    }

    if (isEmpty(profileData.dob)) {
      toast.error("Date of birth is required");
      isValid = false;
    }

    return isValid;
  };

  // Handle edit/save/cancel
  const handleEditClick = () => setIsEditing(true);
  
  const handleCancelClick = () => {
    setIsEditing(false);
    // Reset file selections
    setSelectedProfileImage(null);
    setSelectedProfileBanner(null);
    setSelectedSignatureFile(null);
    setSelectedEducationCertFile(null);
    
    // Reset previews to original values
    const user = JSON.parse(localStorage.getItem("userdata"));
    if (user) {
      setPreviewProfileImage(user.passportPhotoFile || defaultPorfileSVG);
      setPreviewProfileBanner(user.profileBanner || defaultBannerSVG);
      setPreviewSignature(user.signatureFile || defaultBannerSVG);
      setPreviewEducationCert(user.educationCertFile || defaultBannerSVG);
    }
  };

  const handleSaveClick = async () => {
    if (!validateForm()) return;

    const formData = new FormData();

    // Append all profile data
    Object.entries(profileData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append files if they exist
    if (selectedProfileImage) formData.append("passportPhotoFile", selectedProfileImage);
    if (selectedProfileBanner) formData.append("profileBanner", selectedProfileBanner);
    if (selectedSignatureFile) formData.append("signatureFile", selectedSignatureFile);
    if (selectedEducationCertFile) formData.append("educationCertFile", selectedEducationCertFile);

    try {
      const apiBaseUrl = process.env.REACT_APP_BASE_API;
      const response = await axios.put(
        `${apiBaseUrl}/api/users/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated successfully!");
      localStorage.setItem("userdata", JSON.stringify(response.data.user));

      // Update previews with new URLs from response
      if (response.data.user.passportPhotoFile) {
        setPreviewProfileImage(response.data.user.passportPhotoFile);
      }
      if (response.data.user.profileBanner) {
        setPreviewProfileBanner(response.data.user.profileBanner);
      }
      if (response.data.user.signatureFile) {
        setPreviewSignature(response.data.user.signatureFile);
      }
      if (response.data.user.educationCertFile) {
        setPreviewEducationCert(response.data.user.educationCertFile);
      }

      // Clear selected files
      setSelectedProfileImage(null);
      setSelectedProfileBanner(null);
      setSelectedSignatureFile(null);
      setSelectedEducationCertFile(null);

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // File handlers
  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewProfileImage(URL.createObjectURL(file));
      setSelectedProfileImage(file);
    }
  };

  const handleProfileBannerChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewProfileBanner(URL.createObjectURL(file));
      setSelectedProfileBanner(file);
    }
  };

  const handleSignatureFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewSignature(URL.createObjectURL(file));
      setSelectedSignatureFile(file);
    }
  };

  const handleEducationCertFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewEducationCert(URL.createObjectURL(file));
      setSelectedEducationCertFile(file);
    }
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="profileContainer">
        <div className="profileBannerBox">
          <div className="profileBGBox">
            <img
              src={previewProfileBanner}
              alt="Banner"
            />
            {isEditing && (
              <label className="custom-file-upload imageBanner">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileBannerChange}
                  className="imageBannerUpload"
                />
                Choose File for Profile Banner
              </label>
            )}
          </div>
          <div className="profileHeader">
            <div className="profileImage">
              <img
                src={previewProfileImage}
                alt="Profile"
                className="defaultImage"
              />
              {isEditing && (
                <label className="custom-file-upload">
                  <input
                    name="passportPhotoFile"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="imageUpload"
                  />
                  Choose File
                </label>
              )}
            </div>
            <div className="profileHeaderInfo">
              <div className="profileName">{profileData?.username}</div>
              <div className="profileEmail">{profileData?.email}</div>
            </div>
            <div className="profileEditBtn">
              {isEditing ? (
                <>
                  <button onClick={handleSaveClick}>Save</button>
                  <button onClick={handleCancelClick}>Cancel</button>
                </>
              ) : (
                <button onClick={handleEditClick}>Edit</button>
              )}
            </div>
          </div>
        </div>
        <div className="profileContent">
          <div className="profileSection">
            <div className="hh5">General Information</div>

            <div className="profileDetails">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="profileDetails">
              <label>First Name</label>
              <input
                type="text"
                style={{ width: "340px" }}
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="profileDetails">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="profileDetails">
              <label>Gender</label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="profileDetails">
              <label>Address</label>
              <textarea
                name="address"
                value={profileData.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="profileSeperator"></div>
            <div className="hh5">Contact Details</div>
            <div className="profileDetails profileSPLBox">
              <img src={phoneSVG} alt="phoneNumberSVG" />
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="profileDetails profileSPLBox">
              <img src={mailSVG} alt="mailSVG" />
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="profileSection">
            <div className="hh5">Other Informations</div>
            <div className="profileDetails">
              <label>Education Qualification</label>
              <input
                type="text"
                name="educationalQualification"
                value={profileData.educationalQualification}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="profileDetails">
              <label>Marital Status</label>
              <select
                name="maritalStatus"
                value={profileData.maritalStatus || ""}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            <div className="profileDetails">
              <label>Date of Birth</label>
              <input
                type={!isEditing ? "text" : "date"}
                style={{width: "340px"}}
                name="dob"
                value={profileData.dob ? profileData.dob.split("T")[0] : ""}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="profileDetails">
              <label>Ministry Experience</label>
              <textarea
                name="ministryExperience"
                value={profileData.ministryExperience}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="profileDetails">
              <label>Theological Qualification</label>
              <textarea
                name="theologicalQualification"
                value={profileData.theologicalQualification}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="profileDetails">
              <label>Salvation Experience</label>
              <textarea
                name="salvationExperience"
                value={profileData.salvationExperience}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="profileDetails">
              <label>Signature File</label>
              <div className="profileBGBox">
                <img
                  src={previewSignature}
                  alt="Signature"
                />
                {isEditing && (
                  <label className="custom-file-upload text-white imageBanner">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureFileChange}
                      className="imageBannerUpload"
                    />
                    Choose File for Signature
                  </label>
                )}
              </div>
            </div>
            <div className="profileDetails">
              <label>Education CertFile</label>
              <div className="profileBGBox">
                <img
                  src={previewEducationCert}
                  alt="Education Certificate"
                />
                {isEditing && (
                  <label className="custom-file-upload text-white imageBanner">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEducationCertFileChange}
                      className="imageBannerUpload"
                    />
                    Choose File for Education file
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;