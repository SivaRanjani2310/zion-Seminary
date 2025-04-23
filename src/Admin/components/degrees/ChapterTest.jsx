// import React, { useEffect, useState } from "react";
// // import { addNewTest, getTestById, updateTest } from '../../firebase/testApi';

// const ChapterTest = ({ testId, closeTest, addTest }) => {
//   const initialMCQState = {
//     question: "",
//     correctAnswer: null,
//     options: [],
//     questionNumber: null,
//     updateIndex: null,
//   };

//   const [currentTest, setCurrentTest] = useState({
//     title: "Chapter Test", // Update title to reflect chapter context
//     timeLimit: 11,
//     questions: [],
//     target: "chapter", // Changed to 'chapter' to reflect the new context
//     type: "MCQ",
//   });

//   const [currentQuestion, setCurrentQuestion] = useState(initialMCQState);
//   const [dropDown, setDropDown] = useState(false);
//   const [duration, setDuration] = useState({ hours: 0, minutes: 0 });

//   useEffect(() => {
//     // const getTest = async () => {
//     //     if (testId?.length > 1) {
//     //         const data = await getTestById(testId);
//     //         setCurrentTest(data);
//     //         const time = convertToUTC(data?.test?.timeLimit);
//     //         setDuration(time);
//     //     }
//     // };
//     // getTest();
//     setCurrentTest(testId);
//   }, [testId]);

//   console.log(closeTest);

//   const handleChoiceSelect = (index, value) => {
//     setDropDown(false);
//     setCurrentQuestion({
//       ...currentQuestion,
//       correctAnswer: currentQuestion?.options[index],
//     });
//   };

//   const handleChoiceInput = (index, value) => {
//     const newChoices = [...currentQuestion.options];
//     newChoices[index] = value;
//     setCurrentQuestion({ ...currentQuestion, options: newChoices });
//   };

//   const handleNext = () => {
//     const updatedTest = [...currentTest.questions];
//     if (currentQuestion.updateIndex === null) {
//       updatedTest?.push(currentQuestion);
//       setCurrentTest({ ...currentTest, questions: updatedTest });
//       setCurrentQuestion(initialMCQState);
//     } else if (
//       currentQuestion.updateIndex + 1 ===
//       currentTest?.questions?.length
//     ) {
//       updatedTest[currentQuestion.updateIndex] = currentQuestion;
//       setCurrentTest({ ...currentTest, questions: updatedTest });
//       setCurrentQuestion(initialMCQState);
//     } else {
//       updatedTest[currentQuestion.updateIndex] = currentQuestion;
//       setCurrentTest({ ...currentTest, questions: updatedTest });
//       setCurrentQuestion(
//         currentTest?.questions?.[currentQuestion.updateIndex + 1]
//       );
//     }
//   };

//   const checkQuestionMatch = (index) => {
//     if (
//       currentQuestion?.updateIndex === index ||
//       currentTest?.questions?.indexOf(currentQuestion) === index
//     )
//       return "#8949ff";
//     return "transparent";
//   };

//   const questionValidation = () => {
//     if (
//       currentQuestion?.question?.length > 5 &&
//       currentQuestion?.correctAnswer &&
//       currentQuestion?.options?.length === 4
//     )
//       return true;
//     return false;
//   };

//   // const handleAddTest = async () => {
//   //     if (testId?.length > 5) {
//   //         try {
//   //             const { data } = await updateTest(testId, currentTest);
//   //             addTest(data?.test?._id);
//   //             closeTest();
//   //         } catch (error) {
//   //             console.log(error);
//   //         }
//   //     } else {
//   //         try {
//   //             // const data = await addNewTest(currentTest);
//   //             // addTest(data);
//   //             addTest(currentTest)
//   //             // console.log("test added with id:", data);
//   //             closeTest();
//   //         } catch (error) {
//   //             console.log(error);
//   //         }
//   //     }
//   // };

//   const handleAddTest = async () => {
//     if (testId?.length > 0) {
//       try {
//         addTest(currentTest);
//       } catch (error) {
//         console.log(error);
//       }
//     } else {
//       try {
//         addTest(currentTest);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

//   useEffect(() => {
//     if (duration?.hours !== 0 || duration?.minutes !== 0) {
//       const totalSeconds = duration?.hours * 60 * 60 + duration?.minutes * 60;
//       if (totalSeconds !== undefined) {
//         setCurrentTest((currentTest) => {
//           return { ...currentTest, timeLimit: totalSeconds };
//         });
//       }
//     }
//   }, [duration]);

//   console.log(currentTest);

//   return (
//     <div className="add-test-cnt">
//       <div className="test-top-header">
//         <div>
//           <div className="lesson-name-cnt">
//             <p>Chapter Title</p> {/* Changed label to reflect "Chapter" */}
//             <input
//               type="text"
//               name=""
//               value={currentTest?.title}
//               className="lesson-title-input test-title-input"
//               onChange={(e) =>
//                 setCurrentTest({
//                   ...currentTest,
//                   title: e.target.value,
//                 })
//               }
//             />
//           </div>
//         </div>
//         <div className="duration-input-cnt">
//           <p>Set Duration</p>
//           <div className="timer-cover">
//             <div className="timer-cover">
//               <input
//                 type="number"
//                 name=""
//                 value={duration?.hours}
//                 onChange={(e) =>
//                   setDuration({ ...duration, hours: e.target.value })
//                 }
//                 className="timer-input description-input"
//               />
//               <p>Hours</p>
//             </div>
//             <div className="timer-cover">
//               <input
//                 type="number"
//                 name=""
//                 value={duration?.minutes}
//                 onChange={(e) =>
//                   setDuration({ ...duration, minutes: e.target.value })
//                 }
//                 className="timer-input description-input"
//               />
//               <p>Minutes</p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="questions-block-cnt">
//         {currentTest?.questions?.map((test, index) => (
//           <div
//             className="question-block"
//             style={{ background: checkQuestionMatch(index) }}
//             key={index}
//             onClick={() => setCurrentQuestion({ ...test, updateIndex: index })}
//           >
//             <p
//               className="question-number"
//               style={{
//                 color: checkQuestionMatch(index) === "transparent" && "#8949ff",
//               }}
//             >
//               {index + 1}
//             </p>
//           </div>
//         ))}
//         <div
//           className="question-block"
//           style={{
//             background: checkQuestionMatch(null),
//           }}
//           onClick={() => setCurrentQuestion(initialMCQState)}
//         >
//           <p
//             className="question-number"
//             style={{
//               color: checkQuestionMatch(null) === "transparent" && "#8949ff",
//             }}
//           >
//             {currentTest?.questions?.length + 1}
//           </p>
//         </div>
//       </div>
//       <div className="question-inputs-cnt">
//         <div className={`question-input-cnt`}>
//           <p>Question</p>
//           <textarea
//             className="question-input"
//             value={currentQuestion?.question}
//             onChange={(e) =>
//               setCurrentQuestion({
//                 ...currentQuestion,
//                 question: e.target.value,
//               })
//             }
//           />
//         </div>
//         <div className="choice-cnt">
//           <div className="choice-header">
//             <p>Choices</p>
//             <div className="select-answer-cnt">
//               <p>Select Answer</p>
//               <div className="selected-choice-display">
//                 <p onClick={() => setDropDown(true)}>
//                   {currentQuestion?.correctAnswer
//                     ? currentQuestion?.correctAnswer
//                     : "Not selected"}
//                 </p>
//                 {dropDown && (
//                   <div className="drop-down-cnt">
//                     <div
//                       className="drop-down-choice"
//                       onClick={() => handleChoiceSelect(0, "Choice one")}
//                     >
//                       <p>Choice one</p>
//                     </div>
//                     <div
//                       className="drop-down-choice"
//                       onClick={() => handleChoiceSelect(1, "Choice two")}
//                     >
//                       <p>Choice two</p>
//                     </div>
//                     <div
//                       className="drop-down-choice"
//                       onClick={() => handleChoiceSelect(2, "Choice three")}
//                     >
//                       <p>Choice three</p>
//                     </div>
//                     <div
//                       className="drop-down-choice"
//                       onClick={() => handleChoiceSelect(3, "Choice four")}
//                     >
//                       <p>Choice four</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="choice">
//             <p>Choice one</p>
//             <input
//               type="text"
//               name=""
//               placeholder="Enter choice one"
//               value={
//                 currentQuestion?.options[0] ? currentQuestion?.options[0] : ""
//               }
//               onChange={(e) => handleChoiceInput(0, e.target.value)}
//             />
//           </div>
//           <div className="choice">
//             <p>Choice two</p>
//             <input
//               type="text"
//               name=""
//               placeholder="Enter choice two"
//               value={
//                 currentQuestion?.options[1] ? currentQuestion?.options[1] : ""
//               }
//               onChange={(e) => handleChoiceInput(1, e.target.value)}
//             />
//           </div>
//           <div className="choice">
//             <p>Choice three</p>
//             <input
//               type="text"
//               name=""
//               placeholder="Enter choice three"
//               value={
//                 currentQuestion?.options[2] ? currentQuestion?.options[2] : ""
//               }
//               onChange={(e) => handleChoiceInput(2, e.target.value)}
//             />
//           </div>
//           <div className="choice">
//             <p>Choice four</p>
//             <input
//               type="text"
//               name=""
//               placeholder="Enter choice four"
//               value={
//                 currentQuestion?.options[3] ? currentQuestion?.options[3] : ""
//               }
//               onChange={(e) => handleChoiceInput(3, e.target.value)}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="action-btns-cnt">
//         <div
//           className="course-delete-btn cancel-test-btn"
//           onClick={() => closeTest()}
//         >
//           Cancel
//         </div>
//         <div
//           className="course-delete-btn save-next"
//           onClick={() => handleNext()}
//           style={{
//             background: !questionValidation() && "gray",
//             pointerEvents: !questionValidation() && "none",
//           }}
//         >
//           Save and Next
//         </div>
//         <div className="add-new-lesson-btn" onClick={() => handleAddTest()}>
//           Add to Chapter {/* Updated button text */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChapterTest;


import React, { useEffect, useState } from "react";

const ChapterTest = ({ testId, closeTest, addTest }) => {
  const initialMCQState = {
    question: "",
    correctAnswer: null,
    options: [],
    questionNumber: null,
    updateIndex: null,
  };

  const [currentTest, setCurrentTest] = useState({
    title: "Chapter Test",
    timeLimit: 11,
    questions: [],
    target: "chapter",
    type: "MCQ",
  });

  const [currentQuestion, setCurrentQuestion] = useState(initialMCQState);
  const [dropDown, setDropDown] = useState(false);
  const [duration, setDuration] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    if (testId) {
      // Directly use the testId data instead of fetching it
      setCurrentTest(testId); // Assuming testId contains the test data
    }
  }, [testId]);

  const handleChoiceSelect = (index, value) => {
    setDropDown(false);
    setCurrentQuestion({
      ...currentQuestion,
      correctAnswer: currentQuestion?.options[index],
    });
  };

  const handleChoiceInput = (index, value) => {
    const newChoices = [...currentQuestion.options];
    newChoices[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newChoices });
  };

  const handleNext = () => {
    const updatedTest = [...currentTest.questions];
    if (currentQuestion.updateIndex === null) {
      updatedTest?.push(currentQuestion);
      setCurrentTest({ ...currentTest, questions: updatedTest });
      setCurrentQuestion(initialMCQState);
    } else if (
      currentQuestion.updateIndex + 1 ===
      currentTest?.questions?.length
    ) {
      updatedTest[currentQuestion.updateIndex] = currentQuestion;
      setCurrentTest({ ...currentTest, questions: updatedTest });
      setCurrentQuestion(initialMCQState);
    } else {
      updatedTest[currentQuestion.updateIndex] = currentQuestion;
      setCurrentTest({ ...currentTest, questions: updatedTest });
      setCurrentQuestion(
        currentTest?.questions?.[currentQuestion.updateIndex + 1]
      );
    }
  };

  const checkQuestionMatch = (index) => {
    if (
      currentQuestion?.updateIndex === index ||
      currentTest?.questions?.indexOf(currentQuestion) === index
    )
      return "#8949ff";
    return "transparent";
  };

  const questionValidation = () => {
    if (
      currentQuestion?.question?.length > 5 &&
      currentQuestion?.correctAnswer &&
      currentQuestion?.options?.length === 4
    )
      return true;
    return false;
  };

  const handleAddTest = async () => {
    try {
      addTest(currentTest); // Add the currentTest to the parent or external state
      closeTest(); // Close the test editing modal or screen
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (duration?.hours !== 0 || duration?.minutes !== 0) {
      const totalSeconds = duration?.hours * 60 * 60 + duration?.minutes * 60;
      if (totalSeconds !== undefined) {
        setCurrentTest((currentTest) => {
          return { ...currentTest, timeLimit: totalSeconds };
        });
      }
    }
  }, [duration]);

  return (
    <div className="add-test-cnt">
      <div className="test-top-header">
        <div>
          <div className="lesson-name-cnt">
            <p>Chapter Title</p>
            <input
              type="text"
              value={currentTest?.title}
              className="lesson-title-input test-title-input"
              onChange={(e) =>
                setCurrentTest({
                  ...currentTest,
                  title: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="duration-input-cnt">
          <p>Set Duration</p>
          <div className="timer-cover">
            <div className="timer-cover">
              <input
                type="number"
                value={duration?.hours}
                onChange={(e) =>
                  setDuration({ ...duration, hours: e.target.value })
                }
                className="timer-input description-input"
              />
              <p>Hours</p>
            </div>
            <div className="timer-cover">
              <input
                type="number"
                value={duration?.minutes}
                onChange={(e) =>
                  setDuration({ ...duration, minutes: e.target.value })
                }
                className="timer-input description-input"
              />
              <p>Minutes</p>
            </div>
          </div>
        </div>
      </div>
      <div className="questions-block-cnt">
        {currentTest?.questions?.map((test, index) => (
          <div
            className="question-block"
            style={{ background: checkQuestionMatch(index) }}
            key={index}
            onClick={() => setCurrentQuestion({ ...test, updateIndex: index })}
          >
            <p
              className="question-number"
              style={{
                color: checkQuestionMatch(index) === "transparent" && "#8949ff",
              }}
            >
              {index + 1}
            </p>
          </div>
        ))}
        <div
          className="question-block"
          style={{
            background: checkQuestionMatch(null),
          }}
          onClick={() => setCurrentQuestion(initialMCQState)}
        >
          <p
            className="question-number"
            style={{
              color: checkQuestionMatch(null) === "transparent" && "#8949ff",
            }}
          >
            {currentTest?.questions?.length + 1}
          </p>
        </div>
      </div>
      <div className="question-inputs-cnt">
        <div className="question-input-cnt">
          <p>Question</p>
          <textarea
            className="question-input"
            value={currentQuestion?.question}
            onChange={(e) =>
              setCurrentQuestion({
                ...currentQuestion,
                question: e.target.value,
              })
            }
          />
        </div>
        <div className="choice-cnt">
          <div className="choice-header">
            <p>Choices</p>
            <div className="select-answer-cnt">
              <p>Select Answer</p>
              <div className="selected-choice-display">
                <p onClick={() => setDropDown(true)}>
                  {currentQuestion?.correctAnswer || "Not selected"}
                </p>
                {dropDown && (
                  <div className="drop-down-cnt">
                    <div
                      className="drop-down-choice"
                      onClick={() => handleChoiceSelect(0, "Choice one")}
                    >
                      <p>Choice one</p>
                    </div>
                    <div
                      className="drop-down-choice"
                      onClick={() => handleChoiceSelect(1, "Choice two")}
                    >
                      <p>Choice two</p>
                    </div>
                    <div
                      className="drop-down-choice"
                      onClick={() => handleChoiceSelect(2, "Choice three")}
                    >
                      <p>Choice three</p>
                    </div>
                    <div
                      className="drop-down-choice"
                      onClick={() => handleChoiceSelect(3, "Choice four")}
                    >
                      <p>Choice four</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {["Choice one", "Choice two", "Choice three", "Choice four"].map(
            (choice, index) => (
              <div className="choice" key={index}>
                <p>{choice}</p>
                <input
                  type="text"
                  placeholder={`Enter ${choice}`}
                  value={currentQuestion?.options[index] || ""}
                  onChange={(e) => handleChoiceInput(index, e.target.value)}
                />
              </div>
            )
          )}
        </div>
      </div>
      <div className="action-btns-cnt">
        <div
          className="course-delete-btn cancel-test-btn"
          onClick={() => closeTest()}
        >
          Cancel
        </div>
        <div
          className="course-delete-btn save-next"
          onClick={() => handleNext()}
          style={{
            background: !questionValidation() && "gray",
            pointerEvents: !questionValidation() && "none",
          }}
        >
          Save and Next
        </div>
        <div className="add-new-lesson-btn" onClick={() => handleAddTest()}>
          Add to Chapter
        </div>
      </div>
    </div>
  );
};

export default ChapterTest;
