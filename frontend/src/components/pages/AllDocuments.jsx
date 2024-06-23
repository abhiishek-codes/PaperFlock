import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllDocuments = () => {
  const [documents, setdocuments] = useState([]);
  const user = localStorage.getItem("userInfo");
  const { _id, token } = JSON.parse(user);
  const [hoverEffect, sethoverEffect] = useState([]);
  const [collabCard, setcollabCard] = useState(false);
  const [addedUsers, setaddedUsers] = useState([]);
  const [query, setquery] = useState("");
  const [collabUsers, setcollabUsers] = useState([]);
  const [role, setRole] = useState("read");
  const [collabData, setcollabData] = useState([]);
  const [documentId, setdocumentId] = useState("");
  const [createdochover, setcreatedochover] = useState(false);
  const [title, settitle] = useState("");
  const [currdoc, setcurrdoc] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    if (currdoc) {
      navigate(`/documents/${currdoc.title}/`, { state: currdoc });
    }
  }, [currdoc]);

  const deleteHandler = async (docId, ownerID) => {
    try {
      if (ownerID !== _id) {
        alert("only owner can delete a file");
        return;
      }

      const { data } = await axios.delete(
        `http://localhost:5000/api/documents/delete/${docId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data) {
        setdocuments((prev) => prev.filter((currdoc) => currdoc._id !== docId));
        ////console.log(data);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/documents",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { data } = response;
        setdocuments(data);
        //console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const userSearch = async (e) => {
    setquery(e.target.value);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/users/?search=${e.target.value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setaddedUsers(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateAccess = async () => {
    try {
      const formdata = {
        documentId: documentId,
        newCollaborators: collabData,
      };
      const { data } = axios.put(
        "http://localhost:5000/api/documents/updateAccess",
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setdocumentId("");
      setcollabData([]);
      setcollabUsers([]);
      alert("Users have been given access to documents");
      setcollabCard(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const createDoc = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/documents/create",
        {
          title: title,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      settitle("");
      setdocuments((prev) => [data, ...prev]);
      setcurrdoc(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div
        className={`bg-slate-200 flex items-center justify-center w-screen h-screen relative ${
          collabCard && "blur-md"
        }`}
      >
        <div className="w-[95vw] h-[95vh] overflow-y-auto hide-scrollbar m-auto bg-bgcolor relative rounded-md shadow-2xl ring-1">
          <button className="absolute text-white top-5 left-5 bg-white px-1 rounded-sm text-lg active:scale-75 duration-200">
            ⬅
          </button>
          <div className=" grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-10 p-[5rem] w-[100%] mx-auto justify-center">
            <div
              className="cursor-pointer flex flex-col gap-y-2  h-[215px] w-[150px] justify-center items-center relative overflow-auto mx-auto "
              onMouseEnter={() => setcreatedochover(true)}
              onMouseLeave={() => setcreatedochover(false)}
            >
              <div
                className={`border border-white text-black w-full h-full bg-white text-center font-['Mona'] overflow-ellipsis overflow-hidden flex justify-center items-center ${
                  createdochover ? "blur-md" : ""
                }`}
              >
                <h1>Blank Document</h1>
              </div>
              <div className="font-['Body'] text-white text-[0.7em]">
                <h1>Create Doc</h1>
              </div>
              <div
                className={`flex flex-col gap-y-4  justify-center items-center absolute top-0 left-0 bg-black h-full w-full transition-all duration-300 ${
                  createdochover ? "opacity-75 " : "opacity-0"
                }`}
              >
                <input
                  type="text"
                  className="w-[70%] rounded-sm font-['Body'] text-[0.8rem] px-2 py-1"
                  placeholder="Enter Title"
                  value={title}
                  onChange={(e) => settitle(e.target.value)}
                />
                <button
                  className="px-3 py-1 bg-blue-600 text-white font-['Mona'] rounded-sm text-[0.8rem] tracking-tight active:scale-75 duration-200 z-60"
                  onClick={createDoc}
                >
                  Create Doc
                </button>
              </div>
            </div>

            {documents.map((currdoc, index) => {
              return (
                <>
                  <div
                    key={currdoc._id}
                    className={`cursor-pointer flex flex-col gap-y-2  h-[215px] w-[150px] justify-center items-center relative overflow-auto mx-auto`}
                    onMouseEnter={() => {
                      let newHoverEffect = [...hoverEffect];
                      newHoverEffect[index] = true;
                      sethoverEffect(newHoverEffect);
                    }}
                    onMouseLeave={() => {
                      let newHoverEffect = [...hoverEffect];
                      newHoverEffect[index] = false;
                      sethoverEffect(newHoverEffect);
                    }}
                  >
                    <div
                      className={`border border-white text-black w-full h-full bg-white text-center font-['Mona'] overflow-ellipsis overflow-hidden ${
                        hoverEffect[index] ? "blur-sm" : ""
                      }`}
                    >
                      <h1 className="text-[0.5rem] p-1">{currdoc.title}</h1>
                      <p className="text-[0.4rem]">{currdoc.content}</p>
                    </div>
                    <div className="font-['Body'] text-white text-[0.7em]">
                      <h1>Created By : {currdoc.owner.username}</h1>
                    </div>
                    <div
                      className={`absolute top-0 left-0  w-full h-full bg-black text-white transition-opacity duration-300 flex flex-col items-center justify-center gap-y-4 ${
                        hoverEffect[index] ? "opacity-75" : "opacity-0"
                      }`}
                    >
                      <button
                        className="bg-indigo-700 px-3 py-1 text-white  font-['Body'] rounded-sm tracking-tight text-[0.8rem]  duration-200 hover:bg-indigo-400 active:scale-75"
                        onClick={() => {
                          setcollabCard(true);
                          setdocumentId(currdoc._id);
                        }}
                      >
                        Share Doc
                      </button>
                      <button
                        className="bg-indigo-700 px-3 py-1 text-white  font-['Body'] rounded-sm tracking-tight text-[0.8rem]  duration-200 hover:bg-indigo-400 active:scale-75"
                        onClick={() =>
                          deleteHandler(currdoc._id, currdoc.owner._id)
                        }
                      >
                        Delete
                      </button>
                      <button
                        className="bg-indigo-700 px-3 py-1 text-white  font-['Body'] rounded-sm tracking-tight text-[0.8rem] duration-200 hover:bg-indigo-400 active:scale-75"
                        onClick={() => {
                          setcurrdoc(currdoc);
                        }}
                      >
                        Open Doc
                      </button>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className={`absolute p-3 text-center top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-50 bg-gray-200   font-['Basis'] rounded-md shadow-white shadow-md  transition-all duration-300 ${
          collabCard ? "visible" : "hidden"
        }`}
      >
        <div className="flex w-full justify-end">
          <button
            className=" font-['Basis'] tracking-tight  px-3 py-1 rounded-sm active:scale-75 duration-200 text-white"
            onClick={() => setcollabCard(false)}
          >
            ❌
          </button>
        </div>
        <h1 className="text-lg md::text-xl tracking-tight pt-3">
          Enter the details with whom you want to collab
        </h1>

        <div className="flex flex-col gap-y-5 items-center justify-center font-['Body'] pt-5">
          <div className="flex gap-x-2 w-full justify-center items-center">
            {/* <label className="text-[0.9rem] tracking-tighter w-1/3 text-right pr-2">
              Search for user:
            </label> */}
            <input
              type="search"
              placeholder="Search for users.."
              className="w-full px-2 rounded-sm"
              value={query}
              onChange={(e) => {
                userSearch(e);
              }}
            />
          </div>

          <div
            className={`border border-black max-h-45 overflow-auto hide-scrollbar  ${
              addedUsers.length > 0
                ? "flex flex-col gap-y-2 items-center justify-center w-full rounded-sm"
                : "hidden"
            }`}
          >
            {addedUsers.map((user, idx) => {
              let initialname = user?.username.charAt(0);
              return (
                <div
                  key={user._id}
                  className="flex   gap-x-2 w-full  items-center p-2 duration-300 bg-white hover:bg-gray-800 hover:text-white"
                  onClick={() => {
                    setcollabUsers((prevuser) => {
                      const userExist = prevuser.some(
                        (curr) => curr._id === user._id
                      );
                      if (!userExist) {
                        setcollabData([
                          {
                            user: user._id,
                            role: role,
                          },
                          ...collabData,
                        ]);

                        return [user, ...prevuser];
                      } else {
                        return prevuser;
                      }
                    });
                    console.log(collabData);
                    setquery("");
                    setaddedUsers([]);
                  }}
                >
                  <div className="flex justify-between rounded-full text-xl font-extrabold text-white w-12 h-10 bg-indigo-900 overflow-auto flex-shrink-0">
                    <h1 className="m-auto">{initialname}</h1>
                  </div>
                  <div className="flex items-start  flex-col gap-y-1 font-['Basis']  overflow-ellipsis overflow-hidden">
                    <h1>{user.username}</h1>
                    <h1>{user.email}</h1>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-x-2 w-full justify-start items-center">
            <label className="text-[0.9rem] tracking-tighter text-right pl-1">
              Role :
            </label>
            <select
              className="px-1 rounded-sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="read">Read</option>
              <option value="write">Write</option>
            </select>
          </div>
          <button
            className="font-['Basis'] tracking-tight bg-indigo-700 px-3 py-1 rounded-sm active:scale-75 duration-200 text-white"
            onClick={() => updateAccess()}
          >
            Add Collab
          </button>

          <div
            className={`${
              collabUsers.length > 0
                ? "flex gap-x-2 flex-wrap w-full"
                : "hidden"
            }`}
          >
            {collabUsers.map((curr, idx) => {
              return (
                <div
                  key={idx}
                  className="bg-indigo-900 text-white flex justify-center items-center gap-x-3 font-['Body'] px-2 py-1 rounded-sm"
                >
                  <h1>{curr.username}</h1>
                  <button
                    className=" rounded-sm text-sm text-white"
                    onClick={() => {
                      setcollabUsers((prevuser) => {
                        const userExist = prevuser.some(
                          (curruser) => curruser._id === curr._id
                        );
                        if (userExist) {
                          return prevuser.filter(
                            (user) => user._id !== curr._id
                          );
                        } else {
                          return prevuser;
                        }
                      });
                      setcollabData((prevdata) => {
                        return prevdata.filter(
                          (data) => data.user !== curr._id
                        );
                      });
                    }}
                  >
                    ✖
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className={`bg-black opacity-65  z-40 fixed inset-0 ${
          !collabCard ? "hidden" : ""
        }`}
      ></div>
    </>
  );
};

export default AllDocuments;
