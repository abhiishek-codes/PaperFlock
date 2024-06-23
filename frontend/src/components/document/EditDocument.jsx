import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";

const ENDPOINT = "http://localhost:5000";
let socket;

const EditDocument = () => {
  const editorRef = useRef();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [quill, setQuill] = useState(null);
  const location = useLocation();
  const docData = location.state;

  const saveDocument = async () => {
    if (!quill || !docData || !user) return;

    try {
      const content = quill.getContents();
      await axios.post(
        `http://localhost:5000/api/documents/${docData._id}`,
        { content },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Content saved successfully:", content);
    } catch (error) {
      console.error("Failed to save document:", error);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.on("connect", () => {
      //console.log("Connected to socket:", socket.id);
      socket.emit("setup", { docData, user });
    });

    socket.on("loadDocument", (contentData) => {
      if (quill) {
        try {
          quill.clipboard.dangerouslyPasteHTML(contentData);
        } catch (e) {
          console.error("Failed to set contents:", e);
        }
        quill.enable();
      }
    });

    socket.on("readOnly", () => {
      if (quill) quill.disable();
    });

    socket.on("receive-change", (delta) => {
      if (quill) quill.updateContents(delta);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [quill, docData, user]);

  useEffect(() => {
    if (quill) {
      const handleChange = (delta, oldDelta, source) => {
        if (source !== "user") return;
        socket.emit("on-change", delta);
      };

      quill.on("text-change", handleChange);

      return () => {
        quill.off("text-change", handleChange);
      };
    }
  }, [quill]);

  useEffect(() => {
    if (quill) {
      const intervalId = setInterval(saveDocument, 10000);

      return () => clearInterval(intervalId);
    }
  }, [quill, docData]);

  useEffect(() => {
    if (editorRef.current && !quill) {
      const q = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
          ],
        },
      });
      q.disable();
      q.setText("Loading ...........");
      setQuill(q);
      //console.log("Quill instance created and set");
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mx-auto w-full h-screen my-auto">
      <div
        ref={editorRef}
        className="text-black border border-black w-[85%] h-[88%]"
      ></div>
    </div>
  );
};

export default EditDocument;
