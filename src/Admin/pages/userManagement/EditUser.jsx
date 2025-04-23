import React from "react";
import potrate from "../../assets/Images/potrate-1.jpg";
import Trash from "../../assets/Images/trash.png";
import Edit from "../../assets/Images/edit.png";
import { deleteUser } from "../../firebase/userApi";
import defaultUserImg from "../../assets/Images/defaultPorfileSVG.svg";
import axios from "axios";

const apiBaseUrl = process.env.REACT_APP_BASE_API;
const EditUser = ({ open, openEdit, data }) => {
  // const deleteAction = async (userID) => {
  //   try {
  //     const res = await deleteUser(userID);
  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const deleteAction = async () => { 
    const res = await axios.delete(`${apiBaseUrl}/api/users/${data?._id}`);
    console.log(
      res
    );
    
  }
  return (
    <div
      className="edit-user-cnt"
      style={{
        right: open?.open ? "1rem" : " -28rem",
        display: open?.open ? "block" : "none",
      }}
    >
      <div className="profile-details-cnt">
        <img
          src={data?.passportPhotoFile?data?.passportPhotoFile:defaultUserImg}
          alt="potrate"
          className="profile-details-img"
        />
        <h4>
          {data?.firstName} {data?.lastName}
        </h4>
        <div className="action-btn-cnt">
          <img
            src={Trash}
            alt="delete"
            className="action-img"
            onClick={() => deleteAction(data?._id)}
          />
          <img
            src={Edit}
            alt="edit"
            className="action-img"
            onClick={() => openEdit(data)}
          />
        </div>
      </div>
      <div className="user-ofiicial-details-cnt">
        <div className="ofiicial-detail">
          <h3 className="details-text">Email</h3>
          <p>{data?.email}</p>
        </div>
        <div className="ofiicial-detail">
          <h3 className="details-text">Gende</h3>
          <p>{data?.gender}</p>
        </div>
        <div className="ofiicial-detail">
          <h3 className="details-text">Mobile</h3>
          <p>{data?.mobileNo}</p>
        </div>
        <div className="ofiicial-detail">
          <h3 className="details-text">Address</h3>
          <p>{data?.presentAddress}</p>
        </div>
      </div>
      <div className="courses-history">
        <div className="courses-history-header">
          <h5>Course</h5>
          <h5>status</h5>
        </div>
        <div className="courses-history-content courses-history-header">
          <h5>AI in hiring assisatance</h5>
          <h6>Attending</h6>
        </div>
        <div className="courses-history-content courses-history-header">
          <h5>AI in hiring assisatance</h5>
          <h6>Attending</h6>
        </div>
        <div className="courses-history-content courses-history-header">
          <h5>AI in hiring assisatance</h5>
          <h6>Attending</h6>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
