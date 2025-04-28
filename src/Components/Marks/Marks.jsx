import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Marks.css";

const apiBaseUrl = process.env.REACT_APP_BASE_API;
const userInfo = JSON.parse(localStorage.getItem("userdata"));

const Marks = () => {
  const [marksData, setMarksData] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarksData = async () => {
      if (!userInfo || !userInfo.degreeProgress?.length) {
        setError("Degree information is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/answer/${userInfo._id}/${userInfo.degreeProgress[0].degreeId}`
        );
        setMarksData(response.data);
      } catch (err) {
        setError("Failed to load marks data");
      } finally {
        setLoading(false);
      }
    };

    fetchMarksData();
  }, [userInfo?._id, userInfo?.degreeProgress?.[0]?.degreeId]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;
  if (!marksData) return <p className="text-center">No data available</p>;

  return (
    <div className="container-fluid mt-4">
      <h2 className="text-center text-primary">Marks Summary</h2>
      <table className="table table-bordered table-striped shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Total Marks</th>
            <th>Total Possible Marks</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{marksData.totalMarks ?? "N/A"}</td>
            <td>{marksData.totalPossibleMarks ?? "N/A"}</td>
            <td>{marksData.percentage ? `${marksData.percentage}%` : "N/A"}</td>
          </tr>
        </tbody>
      </table>

      {["chapters", "subLessons"].map((category) =>
        marksData[category]?.length > 0 ? (
          <div key={category}>
            <h2
              className={`text-center ${
                category === "chapters" ? "text-success" : "text-info"
              }`}
            >
              {category === "chapters" ? "Chapters" : "Sub-Lessons"}
            </h2>
            <table className="table table-hover table-bordered shadow-sm">
              <thead
                className={`table-${category === "chapters" ? "info" : "warning"}`}
              >
                <tr>
                  <th>Title</th>
                  <th>Best Marks</th>
                  <th>Attempts</th>
                </tr>
              </thead>
              <tbody>
                {marksData[category].map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      {category === "chapters"
                        ? item.chapterTitle ?? "N/A"
                        : item.sublessonTitle ?? "N/A"}
                    </td>
                    {/* <td>{item.chapterTitle ?? "N/A"}</td> */}

                    <td>{item.bestMarks ?? "N/A"}</td>
                    <td>
                      {item.attempts?.length > 0
                        ? item.attempts.map((attempt, index) => (
                            <div key={index}>
                              <button
                                className="btn btn-outline-primary m-1"
                                onClick={() => setSelectedAttempt(attempt)}
                              >
                                Attempt {index + 1} (
                                {attempt.answers?.reduce(
                                  (sum, ans) => sum + (ans.marks ?? 0),
                                  0
                                )}{" "}
                                Marks)
                              </button>
                            </div>
                          ))
                        : "No attempts"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null
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
                      <th>Marks</th>
                      <th>Your Answer</th>
                      <th>Correct</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAttempt.answers?.map((answer, index) => (
                      <tr key={index}>
                        <td>{answer.question ?? "N/A"}</td>
                        <td>{answer.marks ?? "N/A"}</td>
                        <td>{answer.userAnswer ?? "N/A"}</td>
                        <td>
                          {answer.userAnswer === answer.correctAnswer ? "✔" : "✘"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger"
                  onClick={() => setSelectedAttempt(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marks;
