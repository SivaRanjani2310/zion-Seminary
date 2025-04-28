import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserMarks.css";
import LeftBar from "../../../Admin/components/global/sidebar/LeftBar";

const apiBaseUrl = process.env.REACT_APP_BASE_API;

const UserMarks = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempMarks, setTempMarks] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/answer/get2`);
        const answersArray = response.data.answers; // ✅ Extract array
        console.log("API response:", answersArray);
        const transformedData = transformApiData(answersArray);
        setUserData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const transformApiData = (answersArray) => {
    return answersArray.map((item) => ({
      userId: item.userId,
      name: item.username,
      totalMarks: item.totalMarks ?? 0,
      totalPossibleMarks: item.totalPossibleMarks ?? 0,
      percentage: item.percentage ?? 0,
      chapters: (item.subLessons || []).map((subLesson) => ({
        courseName: subLesson.sublessonTitle || "Sublesson",
        bestMarks: subLesson.bestMarks ?? 0,
        attempts: (subLesson.attempts || []).map((att) => ({
          ...att,
          answers: (att.answers || []).map((ans) => ({
            ...ans,
            correctAnswer: ans.correctAnswer || null,
            maxMarks: ans.maxMark || ans.marks || 0,
          })),
        })),
      })),
    }));
  };

  const handleMarksChange = (answerIndex, newMarks) => {
    setTempMarks({ ...tempMarks, [answerIndex]: newMarks });
  };

  const saveMarks = async (attemptIndex, answerIndex) => {
    const updatedData = [...userData];
    const user = updatedData.find((u) => u.userId === selectedUser.userId);
  
    if (!user) {
      console.error("❌ User not found");
      return;
    }
  
    // Find the chapter that has this attempt
    const chapter = user.chapters.find((ch) =>
      ch.attempts.includes(selectedAttempt)
    );
  
    if (!chapter) {
      console.error("❌ Chapter not found for selected attempt");
      return;
    }
  
    const attempt = chapter.attempts[attemptIndex];
    const answer = attempt.answers[answerIndex];
  
    if (!answer) {
      console.error("❌ Answer not found");
      return;
    }
  
    const answerId = answer._id || answer.degreeId || answer.answerId;
  
    if (!answerId) {
      console.error("❌ No valid answerId found in:", answer);
      return;
    }
  
    const newMark = tempMarks[answerIndex] ?? answer.marks;
  
    // Update local state
    answer.marks = newMark;
  
    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/answer/update-marks/${selectedUser.userId}/${answerId}`,
        {
          newMarks: newMark,
        }
      );
      console.log("✅ Marks updated:", response.data);
    } catch (error) {
      console.error("❌ Error updating marks:", error.response?.data || error);
    }
  
    setUserData(updatedData);
    setEditingIndex(null);
  };
  
  
  
  return (
    <div style={{ display: "flex" }}>
      <LeftBar />
      <div className="container-fluid mt-4" style={{ flex: 1 }}>
        {!selectedUser && (
          <button
            className="btn btn-secondary mb-3"
            onClick={() => navigate("/admin")}
          >
            Back
          </button>
        )}

        {!selectedUser ? (
          <>
            <h2 className="text-center text-primary">Marks Overview</h2>
            <table className="table table-bordered table-striped shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>Student Name</th>
                  <th>Total Marks</th>
                  <th>Percentage</th>
                  <th>View Details</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user, idx) => (
                  <tr key={idx}>
                    <td>{user.name}</td>
                    <td>{user.totalMarks}</td>
                    <td>{user.percentage}%</td>
                    <td>
                      <button
                        className="btn btn-outline-info"
                        onClick={() => setSelectedUser(user)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <button
              className="btn btn-secondary d-flex justify-content-end mb-3"
              onClick={() => {
                setSelectedUser(null);
                setSelectedAttempt(null);
              }}
            >
              Back to User List
            </button>
            <h3 className="text-center text-success">
              {selectedUser.name}'s Marks
            </h3>
            <table className="table table-hover table-bordered shadow-sm">
              <thead className="table-info">
                <tr>
                  <th>Sublesson Title</th>
                  <th>Best Marks</th>
                  <th>Attempts</th>
                </tr>
              </thead>
              <tbody>
                {selectedUser.chapters.map((item, index) => (
                  <tr key={index}>
                    <td>{item.courseName}</td>
                    <td>{item.bestMarks}</td>
                    <td>
                      {item.attempts.map((attempt, idx) => (
                        <button
                          key={idx}
                          className="btn btn-outline-primary m-1"
                          onClick={() => setSelectedAttempt(attempt)}
                        >
                          Attempt {idx + 1} (
                          {attempt.answers.reduce(
                            (sum, ans) => sum + ans.marks,
                            0
                          )}{" "}
                          Marks)
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {selectedAttempt && (
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-fullscreen">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">Attempt Details</h5>
                  <button
                    className="btn-close"
                    onClick={() => setSelectedAttempt(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <table className="table table-bordered shadow-sm">
                    <thead className="table-primary">
                      <tr>
                        <th>Question</th>
                        <th>User Answer</th>
                        <th>Correct Answer</th>
                        <th>Correct?</th>
                        <th>Marks</th>
                        <th>Max Marks</th>
                        <th>Edit</th>
                        <th>Save</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAttempt.answers.map((answer, index) => (
                        <tr key={index}>
                          <td>{answer.question}</td>
                          <td>{answer.userAnswer}</td>
                          <td>{answer.correctAnswer}</td>
                          <td>
                            {answer.userAnswer === answer.correctAnswer
                              ? "✔"
                              : "✘"}
                          </td>
                          <td>
                            {editingIndex === index ? (
                              <input
                                type="number"
                                value={tempMarks[index] ?? answer.marks}
                                onChange={(e) =>
                                  handleMarksChange(
                                    index,
                                    parseInt(e.target.value, 10)
                                  )
                                }
                              />
                            ) : (
                              answer.marks
                            )}
                          </td>
                          <td>{answer.maxMarks}</td>
                          <td>
                            {editingIndex === index ? (
                              <button
                                className="btn btn-warning"
                                onClick={() => setEditingIndex(null)}
                              >
                                Cancel
                              </button>
                            ) : (
                              <button
                                className="btn btn-info"
                                onClick={() => setEditingIndex(index)}
                              >
                                Edit
                              </button>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-success"
                              onClick={() =>
                                saveMarks(
                                  selectedUser.chapters[0].attempts.indexOf(
                                    selectedAttempt
                                  ),
                                  index
                                )
                              }
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedAttempt(null)}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMarks;
