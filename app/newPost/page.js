"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import PostBottom from "../components/postBottom";
import { useRouter } from 'next/navigation';
import { useAppState } from "../context/stateContext";
import { set } from "mongoose";

const activeStyle = "text-blue-500 border-0 border-b-2 border-blue-500";
const deactiveStyle = "text-slate-200";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeBox, setActiveBox] = useState(true);
  const router = useRouter();
  const {session,status} = useAppState()
  if(status === "unauthenticated"){
    router.push('/account/login')
  }
  if(status === "loading"){
    return <div>loading...</div>
  }
  function handleCancel(){
    router.back()
  }

  async function handleSubmit(){
    const data = {userId:session.user.id,title,content}
    const res = await fetch('/api/newPost',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(data)
    })
    const responseId = await res.json()
    router.push(`/posts/${responseId}`)
    setTitle("")
    setContent("")

  }
  return (
    <>
      <div className="rounded-xl bg-gray-900 w-full sm:w-[400px] md:w-[65%] m-auto my-5 p-4 ">
        <div className="flex p-1 sm:ml-2 justify-between">
        <div className="flex">
        <button
            className={`px-1 mx-2 text-sm sm:text-lg font-semibold tracking-wider ${
              activeBox ? activeStyle : deactiveStyle
            } hover:text-blue-500`}
            disabled={activeBox ? true : false}
            onClick={() => setActiveBox(true)}
          >
            Write
          </button>
          <div className="border-l-2"></div>
          <button
            className={`px-1 mx-2 text-sm sm:text-lg font-semibold tracking-wider ${
              activeBox ? deactiveStyle : activeStyle
            } hover:text-blue-500`}
            disabled={activeBox ? false : true}
            onClick={() => setActiveBox(false)}
          >
            Preview
          </button>
        </div>
          <div className="flex">
            <button className="mx-1 p-1 px-2 font-semibold text-[#ffffff] bg-[#6c6e7120] rounded-xl  hover:bg-red-700" onClick={handleCancel}>Cancel</button>
            <button className="mx-1 p-1 px-2 font-semibold text-[#ffffff] bg-[#26a535] rounded-xl  hover:bg-green-700" onClick={handleSubmit}>Submit</button>
          </div>
        </div>

        <div className="border-b-2 border-zinc-400 mt-2"></div>
        <div className="p-3">
          {activeBox && (
            <>
            <input value={title} onChange={e=>setTitle(e.target.value)} autoFocus className="w-full outline-0 p-1 pl-3 text-xl rounded-md border-0 bg-zinc-800 text-[#f7cb90]" placeholder="Enter Title"/>
              <TextBox content={content} setContent={setContent} />
            </>
          )}
          {!activeBox && (
            <PostBottom style={`min-h-[80vh] ${content?"":"text-zinc-600"}`} title={title} content={content?content:"#### Nothing to Show Here"} />
          )}
        </div>
      </div>
    </>
  );
}

const TextBox = ({ content, setContent }) => {
  const textareaRef = useRef(null);
  function handleChange(e) {
    setContent(e.target.value);
    textareaRef.current.style.resize = "none";
    textareaRef.current.style.height = `max(80vh,${textareaRef.current.scrollHeight}px)`;
  }
  return (
    <textarea
      ref={textareaRef}
      className="mt-2  bg-transparent outline-0 border-0 w-full overflow-hidden"
      value={content}
      placeholder="Write Your Post Here"
      onChange={handleChange}
      style={{ minHeight: `80vh`, resize: "none" }}
    />
  );
};