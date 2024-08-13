"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { MdOutlineCloudUpload } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { TiZoomInOutline, TiZoomOutOutline } from "react-icons/ti";
import "./index.css"; // 确保CSS文件包含必要的样式
import { degrees, PDFDocument } from "pdf-lib";