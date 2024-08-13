"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { MdOutlineCloudUpload } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { TiZoomInOutline, TiZoomOutOutline } from "react-icons/ti";
import "./index.css"; // 确保CSS文件包含必要的样式
import { degrees, PDFDocument } from "pdf-lib";

// 设置PDF.js的worker路径，用于处理PDF文件
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

const Home = () =>   {
    // 定义状态变量：文件、页数、旋转角度、错误信息、缩放比例
    const [file, setFile] = useState<File | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [rotations, setRotations] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [scale, setScale] = useState<number>(1); // 当前缩放比例，初始值为1

    const containerWidth = 1400; // 容器宽度
    const boxWidth = 200; // 每页盒子的最大宽度
    const boxMargin = 3; // 每页盒子之间的间距

    // 当文件更改时调用，更新文件状态并重置旋转角度和错误信息
    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0] || null;
        setFile(uploadedFile);
        setRotations([]);
        setError(null);
    };

    // 当PDF加载成功时调用，设置页数并初始化旋转角度数组
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setRotations(new Array(numPages).fill(0));
    };

    // 当PDF加载失败时调用，记录错误信息并清空文件状态
    const onDocumentLoadError = (error: Error) => {
        console.error("加载 PDF 失败:", error);
        setError("加载 PDF 失败，请重试。");
        setFile(null);
    };

    // 旋转单页的函数，点击对应页面时调用
    const rotatePage = (index: number) => {
        setRotations((prev) => {
            const newRotations = [...prev];
            newRotations[index] = (newRotations[index] + 90) % 360;
            return newRotations;
        });
    };

    // 旋转所有页面的函数，点击"Rotate all"按钮时调用
    const rotateAllPages = () => {
        setRotations((prev) => prev.map((rotation) => (rotation + 90) % 360));
    };

    // 重置预览状态，移除当前PDF并重置所有状态
    const resetPreview = () => {
        setFile(null);
        setRotations([]);
        setNumPages(null);
        setError(null);
        setScale(1); // 重置缩放比例为1
    };

    // 放大预览页面的函数，每次放大10%，最大放大至2.0倍
    const zoomIn = () => {
        setScale((prev) => Math.min(prev * 1.1, 2)); // 每次放大10%，最大为2.0
    };

    // 缩小预览页面的函数，每次缩小10%，最小缩小至0.5倍
    const zoomOut = () => {
        setScale((prev) => Math.max(prev / 1.1, 0.5)); // 每次缩小10%，最小为0.5
    };

    // 下载旋转后的PDF文件
    const downloadRotatedPdf = async () => {
        if (file) {
            try {
                const pdfBytes = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
                // 处理加密问题：Error: Input document to `PDFDocument.load` is encrypted.
                // 使用 `PDFDocument.load(..., { ignoreEncryption: true })` 忽略加密

                // 根据旋转角度数组旋转每一页
                rotations.forEach((rotation, i) => {
                    const page = pdfDoc.getPage(i);
                    page.setRotation(degrees((page.getRotation().angle + rotation) % 360));
                });

                // 保存旋转后的PDF并触发下载
                const rotatedPdfBytes = await pdfDoc.save();
                const blob = new Blob([rotatedPdfBytes], { type: "application/pdf" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "rotated.pdf";
                link.click();
            } catch (error) {
                console.error("处理和下载 PDF 失败:", error);
                setError("处理 PDF 失败，请重试。");
            }
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="body">
                <div style={{ padding: "20px" }} className="rotate">
                    <h1 style={{ fontSize: "3rem" }}>Rotate PDF Pages</h1>
                    <p className="tip">
                        Simply click on a page to rotate it. You can then download your modified PDF.
                    </p>
                </div>

                {/* 如果没有上传文件且没有错误信息，则显示上传按钮 */}
                {!file && !error && (
                    <div className="upload">
                        <input
                            className="hidden"
                            type="file"
                            accept=".pdf"
                            id="upload-pdf"
                            onChange={onFileChange}
                        />
                        <label htmlFor="upload-pdf" className="label-tab">
                            <div className="flex cursor-pointer">
                                <MdOutlineCloudUpload style={{ width: "35px", height: "35px" }} />
                                <p>Click to upload</p>
                            </div>
                        </label>
                    </div>
                )}

                {/* 如果加载PDF出错，则显示错误信息 */}
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}

                {/* 如果文件已上传且没有错误，则显示控制按钮 */}
                {file && !error && (
                    <div className="controls">
                        <button onClick={rotateAllPages} className="control-button">
                            Rotate all
                        </button>
                        <button onClick={resetPreview} className="control-button">
                            Remove PDF
                        </button>
                        <p>
                            <TiZoomInOutline onClick={zoomIn} className="zoom-button" />
                        </p>
                        <TiZoomOutOutline onClick={zoomOut} className="zoom-button" />
                    </div>
                )}

                {/* 显示PDF页面预览 */}
                {file && !error && (
                    <div className="flex flex-wrap justify-center" style={{ width: `${containerWidth}px` }}>
                        <Document
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                        >
                            {numPages && Array.from(new Array(numPages), (el, index) => (
                                <div
                                    key={index}
                                    className="m-3"
                                    style={{ maxWidth: `${boxWidth * scale}px`, flex: `0 0 ${boxWidth * scale}px`, margin: `${boxMargin}px` }}
                                >
                                    <div className="pdf-page-wrapper" style={{ width: '100%', height: 'auto' }}>
                                        <Page
                                            pageNumber={index + 1}
                                            rotate={rotations[index]}
                                            width={boxWidth * scale} // 根据缩放比例设置页面宽度
                                            scale={1} // 保持比例
                                            renderTextLayer={false} // 不渲染文本图层
                                            renderAnnotationLayer={false} // 不渲染注释图层
                                        />
                                    </div>
                                    <FaArrowsRotate onClick={() => rotatePage(index)} className="rotate-button" />
                                </div>
                            ))}
                        </Document>
                    </div>
                )}

                {/* 显示下载按钮 */}
                {file && !error && (
                    <button className="download-button" onClick={downloadRotatedPdf}>
                        Download
                    </button>
                )}
            </div>
        </main>
    );
}


export default Home;