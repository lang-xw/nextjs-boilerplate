"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { MdOutlineCloudUpload } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { TiZoomInOutline, TiZoomOutOutline } from "react-icons/ti";
import "./index.css"; // 确保CSS文件包含必要的样式
import { degrees, PDFDocument } from "pdf-lib";




export default function Home() {
    return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="body">
            <div style={{ padding: "20px" }} className="rotate">
                <h1 style={{ fontSize: "3rem" }}>Rotate PDF Pages</h1>
                <p className="tip">
                    Simply click on a page to rotate it. You can then download your modified PDF.
                </p>
            </div>

        </div>
    </main>
);}